import {Router} from 'express';
import AniListController from '../controller/AniListController';

export default function aniListRouter(): Router {
  const controller = new AniListController();
  const router = Router();
  router.post('/graphql', controller.graphql.bind(controller));
  return router;
}
