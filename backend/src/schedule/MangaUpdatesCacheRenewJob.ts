import IJob from './IJob';
import MangaUpdatesCacheRenewService from '../service/MangaUpdatesCacheRenewService';
import {MangaUpdatesCache} from '../cache/MangaUpdatesCache.js';

export default class MangaUpdatesCacheRenewJob implements IJob<void> {
  private readonly service: MangaUpdatesCacheRenewService;
  private lock: boolean = false;

  constructor(cache: MangaUpdatesCache) {
    this.service = new MangaUpdatesCacheRenewService(cache);
  }

  get schedule(): Date | string {
    return '0 0 * * * *'; //every hour
  }

  async execute(): Promise<void> {
    if (this.lock) {
      return;
    }
    this.lock = true;
    try {
      await this.service.renew();
    } finally {
      this.lock = false;
    }
  }
}