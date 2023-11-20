import {MangaUpdatesCache} from '../cache/MangaUpdatesCache.js';
import IJob from './IJob.js';
import MangaUpdateCacheRenewJob from './MangaUpdateCacheRenewJob.js';
import {gracefulShutdown, scheduleJob} from 'node-schedule';

export default class Scheduler {
  private readonly jobs: IJob<any>[] = [];

  constructor(cache: MangaUpdatesCache) {
    this.jobs.push(
      new MangaUpdateCacheRenewJob(cache),
    );
  }

  registerJobs(): void {
    this.jobs.forEach(e => scheduleJob(e.schedule, e.execute.bind(e)));
  }

  cancelJobs(): Promise<void> {
    return gracefulShutdown();
  }
}