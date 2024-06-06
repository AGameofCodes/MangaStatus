import {type IDBPDatabase, openDB} from 'idb';

export type KVDb = IDBPDatabase<KeyValueDBSchema>;

export default class KeyValueDb {
  private intDb: IDBPDatabase<KeyValueDBSchema> | null = null;

  get db(): IDBPDatabase<KeyValueDBSchema> | null {
    return this.intDb;
  }

  static async withDb<T>(fn: (db: KVDb) => Promise<T> | T): Promise<T> {
    const db = new KeyValueDb();
    const idb = await db.open();
    try {
      return await fn(idb);
    } finally {
      db.close();
    }
  }

  async open(): Promise<IDBPDatabase<KeyValueDBSchema>> {
    this.intDb = await openDB('keyValue', 1, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        switch (oldVersion) {
          case 0:
            const user = db.createObjectStore('keyValue', {keyPath: 'key'});
            user.createIndex('key', 'key', {unique: true});
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

export type KeyValueDBSchema = {
  keyValue: {
    key: 'key',
    value: { key: string, value: string },
    indexes: {
      key: number,
    }
  },
}