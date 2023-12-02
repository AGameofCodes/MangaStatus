<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {MangaStore} from '@/stores/MangaStore';
import MangaList, {type ViewEntry, type ViewList} from '@/components/manga/MangaList.vue';
import {BTable} from 'bootstrap-vue-next';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {MangaUpdatesRelation} from '@/data/models/mangaupdates/MangaUpdatesRelation';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';
import {newChapterCount} from '@/components/manga/util.manga';
import FilterBar from '@/components/manga/FilterBar.vue';

@Options({
  name: 'MangaLists',
  components: {FilterBar, MangaList, BTable},
})
export default class MangaLists extends Vue {
  filter: string | undefined = '';

  get mangaStore(): MangaStore {
    return new MangaStore();
  };

  get mediaById(): Map<number, AniListMedia> {
    const media = this.mangaStore.aniListMedia;
    return new Map(media.map(e => [e.id, e]));
  }

  get relationsByAniListMediaId(): Map<number, MangaUpdatesRelation> {
    const relations = this.mangaStore.mangaUpdatesRelations;
    return new Map(relations.map(e => [e.aniListMediaId, e]));
  }

  private get seriesById(): Map<number, MangaUpdatesSeries> {
    const series = this.mangaStore.mangaUpdatesSeries;
    return new Map(series.map(e => [e.series_id, e]));
  }

  get chaptersBySeriesId(): Map<number, MangaUpdatesChapter[]> {
    return this.mangaStore.mangaUpdatesChapters;
  }

  get viewLists(): ViewList[] {
    const order = ['reading', 'paused', 'planning', 'completed', 'dropped'];
    const lists = this.mangaStore.aniListLists;
    const manga = this.mangaStore.aniListManga;

    const filterparts = this.filter?.trim().toLowerCase().split(' ') ?? [];
    return lists.map(l => ({
      list: l,
      entries: (manga.get(l.name) ?? [])
          .filter(e => { // apply filter if set
            const media = this.mediaById.get(e.mediaId) ?? null;
            return !this.filter?.trim().length
                || filterparts.some(fp => media!.title.english?.toLowerCase().includes(fp))
                || filterparts.some(fp => media!.title.native?.toLowerCase().includes(fp))
                || filterparts.some(fp => media!.title.romaji?.toLowerCase().includes(fp));
          })
          .map(e => {
            const media = this.mediaById.get(e.mediaId) ?? null;
            const relation = this.relationsByAniListMediaId.get(e.mediaId) ?? null;
            const series = this.seriesById.get(relation?.mangaUpdatesSeriesId as any) ?? null;
            const chapters = this.chaptersBySeriesId.get(relation?.mangaUpdatesSeriesId as any) ?? [];
            const viewEntry = {
              entry: e,
              media: media,
              relation: relation,
              series: series,
              chapters: chapters,
              newChapters: 0,
            } as ViewEntry;
            viewEntry.newChapters = newChapterCount(viewEntry);
            return viewEntry;
          }),
    }))
        .filter(e => !this.filter?.trim().length || e.entries.length) // hide empty lists when filtering
        .sort((l, r) => order.indexOf(l.list.name.toLowerCase()) - order.indexOf(r.list.name.toLowerCase()));
  }
}
</script>

<template>
  <div class="d-flex flex-column overflow-hidden">
    <div>
      <FilterBar v-model="filter"/>
    </div>
    <div class="flex-grow-1 overflow-y-auto">
      <div class="manga-lists">
        <MangaList v-for="viewList in viewLists" :key="viewList.list.name" :viewList="viewList" class="mb-3"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

@include media-breakpoint-up(sm) {
  .manga-lists {
    padding: 1rem !important;
  }
}
</style>
