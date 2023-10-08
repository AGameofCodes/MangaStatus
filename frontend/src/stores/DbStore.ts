import {Pinia, Store} from 'pinia-class-component';
import AniListMangaRepository from '@/data/repository/aniList/AniListMangaRepository';
import AniListUserRepository from '@/data/repository/aniList/AniListUserRepository';
import MangaUpdatesRepository from '@/data/repository/mangaUpdates/MangaUpdatesRepository';

@Store({
  id: 'DbStore',
  name: 'DbStore',
})
export class DbStore extends Pinia {
  //data
  private readonly intAniListMangaRepository = new AniListMangaRepository();
  private readonly intAniListUserRepository = new AniListUserRepository();
  private readonly intMangaUpdatesRepository = new MangaUpdatesRepository();

  //getter
  get aniListMangaRepository(): AniListMangaRepository {
    return this.intAniListMangaRepository;
  }

  get aniListUserRepository(): AniListUserRepository {
    return this.intAniListUserRepository;
  }

  get mangaUpdatesRepository(): MangaUpdatesRepository {
    return this.intMangaUpdatesRepository;
  }
}