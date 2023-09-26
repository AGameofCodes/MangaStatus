import MangaUpdatesApi from '@/data/api/MangaUpdatesApi';
import {DbStore} from '@/stores/DbStore';
import {MangaStore} from '@/stores/MangaStore';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';

export default class MangaUpdatesDataService {
  private readonly mangaUpdatesApi = new MangaUpdatesApi();

  updateDb(progress: Progress): Progress {
    const mangaStore = new MangaStore();
    const dbStore = new DbStore();
    this.findMissingRelations(mangaStore, dbStore, progress)
      .then(_ => this.fetchSeriesUpdates(mangaStore, dbStore, progress))
      .then(_ => this.fetchSeriesChapterUpdates(mangaStore, dbStore, progress))
      .then(_ => progress.onFinished());
    return progress;
  }

  private async findMissingRelations(mangaStore: MangaStore, dbStore: DbStore, progress: Progress): Promise<void> {
    const allowTypes = new Set(['Manga', 'Manhwa', 'Manhua'].map(e => e.toLowerCase()));

    const media = await dbStore.aniListMangaRepository.getMedia();
    const relations = await dbStore.mangaUpdatesRepository.getRelations();
    const presentRelationIds = new Set(relations.map(e => e.aniListMediaId));

    let i = 0;
    for (const m of media) {
      try {
        if (presentRelationIds.has(m.id)) {
          continue;
        }

        const results = await this.mangaUpdatesApi.search(m.title.romaji);
        const matching = results.results
          .filter(e => allowTypes.has(e.record.type.toLowerCase())) //check if a manga or similar but not novel
          .filter(e => m.startDate.year - 1 <= e.record.year && e.record.year <= m.startDate.year + 1); //check year +-1
        if (matching.length === 0) {
          continue;
        }

        await mangaStore.addMangaUpdatesRelations([{aniListMediaId: m.id, mangaUpdatesSeriesId: matching[0].record.series_id}]);
        await new Promise((r) => setTimeout(r, 1000));
      } finally {
        await progress.onProgress('relations', ++i, media.length);
      }
    }
  }

  private async fetchSeriesUpdates(mangaStore: MangaStore, dbStore: DbStore, progress: Progress): Promise<void> {
    const relations = await dbStore.mangaUpdatesRepository.getRelations();

    let i = 0;
    for (const relation of relations) {
      try {
        const dbSeries = await dbStore.mangaUpdatesRepository.getSeriesById(relation.mangaUpdatesSeriesId);
        if (dbSeries) { // TODO check for now - lastUpdated < 1d or sth
          continue;
        }

        const series = await this.mangaUpdatesApi.get(relation.mangaUpdatesSeriesId);
        await mangaStore.updateMangaUpdatesSeries([series]);
      } finally {
        await progress.onProgress('series', ++i, relations.length);
      }
    }
  }

  private async fetchSeriesChapterUpdates(mangaStore: MangaStore, dbStore: DbStore, progress: Progress): Promise<void> {
    const series = await dbStore.mangaUpdatesRepository.getSeries();

    let i = 0;
    for (const s of series) {
      try {
        // const dbSeries = await dbStore.mangaUpdatesRepository.getSeriesById(s.series_id);
        // if (dbSeries) { // TODO check for now - lastUpdated < 1d or sth
        //   continue;
        // }

        const groups = await this.mangaUpdatesApi.groups(s.series_id);

        const updates = groups.release_list
          .map(r => {
            const match = r.chapter.match(/([0-9]+?)[^0-9]*$/);
            if (!match) {
              return [];
            }
            const chapter = parseInt(match[1]);
            return r.groups.map(g => ({series_id: s.series_id, group: g.name, chapter: chapter} as MangaUpdatesChapter));
          })
          .flat();

        //only keep chapter with the highest chapter number per group
        const filtered = Array.from(Map.groupBy(updates, c => c.group).values())
          .map(chaptersOfGroup => chaptersOfGroup.reduce((l, r) => l.chapter > r.chapter ? l : r, chaptersOfGroup[0]));
        await mangaStore.updateMangaUpdatesChapters(filtered);
      } finally {
        await progress.onProgress('chapters', ++i, series.length);
      }
    }
  }
}

export type ProgressCallBackFn = (type: string, progress: number, max: number) => (Promise<void> | void);
export type FinishCallBackFn = () => (Promise<void> | void);

export class Progress {
  readonly progress: ProgressCallBackFn;
  readonly finish: FinishCallBackFn;

  constructor(onProgress: ProgressCallBackFn, onFinish: FinishCallBackFn) {
    this.progress = onProgress;
    this.finish = onFinish;
  }

  async onProgress(type: string, progress: number, max: number): Promise<void> {
    return (this.progress ? this.progress(type, progress, max) : Promise.resolve());
  }

  async onFinished(): Promise<void> {
    return (this.finish ? this.finish() : Promise.resolve());
  }
}