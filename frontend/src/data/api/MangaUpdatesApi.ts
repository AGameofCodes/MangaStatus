import {handleJsonResponse} from '@/data/api/ApiUtils';

import type {MangaUpdatesSearchResult} from '@/data/models/mangaupdates/MangaUpdatesSearchResult';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';
import type {MangaUpdatesSeriesGroups} from '@/data/models/mangaupdates/MangaUpdatesSeriesGroups';
import type {
  MangaUpdatesWebsiteIdSeriesIdRelation
} from '@/data/models/mangaupdates/MangaUpdatesWebsiteIdSeriesIdRelation';

export default class MangaUpdatesApi {
  search(name: string): Promise<MangaUpdatesSearchResult> {
    const res = fetch('/mangaupdates/v1/series/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        search: name,
        stype: 'title',
        type: 'Manga',
      }),
    });
    return handleJsonResponse(res);
  }

  get(id: number): Promise<MangaUpdatesSeries> {
    const res = fetch(`/mangaupdates/v1/series/${id}`);
    return handleJsonResponse(res);
  }

  groups(id: number): Promise<MangaUpdatesSeriesGroups> {
    const res = fetch(`/mangaupdates/v1/series/${id}/groups`);
    return handleJsonResponse(res);
  }

  seriesIdByWebsiteId(websiteId: number): Promise<MangaUpdatesWebsiteIdSeriesIdRelation> {
    const res = fetch('/mangaupdates/series_id_from_website_id/' + websiteId);
    return handleJsonResponse(res);
  }
}
