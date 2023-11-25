import {NextFunction, Request, Response} from 'express';

export default class AniListController {
  async graphql(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fromApi = await fetch('https://graphql.anilist.co/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const fromApiText = await fromApi.text();
      res.status(fromApi.status).send(fromApiText);
      next();
    } catch (e) {
      next(e);
    }
  }
}