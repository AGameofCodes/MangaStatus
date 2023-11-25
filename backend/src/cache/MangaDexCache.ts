import * as fs from 'fs';
import {CacheEntry, loadJson, saveJson} from './CacheUtil';

export class MangaDexCache {
  private readonly FILE_CACHE_DIR = 'cache/mangadex';
  private readonly FILE_SEARCH_BY_TITLE = this.FILE_CACHE_DIR + '/searchByTitle.json';

  private readonly MAX_CACHE_AGE_SEARCH_BY_TITLE = 7 * 24 * 60 * 60 * 1000;

  private _searchByTitle = new Map<string, CacheEntry>();

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      fs.mkdirSync(this.FILE_CACHE_DIR, {recursive: true});
    } catch (_) {
    }
    this._searchByTitle = loadJson(this.FILE_SEARCH_BY_TITLE);
  }

  getSearchByTitle(title: string): string | undefined {
    const entry = this._searchByTitle.get(title);
    return !entry || entry.lastUpdateMs + this.MAX_CACHE_AGE_SEARCH_BY_TITLE < Date.now() ? undefined : entry.data;
  }

  putSearchByTitle(title: string, value: string): void {
    this._searchByTitle.set(title, {data: value, lastUpdateMs: Date.now()});
    saveJson(this.FILE_SEARCH_BY_TITLE, this._searchByTitle);
  }

  getOutOfDateSearch(): string[] {
    return Array.from(this._searchByTitle.entries())
      .filter(([title, entry]) => entry.lastUpdateMs + this.MAX_CACHE_AGE_SEARCH_BY_TITLE < Date.now())
      .map(([title, entry]) => title);
  }
}