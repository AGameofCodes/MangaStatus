import {NextFunction, Request, Response} from 'express';
import {MangaDexCache} from '../cache/MangaDexCache';

export class MangaDexController {
  private cache: MangaDexCache;

  constructor(cache: MangaDexCache) {
    this.cache = cache;
  }

  async manga(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const title = req.query.title as string | undefined;
      if (!title || !title.trim().length) {
        res.status(400).send('Title required!');
        next();
        return;
      }

      const fromCache = this.cache.getSearchByTitle(title);
      if (fromCache) {
        res.status(200).setHeader('Content-Type', 'application/json').send(fromCache);
        next();
        return;
      }

      //throttle
      await new Promise((r) => setTimeout(r, 1000));

      //fetch from manga updates
      const fromApi = await fetch('https://api.mangadex.org/manga?title=' + encodeURIComponent(title));
      if (fromApi.status !== 200) {
        res.status(fromApi.status).send(fromApi.body);
        next();
        return;
      }

      const fromApiJson = await fromApi.text();
      this.cache.putSearchByTitle(title, fromApiJson);

      res.status(200).setHeader('Content-Type', 'application/json').send(fromApiJson);
      next();
    } catch (e) {
      next(e);
    }
  }
}