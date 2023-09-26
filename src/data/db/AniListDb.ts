import {type IDBPDatabase, openDB} from 'idb';
import type {AniListUser} from '@/data/models/anilist/AniListUser';
import type {AniListMangaListEntry} from '@/data/models/anilist/AniListMangaListEntry';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';

export type AlDb = IDBPDatabase<AniListDBSchema>;

export default class AniListDb {
  private intDb: IDBPDatabase<AniListDBSchema> | null = null;

  get db(): IDBPDatabase<AniListDBSchema> | null {
    return this.intDb;
  }

  static async withDb<T>(fn: (db: AlDb) => Promise<T> | T): Promise<T> {
    const db = new AniListDb();
    const idb = await db.open();
    try {
      return await fn(idb);
    } finally {
      db.close();
    }
  }

  async open(): Promise<IDBPDatabase<AniListDBSchema>> {
    this.intDb = await openDB('anilist', 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        switch (oldVersion) {
          case 0:
            const user = db.createObjectStore('user', {keyPath: 'id'});
            user.createIndex('id', 'id', {unique: true});
            user.createIndex('name', 'name', {unique: true});

            const list = db.createObjectStore('list', {keyPath: '_userId_listName'});
            list.createIndex('_userId', '_userId', {multiEntry: true});
            list.createIndex('_userId_listName', '_userId_listName', {unique: true}); // TODO multiprop indexes

            const manga = db.createObjectStore('manga', {keyPath: 'id'});
            manga.createIndex('id', 'id', {unique: true});
            manga.createIndex('_userId', '_userId', {multiEntry: true});
            manga.createIndex('_listName', '_listName', {multiEntry: true});
            manga.createIndex('_userId_listName', '_userId_listName', {multiEntry: true});

            const media = db.createObjectStore('media', {keyPath: 'id'});
            media.createIndex('id', 'id', {unique: true});
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

export type AniListDBSchema = {
  user: {
    key: 'id',
    value: AniListUser,
    indexes: {
      id: number,
      name: string
    }
  },
  list: {
    value: AniListMangaList & {
      _userId: number,
      _userId_listName: string
    },
    indexes: {
      _userId: number,
      _userId_listName: string
    }
  },
  manga: {
    key: 'id';
    value: AniListMangaListEntry & {
      _userId: number,
      _listName: string,
      _userId_listName: string
    },
    indexes: {
      id: number,
      _userId: number,
      _listName: string,
      _userId_listName: string
    }
  },
  media: {
    key: 'id';
    value: AniListMedia;
    indexes: {
      id: number
    }
  },
}