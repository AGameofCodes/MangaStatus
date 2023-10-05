import type {MangaUpdatesSearchResultRecord} from '@/data/models/mangaupdates/MangaUpdatesSearchResultRecord';
import type {MangaUpdatesSearchResultMetaData} from '@/data/models/mangaupdates/MangaUpdatesSearchResultMetaData';

export type MangaUpdatesSearchResult = {
  'total_hits': number,
  'page': number,
  'per_page': number,
  'results': [{
    'record': MangaUpdatesSearchResultRecord,
    'hit_title': string,
    'metadata': MangaUpdatesSearchResultMetaData
  }]
}