import {MangaStore} from '@/stores/MangaStore';
import {DbStore} from '@/stores/DbStore';
import {ApiError} from '@/data/api/ApiUtils';
import MangaDexApi from '@/data/api/MangaDexApi';
import {Progress} from '@/data/service/Progress';
import MangaUpdatesApi from '@/data/api/MangaUpdatesApi';
import type {MangaUpdatesRelation} from '@/data/models/mangaupdates/MangaUpdatesRelation';

export default class MangaDexDataService {
  private readonly mangaDexApi = new MangaDexApi();
  private readonly mangaUpdatesApi = new MangaUpdatesApi();

  updateDb(progress: Progress): Promise<void> {
    const mangaStore = new MangaStore();
    const dbStore = new DbStore();
    return this.findMissingRelations(mangaStore, dbStore, progress)
      .catch(err => console.error(err))
      .then(_ => progress.onFinished());
  }

  private async findMissingRelations(mangaStore: MangaStore, dbStore: DbStore, progress: Progress): Promise<void> {
    const allowedTypes = new Set(['manga'].map(e => e.toLowerCase()));

    const media = await dbStore.aniListMangaRepository.getMedia();
    const relations = await dbStore.mangaUpdatesRepository.getRelations();
    const presentRelationIds = new Set(relations.map(e => e.aniListMediaId));

    let i = 0;
    for (const m of media) {
      try {
        if (presentRelationIds.has(m.id)) {
          continue;
        }

        let matching: MangaUpdatesRelation[] = [];
        for (let title of [m.title.native, m.title.romaji, m.title.english]) {
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
          matching = results.data
            .filter(e => allowedTypes.has(e.type))
            .filter(e => e.attributes.links?.al?.match(/[0-9]+/) && e.attributes.links.mu)
            .filter(e => parseInt(e.attributes.links!.al!) === m.id)
            .map(e => ({
              aniListMediaId: parseInt(e.attributes.links!.al!),
              mangaUpdatesSeriesId: e.attributes.links!.mu! as any as number, //TODO cast is hack, make pretty
            }));

          for (let j = 0; j < matching.length; j++) {
            try {
              const websiteIdSeriesIdRelation = await this.mangaUpdatesApi.seriesIdByWebsiteId(matching[j].mangaUpdatesSeriesId);
              matching[j].mangaUpdatesSeriesId = websiteIdSeriesIdRelation.series_id;
            } catch(_) {
              matching.splice(j--, 1);
            }
          }

          if (matching.length > 0) {
            break;
          }
        }

        if (matching.length === 0) {
          continue;
        }

        await mangaStore.addMangaUpdatesRelations([matching[0]]);
      } finally {
        await progress.onProgress('mangaDex.relations', ++i, media.length);
      }
    }
  }
}