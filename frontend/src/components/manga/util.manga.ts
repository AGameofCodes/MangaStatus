import type {ViewEntry} from '@/components/manga/MangaList.vue';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';

export function latestChaptersSorted(entry: ViewEntry): MangaUpdatesChapter[] {
  return entry.chapters.sort((l, r) => l.chapter - r.chapter);
}

export function latestChapterString(entry: ViewEntry): string {
  if (entry.media?.chapters) {
    return '' + entry.media.chapters;
  } else if (entry.chapters.length) {
    return entry.chapters.reduce((l, r) => Math.max(l, r.chapter), 0) + '+';
  }
  return '?';
}

export function newChapterCount(entry: ViewEntry): number {
  const max = entry.media?.chapters || entry.chapters.reduce((l, r) => Math.max(l, r.chapter), 0);
  return Math.max(0, max - entry.entry.progress);
}
