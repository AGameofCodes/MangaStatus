import {handleJsonResponse} from '@/data/api/ApiUtils';
import type {MangaDexSearchResult} from '@/data/models/mangadex/MangaDexSearchResult';

export default class MangaDexApi {
  search(name: string): Promise<MangaDexSearchResult> {
    const res = fetch('/mangadex/manga?title=' + encodeURIComponent(name));
    return handleJsonResponse(res);
  }
}
