import IJob from './IJob';
import MangaDexCacheRenewService from '../service/MangaDexCacheRenewService';
import {MangaDexCache} from '../cache/MangaDexCache';

export default class MangaDexCacheRenewJob implements IJob<void> {
  private readonly service: MangaDexCacheRenewService;
  private lock: boolean = false;

  constructor(cache: MangaDexCache) {
    this.service = new MangaDexCacheRenewService(cache);
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