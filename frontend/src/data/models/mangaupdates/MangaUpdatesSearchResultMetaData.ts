export type MangaUpdatesSearchResultMetaData = {
  'user_list': {
    'series': {
      'id': number,
      'title': string
    },
    'list_id': number,
    'list_type': string,
    'list_icon': string,
    'status': {
      'volume': number,
      'chapter': number
    },
    'priority': number,
    'time_added': {
      'timestamp': number,
      'as_rfc3339': string,
      'as_string': string
    }
  },
  'user_genre_highlights': [{
    'genre': string,
    'color': string
  }]
}