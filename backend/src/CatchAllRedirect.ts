import {Express, NextFunction, Request, RequestHandler, Response} from 'express';

export default function catchAllRedirect(app: Express, path: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) { //already processed
      next();
      return;
    }

    req.url = path;
    (app as any).handle(req, res); //handle() is not exposed by .d.ts files
  };
}