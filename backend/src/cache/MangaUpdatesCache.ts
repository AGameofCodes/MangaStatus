import * as fs from 'fs';
import {CacheEntry, loadJson, saveJson} from './CacheUtil';

export class MangaUpdatesCache {
  private readonly FILE_CACHE_DIR = 'cache/mangaupdates';
  private readonly FILE_SEARCH_BY_TITLE = this.FILE_CACHE_DIR + '/searchByTitle.json';
  private readonly FILE_SERIES_BY_ID = this.FILE_CACHE_DIR + '/seriesById.json';
  private readonly FILE_SERIES_GROUPS_BY_ID = this.FILE_CACHE_DIR + '/seriesGroupsById.json';
  private readonly FILE_SERIES_IDS_BY_WEBSITE_ID = this.FILE_CACHE_DIR + '/seriesIdsByWebsiteId.json';

  private readonly MAX_CACHE_AGE_SEARCH_BY_TITLE = 7 * 24 * 60 * 60 * 1000;
  private readonly MAX_CACHE_AGE_SERIES_BY_ID = 30 * 24 * 60 * 60 * 1000;
  private readonly MAX_CACHE_AGE_SERIES_GROUPS_BY_ID = 1 * 24 * 60 * 60 * 1000;
  private readonly MAX_CACHE_AGE_SERIES_IDS_BY_WEBSITE_ID = 30 * 24 * 60 * 60 * 1000;

  private _searchByTitle = new Map<string, CacheEntry>();
  private _seriesById = new Map<string, CacheEntry>();
  private _seriesGroupsById = new Map<string, CacheEntry>();
  private _seriesIdsByWebsiteId = new Map<string, CacheEntry>();

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      fs.mkdirSync(this.FILE_CACHE_DIR, {recursive: true});
    } catch (_) {
    }
    this._searchByTitle = loadJson(this.FILE_SEARCH_BY_TITLE);
    this._seriesById = loadJson(this.FILE_SERIES_BY_ID);
    this._seriesGroupsById = loadJson(this.FILE_SERIES_GROUPS_BY_ID);
    this._seriesIdsByWebsiteId = loadJson(this.FILE_SERIES_IDS_BY_WEBSITE_ID);
  }

  getSearchByTitle(title: string): string | undefined {
    const entry = this._searchByTitle.get(title);
    return !entry || entry.lastUpdateMs + this.MAX_CACHE_AGE_SEARCH_BY_TITLE < Date.now() ? undefined : entry.data;
  }

  getSeriesById(id: string): string | undefined {
    const entry = this._seriesById.get(id);
    return !entry || entry.lastUpdateMs + this.MAX_CACHE_AGE_SERIES_BY_ID < Date.now() ? undefined : entry.data;
  }

  getSeriesGroupsById(id: string): string | undefined {
    const entry = this._seriesGroupsById.get(id);
    return !entry || entry.lastUpdateMs + this.MAX_CACHE_AGE_SERIES_GROUPS_BY_ID < Date.now() ? undefined : entry.data;
  }

  getSeriesIdByWebsiteId(id: string): string | undefined {
    const entry = this._seriesIdsByWebsiteId.get(id);
    return !entry || entry.lastUpdateMs + this.MAX_CACHE_AGE_SERIES_IDS_BY_WEBSITE_ID < Date.now() ? undefined : entry.data;
  }

  putSearchByTitle(title: string, value: string): void {
    this._searchByTitle.set(title, {data: value, lastUpdateMs: Date.now()});
    saveJson(this.FILE_SEARCH_BY_TITLE, this._searchByTitle);
  }

  putSeriesById(id: string, value: string): void {
    this._seriesById.set(id, {data: value, lastUpdateMs: Date.now()});
    saveJson(this.FILE_SERIES_BY_ID, this._seriesById);
  }

  putSeriesGroupsById(id: string, value: string): void {
    this._seriesGroupsById.set(id, {data: value, lastUpdateMs: Date.now()});
    saveJson(this.FILE_SERIES_GROUPS_BY_ID, this._seriesGroupsById);
  }

  putSeriesIdByWebsiteId(id: string, value: string): void {
    this._seriesIdsByWebsiteId.set(id, {data: value, lastUpdateMs: Date.now()});
    saveJson(this.FILE_SERIES_IDS_BY_WEBSITE_ID, this._seriesIdsByWebsiteId);
  }

  getOutOfDateSearch(): string[] {
    return Array.from(this._searchByTitle.entries())
      .filter(([title, entry]) => entry.lastUpdateMs + this.MAX_CACHE_AGE_SEARCH_BY_TITLE < Date.now())
      .map(([title, entry]) => title);
  }
  getOutOfDateSeries(): string[] {
    return Array.from(this._seriesById.entries())
      .filter(([title, entry]) => entry.lastUpdateMs + this.MAX_CACHE_AGE_SERIES_BY_ID < Date.now())
      .map(([title, entry]) => title);
  }
  getOutOfDateSeriesGroups(): string[] {
    return Array.from(this._seriesGroupsById.entries())
      .filter(([title, entry]) => entry.lastUpdateMs + this.MAX_CACHE_AGE_SERIES_GROUPS_BY_ID < Date.now())
      .map(([title, entry]) => title);
  }
}