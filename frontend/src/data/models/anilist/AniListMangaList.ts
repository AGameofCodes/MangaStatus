import type {AniListMangaListEntry} from '@/data/models/anilist/AniListMangaListEntry';

export type AniListMangaList = {
  name: 'Paused' | 'Completed' | 'Planning' | 'Dropped' | 'Reading',
  isCustomList: boolean,
  isCompletedList: boolean,
  entries: AniListMangaListEntry[]
}