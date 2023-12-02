export type AniListMedia = {
  id: number,
  title: {
    userPreferred: string,
    romaji: string,
    english?: string,
    native: string,
  }
  coverImage: {
    extraLarge: string, //url
    large: string, //url
  }
  type: 'MANGA' | string,
  format: 'MANGA' | string,
  status: 'RELEASING' | string,
  episodes: number | null,
  volumes: number | null,
  chapters: number | null,
  averageScore: number,
  popularity: number,
  isAdult: boolean,
  countryOfOrigin: 'JP' | 'KR' | string,
  genres: string[],
  bannerImage: string, //url
  startDate: { year: number, month: number, day: number },
}