import {Pinia, Store} from 'pinia-class-component';
import type {AniListUser} from '@/data/models/anilist/AniListUser';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';
import type CompoundMedia from '@/data/models/CompoundMedia';
import Repository from '@/data/repository/Repository';

@Store({
  id: 'MangaStore',
  name: 'MangaStore',
})
export class MangaStore extends Pinia {
  //update trigger
  private cachedAniListLists: AniListMangaList[] = [];
  private cachedMedia: CompoundMedia[] = [];
  private cachedAniListUser: AniListUser | null = null;
  private cachedUserName: string | null = null;
  private loading = false;

  private repo = new Repository();

  constructor() {
    super();
    this.updateUserName(window.localStorage.getItem('userName'));
  }

  //getter
  get aniListLists(): AniListMangaList[] {
    return this.cachedAniListLists;
  }

  get media(): CompoundMedia[] {
    return this.cachedMedia;
  }

  get mediaByAniListId(): Map<number, CompoundMedia> {
    return new Map(this.cachedMedia.map(e => [e.aniList.id, e]));
  }

  get aniListUser(): AniListUser | null {
    return this.cachedAniListUser;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  get userName(): string | null {
    return this.cachedUserName;
  }

  //actions
  async updateAniListLists(userId: number, lists: AniListMangaList[]): Promise<void> {
    await this.repo.updateLists(userId, lists);
    if (this.aniListUser?.id === userId) {
      this.cachedAniListLists.splice(0);
      this.cachedAniListLists.push(...lists);
    }
  }

  async updateAniListMedia(media: CompoundMedia[]): Promise<void> {
    await this.repo.updateMedia(media);
    this.cachedMedia.splice(0);
    this.cachedMedia.push(...media);
  }

  async updateAniListUser(user: AniListUser): Promise<void> {
    await this.repo.updateUser(user);
    if (user.name === this.userName) {
      this.cachedAniListUser = user;
    }
  }

  updateUserName(userName: string | null): void {
    if (userName) {
      window.localStorage.setItem('userName', userName ?? '');
    } else {
      window.localStorage.removeItem('userName');
    }
    this.clearCache();
    this.cachedUserName = userName;
  }

  clearCache(): void {
    this.cachedAniListLists.splice(0);
    this.cachedMedia.splice(0);
    this.cachedAniListUser = null;
  }

  async reloadCache(): Promise<void> {
    this.clearCache();

    this.loading = true;
    try {
      this.cachedMedia.push(...await this.repo.getMedia());
      if (this.userName) {
        this.cachedAniListUser = await this.repo.getUser(this.userName);
        if (this.aniListUser) {
          this.cachedAniListLists.push(...await this.repo.getMangaLists(this.aniListUser.id));
        }
      }
    } finally {
      this.loading = false;
    }
  }
}