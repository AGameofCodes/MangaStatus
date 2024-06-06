import type {ViewEntry} from '@/components/manga/MangaList.vue';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';

export function latestChaptersSorted(entry: ViewEntry): MangaUpdatesChapter[] {
  return entry.media?.mangaUpdatesChapters?.sort((l, r) => l.chapter - r.chapter) ?? [];
}

export function latestChapterString(entry: ViewEntry): string {
  if (entry.media?.aniList.chapters) {
    return '' + entry.media.aniList.chapters;
  } else if (entry.media?.mangaUpdatesChapters?.length) {
    return entry.media?.mangaUpdatesChapters.reduce((l, r) => Math.max(l, r.chapter), 0) + '+';
  }
  return '?';
}

export function newChapterCount(entry: ViewEntry): number {
  const max = entry.media?.aniList.chapters
    || entry.media?.mangaUpdatesChapters?.reduce((l, r) => Math.max(l, r.chapter), 0)
    || 0;
  return Math.max(0, max - entry.entry.progress);
}

/**
 * Dynamically get a nested value from an array or
 * object with a string.
 *
 * @example get(person, 'friends[0].name')
 * @link https://github.com/rayepps/radash/blob/master/src/object.ts#L214
 */
export const get = <TDefault = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  path: string,
  defaultValue?: TDefault,
): TDefault => {
  const segments = path.split(/[.[\]]/g);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = value;
  for (const key of segments) {
    if (current === null) return defaultValue as TDefault;
    if (current === undefined) return defaultValue as TDefault;
    if (key.trim() === '') continue;
    current = current[key];
  }
  if (current === undefined) return defaultValue as TDefault;
  return current;
};
