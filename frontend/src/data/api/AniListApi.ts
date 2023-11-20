import type {AniListUser} from '@/data/models/anilist/AniListUser';
import {handleJsonResponse} from '@/data/api/ApiUtils';
import type {AniListMangaListCollection} from '@/data/models/anilist/AniListMangaListCollection';

export default class AniListApi {
  async fetchUser(userName: string): Promise<AniListUser> {
    const res = fetch('/anilist/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'query': 'query($id:Int,$name:String){User(id:$id,name:$name){id name previousNames{name updatedAt}avatar{large}bannerImage about isFollowing isFollower donatorTier donatorBadge createdAt moderatorRoles isBlocked bans options{profileColor restrictMessagesToFollowing}mediaListOptions{scoreFormat}statistics{anime{count meanScore standardDeviation minutesWatched episodesWatched genrePreview:genres(limit:10,sort:COUNT_DESC){genre count}}manga{count meanScore standardDeviation chaptersRead volumesRead genrePreview:genres(limit:10,sort:COUNT_DESC){genre count}}}stats{activityHistory{date amount level}}favourites{anime{edges{favouriteOrder node{id type status(version:2)format isAdult bannerImage title{userPreferred}coverImage{large}startDate{year}}}}manga{edges{favouriteOrder node{id type status(version:2)format isAdult bannerImage title{userPreferred}coverImage{large}startDate{year}}}}characters{edges{favouriteOrder node{id name{userPreferred}image{large}}}}staff{edges{favouriteOrder node{id name{userPreferred}image{large}}}}studios{edges{favouriteOrder node{id name}}}}}}',
        'variables': {'name': userName},
      }),
    });
    return ((await handleJsonResponse(res)) as any).data.User;
  }

  async fetchManga(userId: number): Promise<AniListMangaListCollection> {
    const res = fetch('/anilist/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'query': 'query($userId:Int,$userName:String,$type:MediaType){MediaListCollection(userId:$userId,userName:$userName,type:$type){lists{name isCustomList isCompletedList:isSplitCompletedList entries{...mediaListEntry}}user{id name avatar{large}mediaListOptions{scoreFormat rowOrder animeList{sectionOrder customLists splitCompletedSectionByFormat theme}mangaList{sectionOrder customLists splitCompletedSectionByFormat theme}}}}}fragment mediaListEntry on MediaList{id mediaId status score progress progressVolumes repeat priority private hiddenFromStatusLists customLists advancedScores notes updatedAt startedAt{year month day}completedAt{year month day}media{id title{userPreferred romaji english native}coverImage{extraLarge large}type format status(version:2)episodes volumes chapters averageScore popularity isAdult countryOfOrigin genres bannerImage startDate{year month day}}}',
        'variables': {'userId': userId, 'type': 'MANGA'},
      }),
    });
    return ((await handleJsonResponse(res)) as any).data.MediaListCollection;
  }
}