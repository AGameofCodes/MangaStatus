import {MangaStore} from '@/stores/MangaStore';
import {ApiError} from '@/data/api/ApiUtils';
import MangaDexApi from '@/data/api/MangaDexApi';
import {Progress} from '@/data/service/Progress';
import type CompoundMedia from '@/data/models/CompoundMedia';
import type {MangaDexMedia} from '@/data/models/mangadex/MangaDexMedia';

export default class MangaDexDataService {
  private readonly mangaDexApi = new MangaDexApi();

  updateDb(progress: Progress): Promise<void> {
    const store = new MangaStore();
    return this.findMissingRelations(store, progress)
      .catch(err => console.error(err))
      .then(_ => progress.onFinished());
  }

  private async findMissingRelations(store: MangaStore, progress: Progress): Promise<void> {
    const allowedTypes = new Set(['manga'].map(e => e.toLowerCase()));

    const media = JSON.parse(JSON.stringify(store.media)) as CompoundMedia[];//deep copy

    let i = 0;
    for (const m of media) {
      try {
        if (m.mangaDex?.attributes.links?.mu) {
          continue;
        }

        let matching: any[] = [];
        for (let title of [m.aniList.title.native, m.aniList.title.romaji, m.aniList.title.english]) {
          if (!title?.trim().length) {
            continue;
          }
          let results;
          try {
            results = await this.mangaDexApi.search(title);
          } catch (err) {
            if (err instanceof ApiError && [400, 500].includes(err.statusCode)) {
              console.debug(err);
            } else {
              console.error(err);
            }
            continue;
          }
          matching = (results.data as MangaDexMedia[])
            .filter(e => allowedTypes.has(e.type))
            .filter(e => e.attributes.links?.al?.match(/[0-9]+/))
            .filter(e => parseInt(e.attributes.links!.al!) === m.aniList.id);

          if (matching.length > 0) {
            m.mangaDex = matching[0];
            break;
          }
        }
      } finally {
        await progress.onProgress('mangaDex.relations', ++i, media.length);
      }
    }

    await store.updateAniListMedia(media);
  }
}