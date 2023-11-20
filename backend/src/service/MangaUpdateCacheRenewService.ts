import {MangaUpdatesCache} from '../cache/MangaUpdatesCache';

export default class MangaUpdateCacheRenewService {
  private static readonly delay = 3000;

  private readonly cache: MangaUpdatesCache;

  constructor(cache: MangaUpdatesCache) {
    this.cache = cache;
  }

  async renew(): Promise<void> {
    console.log('Renewing cache ...');
    await this.renewRelations();
    await this.renewSeries();
    await this.renewUpdates();
    console.log('Renewing cache done');
  }

  async renewRelations(): Promise<void> {
    const titles = this.cache.getOutOfDateSearch();
    console.log(titles.length + ' out-of-date relations');

    for (let title of titles) {
      await new Promise((r) => setTimeout(r, MangaUpdateCacheRenewService.delay));
      try {
        const fromApi = await fetch('https://api.mangaupdates.com/v1/series/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({stype: 'title', type: 'Manga', search: title}),
        });

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

  async renewSeries(): Promise<void> {
    const ids = this.cache.getOutOfDateSeries();
    console.log(ids.length + ' out-of-date series');

    for (let id of ids) {
      await new Promise((r) => setTimeout(r, MangaUpdateCacheRenewService.delay));
      try {
        const fromApi = await fetch('https://api.mangaupdates.com/v1/series/' + id);
        if (fromApi.status !== 200) {
          continue;
        }

        const fromApiJson = await fromApi.text();
        this.cache.putSeriesById(id, fromApiJson);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async renewUpdates(): Promise<void> {
    const ids = this.cache.getOutOfDateSeriesGroups();
    console.log(ids.length + ' out-of-date series updates');

    for (let id of ids) {
      await new Promise((r) => setTimeout(r, MangaUpdateCacheRenewService.delay));
      try {
        const fromApi = await fetch('https://api.mangaupdates.com/v1/series/' + id + '/groups');
        if (fromApi.status !== 200) {
          continue;
        }

        const fromApiJson = await fromApi.text();
        this.cache.putSeriesGroupsById(id, fromApiJson);
      } catch (e) {
        console.error(e);
      }
    }
  }
}