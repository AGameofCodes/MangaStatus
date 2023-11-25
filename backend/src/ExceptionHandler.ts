import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';

export default function exceptionHandler(): ErrorRequestHandler {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
      console.error(err);
      res.status(500).send('Internal server error: ' + err.message);
    } catch (ex) {
      console.error('Error in exception handler!');
      console.error(ex);
    } finally {
      next();
    }
  };
}