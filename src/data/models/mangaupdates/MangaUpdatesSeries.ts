export type MangaUpdatesSeries = {
  'series_id': number,
  'title': string,
  'url': string,
  'associated': { 'title': string }[],
  'description': string,
  'image': {
    'url': {
      'original': string,
      'thumb': string
    },
    'height': number,
    'width': number
  },
  'type': 'Artbook' | 'Doujinshi' | 'Drama CD' | 'Filipino' | 'Indonesian' | 'Manga' | 'Manhwa' | 'Manhua' | 'Novel'
    | 'OEL' | 'Thai' | 'Vietnamese' | 'Malaysian' | 'Nordic' | 'French' | 'Spanish',
  'year': string,
  'bayesian_rating': number,
  'rating_votes': number,
  'genres': { 'genre': string }[],
  'categories': { 'series_id': number, 'category': string, 'votes': number, 'votes_plus': number, 'votes_minus': number, 'added_by': number }[],
  'latest_chapter': number,
  'forum_id': number,
  'status': string,
  'licensed': true,
  'completed': false,
  'anime': {
    'start': string,
    'end': string
  },
  'related_series': { 'relation_id': number, 'relation_type': string, 'related_series_id': number, 'related_series_name': string, 'triggered_by_relation_id': number }[],
  'publishers': { 'publisher_name': string, 'publisher_id': number, 'type': string, 'notes': string }[],
  'publications': { 'publication_name': string, 'publisher_name': string, 'publisher_id': number }[],
  'recommendations': { 'series_name': string, 'series_id': number, 'weight': number }[],
  'category_recommendations': { 'series_name': string, 'series_id': number, 'weight': number }[],
  'rank': {
    'position':
      {
        'week': number,
        'month': number,
        'three_months': number,
        'six_months': number,
        'year': number
      },
    'old_position':
      {
        'week': number,
        'month': number,
        'three_months': number,
        'six_months': number,
        'year': number
      },
    'lists':
      {
        'reading': number,
        'wish': number,
        'complete': number,
        'unfinished': number,
        'custom': number
      }
  },
  'last_updated': {
    'timestamp': number,
    'as_rfc3339': string,
    'as_string': string
  }
}