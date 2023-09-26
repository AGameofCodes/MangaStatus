export type MangaUpdatesSeriesGroups = {
  'group_list': {
    'group_id': number,
    'name': string,
    'url': string,
    'social': {
      'site': string,
      'facebook': string,
      'twitter': string,
      'irc': { 'channel': string, 'server': string },
      'forum': string,
      'discord': string
    },
    'active': true
  }[],
  'release_list': {
    'id': number,
    'title': string,
    'volume': null,
    'chapter': string,
    'groups': { 'name': string, 'group_id': number }[],
    'release_date': string,
    'time_added': { 'timestamp': number, 'as_rfc3339': string, 'as_string': string }
  }[]
}