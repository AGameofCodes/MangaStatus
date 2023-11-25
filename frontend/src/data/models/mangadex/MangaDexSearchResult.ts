import type {MangaDexMedia} from '@/data/models/mangadex/MangaDexMedia';

export type MangaDexSearchResult = {
  result: 'ok' | string,
  response: 'collection' | string,
  data: MangaDexMedia[],
  limit: number,
  offset: number,
  total: number
}