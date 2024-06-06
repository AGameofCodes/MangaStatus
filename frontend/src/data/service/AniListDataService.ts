import AniListApi from '@/data/api/AniListApi';
import {MangaStore} from '@/stores/MangaStore';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';
import type CompoundMedia from '@/data/models/CompoundMedia';

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
    const lists = (JSON.parse(JSON.stringify(manga.lists)) as AniListMangaList[]);//deep copy
    lists.forEach(list => list.entries.forEach(ret => delete ret.media)); //delete media from entries
    await store.updateAniListLists(user.id, lists);

    const storeMedia = JSON.parse(JSON.stringify(store.media)) as CompoundMedia[];//deep copy
    const storeMediaById = new Map(storeMedia.map(e => [e.aniList.id, e]));
    manga.lists
      .map(list => list.entries.map(e => e.media)).flat()
      .filter(media => !!media)
      .map(media => JSON.parse(JSON.stringify(media)) as AniListMedia)//deep copy
      .forEach(media => {
        let compoundMedia: CompoundMedia;
        if (!storeMediaById.has(media.id)) {
          compoundMedia = {aniList: media} as CompoundMedia;
          storeMediaById.set(media.id, compoundMedia);
        } else {
          compoundMedia = storeMediaById.get(media.id)!;
        }
        compoundMedia.aniList = media;
      });

    await store.updateAniListMedia([...storeMediaById.values()]);
  }
}