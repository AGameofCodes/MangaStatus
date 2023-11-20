import IJob from './IJob';
import MangaUpdateCacheRenewService from '../service/MangaUpdateCacheRenewService.js';
import {MangaUpdatesCache} from '../cache/MangaUpdatesCache.js';

export default class MangaUpdateCacheRenewJob implements IJob<void> {
  private readonly service: MangaUpdateCacheRenewService;
  private lock: boolean = false;

  constructor(cache: MangaUpdatesCache) {
    this.service = new MangaUpdateCacheRenewService(cache);
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