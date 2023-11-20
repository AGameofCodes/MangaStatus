import compression from 'compression';
import express from 'express';
import aniListRouter from './router/AniListRouter.js';
import mangaUpdatesRouter from './router/MangaUpdatesRouter.js';
import Scheduler from './schedule/Scheduler.js';
import {MangaUpdatesCache} from './cache/MangaUpdatesCache.js';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('config.json').toString())

const app = express();
const mangaUpdatesCache = new MangaUpdatesCache();
const scheduler = new Scheduler(mangaUpdatesCache);

scheduler.registerJobs();

//middlewares
app.use(compression());
app.use(express.json());

//router
app.use('/anilist', aniListRouter());
app.use('/mangaupdates', mangaUpdatesRouter(mangaUpdatesCache));
app.use(express.static('_client')) //for production

//start
app.listen(config.port, config.host, () => {
  console.log('Started server on http://' + config.host + ':' + config.port + '/');
});