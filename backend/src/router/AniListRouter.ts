import {NextFunction, Request, Response, Router} from 'express';

export default function aniListRouter(): Router {
  const router = Router();
  router.post('/graphql', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromApi = await fetch('https://graphql.anilist.co/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const fromApiText = await fromApi.text()
      res.status(fromApi.status).send(fromApiText);
    } catch (e) {
      console.error(e);
    }
    next();
  });

  return router;
}
