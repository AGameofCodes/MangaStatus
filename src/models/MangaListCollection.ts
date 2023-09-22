export type MangaListCollection = {
  lists: MangaListModel[]
}

export type MangaListModel = {
  name: 'Paused' | 'Completed' | 'Planning' | 'Dropped' | 'Reading',
  isCustomList: boolean,
  isCompletedList: boolean,
  entries: MangaListEntry[]
}

export type MangaListEntry = {
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
  media: Media,
}

export type Media = {
  id: 86399
  title: {
    userPreferred: string,
    romaji: string,
    english: string,
    native: string,
  }
  coverImage: {
    extraLarge: string, //url
    large: string, //url
  }
  type: 'MANGA',
  format: 'MANGA' | any,
  status: 'RELEASING' | any,
  episodes: number | null,
  volumes: number | null,
  chapters: number | null,
  averageScore: number,
  popularity: number,
  isAdult: boolean,
  countryOfOrigin: 'JP' | 'KR' | any,
  genres: string[],
  bannerImage: string, //url
  startDate: any,
}