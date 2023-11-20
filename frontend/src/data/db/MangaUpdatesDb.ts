import {type IDBPDatabase, openDB} from 'idb';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';
import type {MangaUpdatesRelation} from '@/data/models/mangaupdates/MangaUpdatesRelation';

export type MuDb = IDBPDatabase<MangaUpdatesDBSchema>;

export default class MangaUpdatesDb {
  private intDb: IDBPDatabase<MangaUpdatesDBSchema> | null = null;

  get db(): IDBPDatabase<MangaUpdatesDBSchema> | null {
    return this.intDb;
  }

  static async withDb<T>(fn: (db: MuDb) => Promise<T> | T): Promise<T> {
    const db = new MangaUpdatesDb();
    const idb = await db.open();
    try {
      return await fn(idb);
    } finally {
      db.close();
    }
  }

  async open(): Promise<IDBPDatabase<MangaUpdatesDBSchema>> {
    this.intDb = await openDB('mangaupdates', 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        switch (oldVersion) {
          case 0:
            const relation = db.createObjectStore('relation', {autoIncrement: true});
            relation.createIndex('unique', ['aniListMediaId', 'mangaUpdatesSeriesId'], {unique: true});

            const media = db.createObjectStore('series', {keyPath: 'series_id'});
            media.createIndex('series_id', 'series_id', {unique: true});

            const chapter = db.createObjectStore('chapter', {autoIncrement: true});
            chapter.createIndex('series_id', 'series_id', {multiEntry: true});
          //fall through
          default:
            break;
        }
      },
    });
    return this.intDb;
  }

  close(): void {
    this.intDb?.close();
  }
}

export type MangaUpdatesDBSchema = {
  relation: {
    key: 'id',
    value: MangaUpdatesRelation,
    indexes: {
      unique: [number, number]
    }
  },
  series: {
    key: 'series_id';
    value: MangaUpdatesSeries;
    indexes: {
      series_id: number
    }
  },
  chapter: {
    key: 'id';
    value: MangaUpdatesChapter;
    indexes: {
      series_id: number
    }
  },
}