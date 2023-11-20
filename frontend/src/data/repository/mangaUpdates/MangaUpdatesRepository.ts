import MangaUpdatesDb from '@/data/db/MangaUpdatesDb';
import type {MangaUpdatesRelation} from '@/data/models/mangaupdates/MangaUpdatesRelation';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';

export default class MangaUpdatesRepository {
  async getChapters(): Promise<MangaUpdatesChapter[]> {
    return await MangaUpdatesDb.withDb(async db => {
      return await db.getAll('chapter');
    });
  }

  async getRelations(): Promise<MangaUpdatesRelation[]> {
    return await MangaUpdatesDb.withDb(async db => {
      return await db.getAll('relation');
    });
  }

  async getSeries(): Promise<MangaUpdatesSeries[]> {
    return await MangaUpdatesDb.withDb(async db => {
      return await db.getAll('series');
    });
  }

  async getSeriesById(id: number) {
    return await MangaUpdatesDb.withDb(async db => {
      return await db.get('series', IDBKeyRange.only(id));
    });
  }

  async addRelations(newRelations: MangaUpdatesRelation[]) {
    return await MangaUpdatesDb.withDb(async db => {
      let txList = db.transaction('relation', 'readwrite');
      await Promise.allSettled([
        ...newRelations.map(relation => txList.store.add(relation)),
        txList.done]);
    });
  }

  async updateChapters(newChapters: MangaUpdatesChapter[]) {
    const seriesIds = Array.from(new Set(newChapters.map(e => e.series_id)).values());
    return await MangaUpdatesDb.withDb(async db => {
      const keysToDelete = await Promise.all(seriesIds.map(series_id => {
        return db.getAllKeysFromIndex('chapter', 'series_id', IDBKeyRange.only(series_id)) as any as Promise<number[]>;
      }));

      let txList = db.transaction('chapter', 'readwrite');
      await Promise.allSettled([
        ...keysToDelete.flat().map(key => txList.store.delete(IDBKeyRange.only(key))),
        ...newChapters.map(chapter => txList.store.add(chapter)),
        txList.done]);
    });
  }

  async updateSeries(newSeries: MangaUpdatesSeries[]) {
    return await MangaUpdatesDb.withDb(async db => {
      let txList = db.transaction('series', 'readwrite');
      await Promise.allSettled([
        ...newSeries.map(series => txList.store.put(series)),
        txList.done]);
    });
  }
}