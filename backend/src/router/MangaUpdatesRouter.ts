import {Router} from 'express';
import {MangaUpdatesController} from '../controller/MangaUpdatesController.js';
import {MangaUpdatesCache} from '../cache/MangaUpdatesCache.js';

export default function mangaUpdatesRouter(cache: MangaUpdatesCache): Router {
  const controller = new MangaUpdatesController(cache);
  const router = Router();
  router.post('/v1/series/search', controller.search.bind(controller));
  router.get('/v1/series/:id', controller.getById.bind(controller));
  router.get('/v1/series/:id/groups', controller.getGroupById.bind(controller));
  return router;
}