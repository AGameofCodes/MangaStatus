import {Pinia, Store} from 'pinia-class-component';
import AniListDataService from '@/data/service/AniListDataService';
import MangaUpdatesDataService from '@/data/service/MangaUpdatesDataService';

@Store({
  id: 'ServiceStore',
  name: 'ServiceStore',
})
export class ServiceStore extends Pinia {
  //data
  private readonly intAniListDataService = new AniListDataService();
  private readonly intMangaUpdatesDataService = new MangaUpdatesDataService();

  //getter
  get aniListDataService(): AniListDataService {
    return this.intAniListDataService;
  }

  get mangaUpdatesDataService(): MangaUpdatesDataService {
    return this.intMangaUpdatesDataService;
  }
}