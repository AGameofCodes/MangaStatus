import MangaUpdatesApi from '@/data/api/MangaUpdatesApi';
import {DbStore} from '@/stores/DbStore';
import {MangaStore} from '@/stores/MangaStore';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';
import type {MangaUpdatesSearchResultRecord} from '@/data/models/mangaupdates/MangaUpdatesSearchResultRecord';
import stringSimilarity from 'string-similarity-js';
import {ApiError} from '@/data/api/ApiUtils';
import groupBy from '@/util';
import {decode} from 'html-entities';
import {Progress} from '@/data/service/Progress';

export default class MangaUpdatesDataService {
  private readonly mangaUpdatesApi = new MangaUpdatesApi();

  updateDb(progress: Progress): Promise<void> {
    const mangaStore = new MangaStore();
    const dbStore = new DbStore();
    return this.findMissingRelations(mangaStore, dbStore, progress)
      .catch(err => console.error(err))
      .then(_ => this.fetchSeriesUpdates(mangaStore, dbStore, progress))
      .catch(err => console.error(err))
      .then(_ => this.fetchSeriesChapterUpdates(mangaStore, dbStore, progress))
      .catch(err => console.error(err))
      .then(_ => progress.onFinished());
  }

  private async findMissingRelations(mangaStore: MangaStore, dbStore: DbStore, progress: Progress): Promise<void> {
    const allowedTypes = new Set(['Manga', 'Manhwa', 'Manhua'].map(e => e.toLowerCase()));

    const media = await dbStore.aniListMangaRepository.getMedia();
    const relations = await dbStore.mangaUpdatesRepository.getRelations();
    const presentRelationIds = new Set(relations.map(e => e.aniListMediaId));

    let i = 0;
    for (const m of media) {
      try {
        if (presentRelationIds.has(m.id)) {
          continue;
        }

        let matching: { record: MangaUpdatesSearchResultRecord }[] = [];
        for (let title of [m.title.native, m.title.romaji, m.title.english]) {
          if (!title?.trim().length) {
            continue;
          }
          let results;
          try {
            results = await this.mangaUpdatesApi.search(title);
          } catch (err) {
            if (err instanceof ApiError && [400, 500].includes(err.statusCode)) {
              console.debug(err);
            } else {
              console.error(err);
            }
            continue;
          }
          const cleaner = (str: string) => {
            return str.toLowerCase().replaceAll('"', '\'').replaceAll(' - ', ' ').replaceAll(': ', ' ');
          };
          matching = results.results
            .filter(e => stringSimilarity(cleaner(title ?? ""), cleaner(decode(e.record.title)), 2, false) >= 0.95)
            .filter(e => allowedTypes.has(e.record.type.toLowerCase())) //check if a manga or similar but not novel
            .filter(e => m.startDate.year - 1 <= parseInt('' + e.record.year)
              && parseInt('' + e.record.year) <= m.startDate.year + 1); //check year +-1
          if (matching.length === 0) {
            continue;
          }
          break;
        }

        if (matching.length === 0) {
          continue;
        }

        await mangaStore.addMangaUpdatesRelations([{aniListMediaId: m.id, mangaUpdatesSeriesId: matching[0].record.series_id}]);
      } finally {
        await progress.onProgress('mangaUpdates.relations', ++i, media.length);
      }
    }
  }

  private async fetchSeriesUpdates(mangaStore: MangaStore, dbStore: DbStore, progress: Progress): Promise<void> {
    const relations = await dbStore.mangaUpdatesRepository.getRelations();

    let i = 0;
    for (const relation of relations) {
      try {
        const dbSeries = await dbStore.mangaUpdatesRepository.getSeriesById(relation.mangaUpdatesSeriesId);
        if (dbSeries) { // TODO check for now - lastUpdated < 1d or sth
          continue;
        }

        let series;
        try {
          series = await this.mangaUpdatesApi.get(relation.mangaUpdatesSeriesId);
        } catch (err) {
          if (err instanceof ApiError && [400, 500].includes(err.statusCode)) {
            console.debug(err);
          } else {
            console.error(err);
          }
          continue;
        }
        await mangaStore.updateMangaUpdatesSeries([series]);
      } finally {
        await progress.onProgress('mangaUpdates.series', ++i, relations.length);
      }
    }
  }

  private async fetchSeriesChapterUpdates(mangaStore: MangaStore, dbStore: DbStore, progress: Progress): Promise<void> {
    const series = await dbStore.mangaUpdatesRepository.getSeries();

    let i = 0;
    const cachedChapterUpdates: MangaUpdatesChapter[] = [];
    for (const s of series) {
      try {
        let groups;
        try {
          groups = await this.mangaUpdatesApi.groups(s.series_id);
        } catch (err) {
          if (err instanceof ApiError && [400, 500].includes(err.statusCode)) {
            console.debug(err);
          } else {
            console.error(err);
          }
          continue;
        }

        const updates = groups.release_list
          .map(r => {
            const match = r.chapter.match(/([0-9]+?)[^0-9]*$/);
            if (!match) {
              return [];
            }
            const chapter = parseInt(match[1]);
            return r.groups.map(g => ({series_id: s.series_id, group: g.name, chapter: chapter} as MangaUpdatesChapter));
          })
          .flat() as MangaUpdatesChapter[];

        //only keep chapter with the highest chapter number per group
        const filtered = Array.from(groupBy(updates, c => c.group).values())
          .map(chaptersOfGroup => chaptersOfGroup.reduce((l, r) => l.chapter > r.chapter ? l : r, chaptersOfGroup[0]));
        cachedChapterUpdates.push(...filtered);
      } finally {
        await progress.onProgress('mangaUpdates.chapters', ++i, series.length);
      }
    }
    await mangaStore.updateMangaUpdatesChapters(cachedChapterUpdates);
  }
}

