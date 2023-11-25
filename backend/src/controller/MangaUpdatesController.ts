import {NextFunction, Request, Response} from 'express';
import {MangaUpdatesCache} from '../cache/MangaUpdatesCache.js';

export class MangaUpdatesController {
  private cache: MangaUpdatesCache;

  constructor(cache: MangaUpdatesCache) {
    this.cache = cache;
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bjson = req.body;
    if (bjson['stype'] !== 'title' || bjson['type'] !== 'Manga' || !bjson['search']?.trim().length) {
      res.status(400).send('Only {stype: "title", type: "Manga", search: "some title"} allowed!');
      next('router');
      return;
    }

    const fromCache = this.cache.getSearchByTitle(bjson['search']);
    if (fromCache) {
      res.status(200).setHeader('Content-Type', 'application/json').send(fromCache);
      next('router');
      return;
    }

    //throttle
    await new Promise((r) => setTimeout(r, 1000));

    //fetch from manga updates
    const fromApi = await fetch('https://api.mangaupdates.com/v1/series/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bjson),
    });

    if (fromApi.status !== 200) {
      res.status(fromApi.status).send(fromApi.body);
      next('router');
      return;
    }

    const fromApiJson = await fromApi.text();
    this.cache.putSearchByTitle(bjson['search'], fromApiJson);

    res.status(200).setHeader('Content-Type', 'application/json').send(fromApiJson);
    next('router');
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id!.toLowerCase();

    const fromCache = this.cache.getSeriesById(id);
    if (fromCache) {
      res.status(200).setHeader('Content-Type', 'application/json').send(fromCache);
      next();
      return;
    }

    //throttle
    await new Promise((r) => setTimeout(r, 1000));

    //fetch from manga updates
    const fromApi = await fetch('https://api.mangaupdates.com/v1/series/' + id);
    if (fromApi.status !== 200) {
      res.status(fromApi.status).send(fromApi.body);
      next();
      return;
    }

    const fromApiJson = await fromApi.text();
    this.cache.putSeriesById(id, fromApiJson);

    res.status(200).setHeader('Content-Type', 'application/json').send(fromApiJson);
    next();
  }

  async getGroupById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id!.toLowerCase();

    const fromCache = this.cache.getSeriesGroupsById(id);
    if (fromCache) {
      res.status(200).setHeader('Content-Type', 'application/json').send(fromCache);
      next();
      return;
    }

    //throttle
    await new Promise((r) => setTimeout(r, 1000));

    //fetch from manga updates
    const fromApi = await fetch('https://api.mangaupdates.com/v1/series/' + id + '/groups');
    if (fromApi.status !== 200) {
      res.status(fromApi.status).send(fromApi.body);
      next();
      return;
    }

    const fromApiJson = await fromApi.text();
    this.cache.putSeriesGroupsById(id, fromApiJson);

    res.status(200).setHeader('Content-Type', 'application/json').send(fromApiJson);
    next();
  }

  async getSeriesIdFromWebsiteId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.websiteId;
      if (!id || !id.trim().length || !id.match(/^[0-9a-zA-Z]+$/)) {
        res.status(400).send('Website id required!');
        next();
        return;
      }

      const fromCache = this.cache.getSeriesIdByWebsiteId(id);
      if (fromCache) {
        res.status(200).send(fromCache);
        next();
        return;
      }

      //throttle
      await new Promise((r) => setTimeout(r, 1000));

      //fetch from manga updates
      const fromApi = await fetch(id.match(/^[0-9]+$/)
        ? 'https://www.mangaupdates.com/series.html?id=' + id
        : 'https://www.mangaupdates.com/series/' + id);
      if (fromApi.status !== 200) {
        res.status(fromApi.status).send(fromApi.body);
        next();
        return;
      }

      const fromApiHtml = await fromApi.text();
      const match = fromApiHtml.match(/https:\/\/api.mangaupdates.com\/v1\/series\/([0-9]+)\/rss/);
      if (!match) {
        res.status(404).send('Series id not found in website!');
        next();
        return;
      }
      const json = JSON.stringify({website_id: id, series_id: parseInt(match[1]!)});
      this.cache.putSeriesIdByWebsiteId(id, json);

      res.status(200).send(json);
      next();
    } catch (e) {
      next(e);
    }
  }
}