import * as fs from 'fs';

export type CacheEntry = { data: string, lastUpdateMs: number }

export function loadJson(file: string): Map<string, CacheEntry> {
  try {
    const data = fs.readFileSync(file, {encoding: 'utf8', flag: 'r'});
    const json = JSON.parse(data);
    return new Map<string, CacheEntry>(Object.entries(json));
  } catch (err) {
    console.error('Failed to load cache from ' + file + ':' + (err as Error).message);
    return new Map();
  }
}

export function saveJson(file: string, map: Map<string, CacheEntry>): void {
  try {
    const data = JSON.stringify(Object.fromEntries(map.entries()));
    fs.writeFileSync(file, data, {encoding: 'utf8', flag: 'w'});
  } catch (err) {
    console.error(err);
  }
}