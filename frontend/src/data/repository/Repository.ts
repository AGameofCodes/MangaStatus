import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';
import type CompoundMedia from '@/data/models/CompoundMedia';
import type {AniListUser} from '@/data/models/anilist/AniListUser';
import KeyValueDb from '@/data/db/KeyValueDb';

export default class Repository {
  async getUser(userName: string): Promise<AniListUser | null> {
    return await KeyValueDb.withDb(async db => {
      const data = (await db.get('keyValue', IDBKeyRange.only('anilist_user_' + userName)))?.value ?? null;
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    });
  }

  async getMangaLists(userId: number): Promise<AniListMangaList[]> {
    return await KeyValueDb.withDb(async db => {
      return JSON.parse((await db.get('keyValue', IDBKeyRange.only('anilist_mangalists_' + userId)))?.value ?? '[]');
    });
  }

  async getMedia(): Promise<CompoundMedia[]> {
    return await KeyValueDb.withDb(async db => {
      return JSON.parse((await db.get('keyValue', IDBKeyRange.only('media')))?.value ?? '[]');
    });
  }

  async updateUser(user: AniListUser): Promise<void> {
    await KeyValueDb.withDb(async db => {
      await db.put('keyValue', {
        key: 'anilist_user_' + user.name,
        value: JSON.stringify(user),
      }).catch(err => console.error(err));
    });
  }

  async updateLists(userId: number, lists: AniListMangaList[]): Promise<void> {
    await KeyValueDb.withDb(async db => {
      await db.put('keyValue', {
        key: 'anilist_mangalists_' + userId,
        value: JSON.stringify(lists),
      }).catch(err => console.error(err));
    });
  }

  async updateMedia(media: CompoundMedia[]): Promise<void> {
    const dbMedia = new Map((await this.getMedia()).map(e => [e.aniList.id, e]));
    media.forEach(e => dbMedia.set(e.aniList.id, e));
    await KeyValueDb.withDb(async db => {
      await db.put('keyValue', {
        key: 'media',
        value: JSON.stringify([...dbMedia.values()]),
      }).catch(err => console.error(err));
    });
  }
}
