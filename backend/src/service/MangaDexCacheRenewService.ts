import {MangaDexCache} from '../cache/MangaDexCache';

export default class MangaDexCacheRenewService {
  private static readonly delay = 3000;

  private readonly cache: MangaDexCache;

  constructor(cache: MangaDexCache) {
    this.cache = cache;
  }

  async renew(): Promise<void> {
    console.log('Renewing MangaDex cache ...');
    await this.renewMedia();
    console.log('Renewing MangaDex cache done');
  }

  async renewMedia(): Promise<void> {
    const titles = this.cache.getOutOfDateSearch();
    console.log(titles.length + ' out-of-date media');

    for (let title of titles) {
      await new Promise((r) => setTimeout(r, MangaDexCacheRenewService.delay));
      try {
        const fromApi = await fetch('https://api.mangadex.org/manga?title=' + encodeURIComponent(title));
        if (fromApi.status !== 200) {
          continue;
        }

        const fromApiJson = await fromApi.text();
        this.cache.putSearchByTitle(title, fromApiJson);
      } catch (e) {
        console.error(e);
      }
    }
  }
}