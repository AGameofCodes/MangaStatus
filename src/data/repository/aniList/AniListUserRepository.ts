import type {AniListUser} from '@/data/models/anilist/AniListUser';
import AniListDb from '@/data/db/AniListDb';

export default class AniListUserRepository {
  async getUser(userName: string): Promise<AniListUser | null> {
    return await AniListDb.withDb(async db => {
      return await db.getFromIndex('user', 'name', IDBKeyRange.only(userName)) ?? null;
    });
  }

  async updateUser(user: AniListUser): Promise<void> {
    return await AniListDb.withDb(async db => {
      await db.put('user', user);
    });
  }
}