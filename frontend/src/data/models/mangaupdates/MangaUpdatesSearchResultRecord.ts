export type MangaUpdatesSearchResultRecord = {
  'series_id': number,
  'title': string,
  'url': string,
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
  'genres': [{
    'genre': string
  }],
  'latest_chapter': number,
  'rank': {
    'position': {
      'week': number,
      'month': number,
      'three_months': number,
      'six_months': number,
      'year': number
    },
    'old_position': {
      'week': number,
      'month': number,
      'three_months': number,
      'six_months': number,
      'year': number
    },
    'lists': {
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
  },
  'admin': {
    'added_by': {
      'user_id': number,
      'username': string,
      'url': string,
      'avatar': {
        'id': number,
        'url': string,
        'height': number,
        'width': number
      },
      'time_joined': {
        'timestamp': number,
        'as_rfc3339': string,
        'as_string': string
      },
      'signature': string,
      'forum_title': string,
      'folding_at_home': true,
      'profile': {
        'upgrade': {
          'requested': true,
          'reason': string
        }
      },
      'stats': {
        'forum_posts': number,
        'added_authors': number,
        'added_groups': number,
        'added_publishers': number,
        'added_releases': number,
        'added_series': number
      },
      'user_group': string,
      'user_group_name': string
    },
    'approved': true
  }
};


