import {MangaUpdatesCache} from '../cache/MangaUpdatesCache.js';
import IJob from './IJob.js';
import MangaUpdatesCacheRenewJob from './MangaUpdatesCacheRenewJob';
import {gracefulShutdown, scheduleJob} from 'node-schedule';
import {MangaDexCache} from '../cache/MangaDexCache';
import MangaDexCacheRenewJob from './MangaDexCacheRenewJob';

export default class Scheduler {
  private readonly jobs: IJob<any>[] = [];

  constructor(mangaDexCache: MangaDexCache, mangaUpdatesCache: MangaUpdatesCache) {
    this.jobs.push(
      new MangaDexCacheRenewJob(mangaDexCache),
      new MangaUpdatesCacheRenewJob(mangaUpdatesCache),
    );
  }

  registerJobs(): void {
    this.jobs.forEach(e => scheduleJob(e.schedule, e.execute.bind(e)));
  }

  cancelJobs(): Promise<void> {
    return gracefulShutdown();
  }
}