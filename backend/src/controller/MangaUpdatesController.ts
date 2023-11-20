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
}