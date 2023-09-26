import type {SearchResultRecord} from '@/data/models/mangaupdates/MangaUpdateSearchResult';
import type {MangaUpdatesSearchResultMetaData} from '@/data/models/mangaupdates/MangaUpdatesSearchResultMetaData';

export type MangaUpdatesSearchResult = {
  'total_hits': number,
  'page': number,
  'per_page': number,
  'results': [{
    'record': SearchResultRecord,
    'hit_title': string,
    'metadata': MangaUpdatesSearchResultMetaData
  }]
}