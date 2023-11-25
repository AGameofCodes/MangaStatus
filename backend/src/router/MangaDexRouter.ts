import {Router} from 'express';
import {MangaDexController} from '../controller/MangaDexController';
import {MangaDexCache} from '../cache/MangaDexCache';

export default function mangaDexRouter(cache: MangaDexCache): Router {
  const controller = new MangaDexController(cache);
  const router = Router();
  router.get('/manga', controller.manga.bind(controller));
  return router;
}