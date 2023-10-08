import {Pinia, Store} from 'pinia-class-component';
import type {AniListUser} from '@/data/models/anilist/AniListUser';
import {DbStore} from '@/stores/DbStore';
import type {AniListMangaListEntry} from '@/data/models/anilist/AniListMangaListEntry';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';
import type {MangaUpdatesRelation} from '@/data/models/mangaupdates/MangaUpdatesRelation';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';

@Store({
  id: 'MangaStore',
  name: 'MangaStore',
})
export class MangaStore extends Pinia {
  //update trigger
  private cachedAniListLists: AniListMangaList[] = [];
  private cachedAniListManga = new Map<string, AniListMangaListEntry[]>();
  private cachedAniListMedia: AniListMedia[] = [];
  private cachedAniListUser: AniListUser | null = null;
  private cachedMangaUpdatesChapters: MangaUpdatesChapter[] = [];
  private cachedMangaUpdatesSeries: MangaUpdatesSeries[] = [];
  private cachedMangaUpdatesRelations: MangaUpdatesRelation[] = [];
  private cachedUserName: string | null = null;

  constructor() {
    super();
    this.updateUserName(window.localStorage.getItem('userName'));
  }

  //getter
  get aniListLists(): AniListMangaList[] {
    return this.cachedAniListLists;
  }

  get aniListManga(): Map<string, AniListMangaListEntry[]> {
    return this.cachedAniListManga;
  }

  get aniListMedia(): AniListMedia[] {
    return this.cachedAniListMedia;
  }

  get aniListUser(): AniListUser | null {
    return this.cachedAniListUser;
  }

  get mangaUpdatesChapters(): MangaUpdatesChapter[] {
    return this.cachedMangaUpdatesChapters;
  }

  get mangaUpdatesRelations(): MangaUpdatesRelation[] {
    return this.cachedMangaUpdatesRelations;
  }

  get mangaUpdatesSeries(): MangaUpdatesSeries[] {
    return this.cachedMangaUpdatesSeries;
  }

  get userName(): string | null {
    return this.cachedUserName;
  }

  //stores
  private get dbStore(): DbStore {
    return new DbStore();
  }

  //actions
  async updateAniListLists(userId: number, lists: AniListMangaList[]): Promise<void> {
    await this.dbStore.aniListMangaRepository.patchLists(userId, lists);
    if (this.aniListUser?.id === userId) {
      this.cachedAniListLists.splice(0);
      this.cachedAniListLists.push(...lists);
    }
  }

  async updateAniListManga(userId: number, manga: Map<string, AniListMangaListEntry[]>): Promise<void> {
    await this.dbStore.aniListMangaRepository.patchManga(userId, manga);
    if (this.aniListUser?.id === userId) {
      this.cachedAniListManga.clear();
      manga.forEach((v, k) => this.cachedAniListManga.set(k, v));
    }
  }

  async updateAniListMedia(media: AniListMedia[]): Promise<void> {
    await this.dbStore.aniListMangaRepository.updateMedia(media);
    this.cachedAniListMedia.splice(0);
    this.cachedAniListMedia.push(...media);
  }

  async updateAniListUser(user: AniListUser): Promise<void> {
    await this.dbStore.aniListUserRepository.updateUser(user);
    if (user.name === this.userName) {
      this.cachedAniListUser = user;
    }
  }

  async updateMangaUpdatesChapters(chapters: MangaUpdatesChapter[]): Promise<void> {
    await this.dbStore.mangaUpdatesRepository.updateChapters(chapters);

    // update cache
    const cachedById = Map.groupBy(this.cachedMangaUpdatesChapters, c => c.series_id);
    const chaptersById = Map.groupBy(chapters, c => c.series_id);
    chaptersById.forEach((v, k) => cachedById.set(k, v));
    this.cachedMangaUpdatesChapters.splice(0);
    this.cachedMangaUpdatesChapters.push(...Array.from(cachedById.values()).flat());
  }

  async updateMangaUpdatesSeries(media: MangaUpdatesSeries[]): Promise<void> {
    await this.dbStore.mangaUpdatesRepository.updateSeries(media);

    // update cache
    const cachedById = new Map<number, MangaUpdatesSeries>(this.cachedMangaUpdatesSeries.map(e => [e.series_id, e]));
    media.forEach(m => cachedById.set(m.series_id, m));
    this.cachedMangaUpdatesSeries.splice(0);
    this.cachedMangaUpdatesSeries.push(...Array.from(cachedById.values()));
  }

  async addMangaUpdatesRelations(relations: MangaUpdatesRelation[]): Promise<void> {
    await this.dbStore.mangaUpdatesRepository.addRelations(relations);
    this.cachedMangaUpdatesRelations.push(...relations);
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
    this.cachedAniListManga.clear();
    this.cachedAniListLists.splice(0);
    this.cachedAniListMedia.splice(0);
    this.cachedAniListUser = null;
    this.cachedMangaUpdatesChapters.splice(0);
    this.cachedMangaUpdatesSeries.splice(0);
    this.cachedMangaUpdatesRelations.splice(0);
  }

  async reloadCache(): Promise<void> {
    this.clearCache();

    this.cachedAniListMedia.push(...await this.dbStore.aniListMangaRepository.getMedia());
    if (this.userName) {
      this.cachedAniListUser = await this.dbStore.aniListUserRepository.getUser(this.userName);
      if (this.aniListUser) {
        this.cachedAniListLists.push(...await this.dbStore.aniListMangaRepository.getMangaLists(this.aniListUser.id));
        const manga = await this.dbStore.aniListMangaRepository.getManga(this.aniListUser.id);
        manga.forEach((v, k) => this.cachedAniListManga.set(k, v));
      }
    }

    this.cachedMangaUpdatesChapters.push(...await this.dbStore.mangaUpdatesRepository.getChapters());
    this.cachedMangaUpdatesSeries.push(...await this.dbStore.mangaUpdatesRepository.getSeries());
    this.cachedMangaUpdatesRelations.push(...await this.dbStore.mangaUpdatesRepository.getRelations());
  }
}