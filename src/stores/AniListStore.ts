import {Pinia, Store} from 'pinia-class-component';
import type {User} from '@/models/User';
import type {MangaListCollection} from '@/models/MangaListCollection';

@Store({
  id: 'AniListStore',
  name: 'AniListStore',
})
export class AniListStore extends Pinia {
  //data
  private x_manga: MangaListCollection | null = null;
  private userNameUpdateTrigger: string | null = null;
  private x_user: User | null = null;

  //getter
  get manga(): MangaListCollection | null {
    return this.x_manga;
  }

  get userName(): string | null {
    this.userNameUpdateTrigger;
    return window.localStorage.getItem('userName');
  }

  get user(): User | null {
    return this.x_user;
  }

  //actions
  setUserName(userName: string | null) {
    this.userNameUpdateTrigger = userName;
    if (userName) {
      window.localStorage.setItem('userName', userName ?? '');
    } else {
      window.localStorage.removeItem('userName');
    }
  }

  async reload(): Promise<void> {
    if (!this.userName) {
      return;
    }

    let res = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'query': 'query($id:Int,$name:String){User(id:$id,name:$name){id name previousNames{name updatedAt}avatar{large}bannerImage about isFollowing isFollower donatorTier donatorBadge createdAt moderatorRoles isBlocked bans options{profileColor restrictMessagesToFollowing}mediaListOptions{scoreFormat}statistics{anime{count meanScore standardDeviation minutesWatched episodesWatched genrePreview:genres(limit:10,sort:COUNT_DESC){genre count}}manga{count meanScore standardDeviation chaptersRead volumesRead genrePreview:genres(limit:10,sort:COUNT_DESC){genre count}}}stats{activityHistory{date amount level}}favourites{anime{edges{favouriteOrder node{id type status(version:2)format isAdult bannerImage title{userPreferred}coverImage{large}startDate{year}}}}manga{edges{favouriteOrder node{id type status(version:2)format isAdult bannerImage title{userPreferred}coverImage{large}startDate{year}}}}characters{edges{favouriteOrder node{id name{userPreferred}image{large}}}}staff{edges{favouriteOrder node{id name{userPreferred}image{large}}}}studios{edges{favouriteOrder node{id name}}}}}}',
        'variables': {'name': this.userName},
      }),
    });
    this.x_user = (await res.json()).data.User;
    console.log(this.user);

    res = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'query': 'query($userId:Int,$userName:String,$type:MediaType){MediaListCollection(userId:$userId,userName:$userName,type:$type){lists{name isCustomList isCompletedList:isSplitCompletedList entries{...mediaListEntry}}user{id name avatar{large}mediaListOptions{scoreFormat rowOrder animeList{sectionOrder customLists splitCompletedSectionByFormat theme}mangaList{sectionOrder customLists splitCompletedSectionByFormat theme}}}}}fragment mediaListEntry on MediaList{id mediaId status score progress progressVolumes repeat priority private hiddenFromStatusLists customLists advancedScores notes updatedAt startedAt{year month day}completedAt{year month day}media{id title{userPreferred romaji english native}coverImage{extraLarge large}type format status(version:2)episodes volumes chapters averageScore popularity isAdult countryOfOrigin genres bannerImage startDate{year month day}}}',
        'variables': {'userId': this.user!.id, 'type': 'MANGA'},
      }),
    });
    this.x_manga = (await res.json()).data.MediaListCollection;
    console.log(this.manga);
  }
}