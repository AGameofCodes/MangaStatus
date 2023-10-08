import AniListApi from '@/data/api/AniListApi';
import {MangaStore} from '@/stores/MangaStore';
import type {AniListMangaListEntry} from '@/data/models/anilist/AniListMangaListEntry';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';

export default class AniListDataService {
  async updateDb(): Promise<void> {
    const store = new MangaStore();
    const userName = store.userName;
    if (!userName) {
      return Promise.reject('No username set');
    }

    const api = new AniListApi();

    const user = await api.fetchUser(userName);
    await store.updateAniListUser(user);

    const manga = await api.fetchManga(user.id);
    const lists = manga.lists
      .map(e => {
        const ret = {...e} as AniListMangaList; //shallow copy
        delete (ret as any).entries;
        return ret;
      });
    const mangaByList = new Map<string, AniListMangaListEntry[]>(manga.lists
      .map(list => {
        const entries = [...list.entries.map(manga => {
          const ret = {...manga} as AniListMangaListEntry; //shallow copy
          delete (ret as any).media;
          return ret;
        })];
        return [list.name, entries];
      }));

    const media = manga.lists
      .map(e => e.entries.map(e => e.media)).flat()
      .filter(e => e)//not null
      .map(e => ({...e} as AniListMedia)); //shallow copy

    await store.updateAniListLists(user.id, lists);
    await store.updateAniListManga(user.id, mangaByList);
    await store.updateAniListMedia(media);
  }
}