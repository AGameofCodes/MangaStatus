import type {AniListMedia} from '@/data/models/anilist/AniListMedia';

export type AniListMangaListEntry = {
  id: number,
  mediaId: number,
  status: 'PAUSED' | 'COMPLETED' | 'PLANNING' | 'DROPPED' | 'READING',
  score: number,
  progress: number,
  progressVolumes: number,
  repeat: number,
  priority: number,
  private: boolean,
  hiddenFromStatusLists: boolean,
  customLists: any,
  advancedScores: any,
  notes: any,
  updatedAt: number
  startedAt: any,
  completedAt: any,
  media: AniListMedia,
}