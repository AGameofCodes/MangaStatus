import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {MangaDexMedia} from '@/data/models/mangadex/MangaDexMedia';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';

export default class CompoundMedia {
  aniList!: AniListMedia;
  mangaDex?: MangaDexMedia;
  mangaUpdates?: MangaUpdatesSeries;
  mangaUpdatesChapters?: MangaUpdatesChapter[];
}