import AniListDb, {type AlDb} from '@/data/db/AniListDb';
import {strip_} from '@/data/db/DbUtil';
import type {AniListMangaListEntry} from '@/data/models/anilist/AniListMangaListEntry';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';

export default class AniListMangaRepository {
  async getMangaLists(userId: number): Promise<AniListMangaList[]> {
    return await AniListDb.withDb(async db => {
      return (await db.getAllFromIndex('list', '_userId', userId)).map(strip_);
    });
  }

  async getManga(userId: number): Promise<Map<string, AniListMangaListEntry[]>> {
    return await AniListDb.withDb(async db => {
      const lists = (await db.getAllFromIndex('list', '_userId', userId)) as AniListMangaList[];
      const arr = await Promise.all(lists.map(async list => {
        let entries = (await db
            .getAllFromIndex('manga', '_userId_listName', IDBKeyRange.only(userId + '_' + list.name))
        ) as AniListMangaListEntry[];
        return [list.name, entries.map(strip_)] as [string, AniListMangaListEntry[]];
      }));
      return new Map<string, AniListMangaListEntry[]>(arr);
    });
  }

  async getMedia(): Promise<AniListMedia[]> {
    return await AniListDb.withDb(async db => {
      return (await db.getAll('media')).map(strip_);
    });
  }

  async patchLists(userId: number, lists: AniListMangaList[]): Promise<void> {
    await AniListDb.withDb(async db => {
      await this.patchMangaDropUnnecessaryDbs(db, userId, lists);

      await Promise.allSettled(lists.map(async list => {
        await this.patchMangaList(db, userId, list);
      }));
    });
  }

  async patchManga(userId: number, manga: Map<string, AniListMangaListEntry[]>): Promise<void> {
    await AniListDb.withDb(async db => {
      await Promise.allSettled(Array.from(manga.entries()).map(async ([listName, entries]) => {
        await this.patchMangaListEntries(db, userId, listName, entries);
      }));
    });
  }

  async updateMedia(media: AniListMedia[]): Promise<void> {
    await AniListDb.withDb(async db => {
      await this.patchMangaMedia(db, media);
    });
  }

  private async patchMangaDropUnnecessaryDbs(db: AlDb, userId: number, lists: AniListMangaList[]): Promise<void> {
    //drop lists if necessary
    const newListNames = new Set(lists.map(e => e.name as string));
    const listNamesPresent = (await db.getAllKeysFromIndex('list', '_userId', userId)) as string[];
    const listNamesToDrop = listNamesPresent.filter(listName => !newListNames.has(listName));
    let txList = db.transaction('list', 'readwrite');
    await Promise.allSettled([...listNamesToDrop.map(async listName => {
      await txList.store.delete(listName);
    }), txList.done]);

    //drop manga if necessary
    const mangaIdGroupsToDrop = await Promise.all(listNamesToDrop.map(async listName => {
      const ret = await db.getAllKeysFromIndex('manga', '_userId_listName', IDBKeyRange.only(userId + '_' + listName));
      return ret as string[];
    }));
    const mangaIdsToDrop = mangaIdGroupsToDrop.flat();
    const txManga = db.transaction('manga', 'readwrite');
    await Promise.allSettled([...mangaIdsToDrop.map(async mangaId => {
      await txManga.store.delete(mangaId);
    }), txManga.done]);
  }

  private async patchMangaList(db: AlDb, userId: number, list: AniListMangaList): Promise<void> {
    const o = {...list, _userId: userId, _userId_listName: userId + '_' + list.name} as any;
    delete o.entries;
    await db.put('list', o).catch(err => console.error(err));
  }

  private async patchMangaListEntries(db: AlDb, userId: number, listName: string, entries: AniListMangaListEntry[]): Promise<void> {
    // console.log("patchMangaListEntries", list);

    //drop entries if necessary
    const newEntryIds = new Set(entries.map(e => e.id));
    const entryIdsPresent = (await db
      .getAllKeysFromIndex('manga', '_userId_listName', IDBKeyRange.only(userId + '_' + listName))) as number[];
    const entryIdsToDrop = entryIdsPresent.filter(e => !newEntryIds.has(e));
    let tx = db.transaction('manga', 'readwrite');
    await Promise.allSettled([...entryIdsToDrop.map(async entryId => {
      await tx.store.delete(entryId).catch(err => console.error(err));
    }), tx.done]);

    //create/update entries
    tx = db.transaction('manga', 'readwrite');
    await Promise.allSettled([...entries.map(async entry => {
      const o = {...entry, _userId: userId, _listName: listName, _userId_listName: userId + '_' + listName} as any;
      delete o.media;
      await tx.store.put(o).catch(err => console.error(err));
    }), tx.done]);
  }

  private async patchMangaMedia(db: AlDb, media: AniListMedia[]): Promise<void> {
    //create/update entries
    let tx = db.transaction('media', 'readwrite');
    await Promise.allSettled([...media.map(async entry => {
      await tx!.store.put(entry).catch(err => console.error(err));
    }), tx.done]);
  }
}
