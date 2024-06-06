import MangaUpdatesApi from '@/data/api/MangaUpdatesApi';
import {MangaStore} from '@/stores/MangaStore';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';
import {ApiError} from '@/data/api/ApiUtils';
import groupBy from '@/util';
import {Progress} from '@/data/service/Progress';
import type CompoundMedia from '@/data/models/CompoundMedia';

export default class MangaUpdatesDataService {
  private readonly mangaUpdatesApi = new MangaUpdatesApi();

  updateDb(progress: Progress): Promise<void> {
    const store = new MangaStore();
    return this.fetchSeriesUpdates(store, progress)
      .catch(err => console.error(err))
      .then(_ => this.fetchSeriesChapterUpdates(store, progress))
      .catch(err => console.error(err))
      .then(_ => progress.onFinished());
  }

  private async fetchSeriesUpdates(store: MangaStore, progress: Progress): Promise<void> {
    const media = JSON.parse(JSON.stringify(store.media)) as CompoundMedia[];//deep copy

    let i = 0;
    for (const m of media) {
      try {
        if (!m.mangaDex?.attributes.links?.mu) {
          continue;
        }

        let series;
        try {
          const rel = await this.mangaUpdatesApi.seriesIdByWebsiteId(m.mangaDex.attributes.links.mu as any as number);//TODO
          series = await this.mangaUpdatesApi.get(rel.series_id as any as number);//TODO
        } catch (err) {
          if (err instanceof ApiError && [400, 500].includes(err.statusCode)) {
            console.debug(err);
          } else {
            console.error(err);
          }
          continue;
        }
        m.mangaUpdates = series;
      } finally {
        await progress.onProgress('mangaUpdates.series', ++i, media.length);
      }
    }
    await store.updateAniListMedia(media);
  }

  private async fetchSeriesChapterUpdates(store: MangaStore, progress: Progress): Promise<void> {
    const media = JSON.parse(JSON.stringify(store.media)) as CompoundMedia[];//deep copy

    let i = 0;
    const cachedChapterUpdates: MangaUpdatesChapter[] = [];
    for (const m of media) {
      try {
        if (!m.mangaUpdates) {
          continue;
        }

        let groups;
        try {
          groups = await this.mangaUpdatesApi.groups(m.mangaUpdates.series_id);
        } catch (err) {
          if (err instanceof ApiError && [400, 500].includes(err.statusCode)) {
            console.debug(err);
          } else {
            console.error(err);
          }
          continue;
        }

        const updates = groups.release_list
          .map(r => {
            const match = r.chapter.match(/([0-9]+?)[^0-9]*$/);
            if (!match) {
              return [];
            }
            const chapter = parseInt(match[1]);
            return r.groups.map(g => ({
              series_id: m.mangaUpdates!.series_id,
              group: g.name,
              chapter: chapter,
            } as MangaUpdatesChapter));
          })
          .flat() as MangaUpdatesChapter[];

        //only keep chapter with the highest chapter number per group
        m.mangaUpdatesChapters = Array.from(groupBy(updates, c => c.group).values())
          .map(chaptersOfGroup => chaptersOfGroup.reduce((l, r) => l.chapter > r.chapter ? l : r, chaptersOfGroup[0]));
      } finally {
        await progress.onProgress('mangaUpdates.chapters', ++i, media.length);
      }
    }
    await store.updateAniListMedia(media);
  }
}

