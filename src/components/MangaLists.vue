<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {MangaStore} from '@/stores/MangaStore';
import MangaList, {ViewEntry, ViewList} from '@/components/MangaList.vue';
import {BTable} from 'bootstrap-vue-next';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {MangaUpdatesRelation} from '@/data/models/mangaupdates/MangaUpdatesRelation';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';

@Options({
  name: 'MangaLists',
  components: {MangaList, BTable},
})
export default class MangaLists extends Vue {
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
    const chapters = this.mangaStore.mangaUpdatesChapters;
    return Map.groupBy(chapters, e => e.series_id);
  }

  get viewLists(): ViewList[] {
    const lists = this.mangaStore.aniListLists;
    const manga = this.mangaStore.aniListManga;

    return lists.map(l => ({
      list: l,
      entries: (manga.get(l.name) ?? []).map(e => {
        const media = this.mediaById.get(e.mediaId) ?? null;
        const relation = this.relationsByAniListMediaId.get(e.mediaId) ?? null;
        const series = this.seriesById.get(relation?.mangaUpdatesSeriesId as any) ?? null;
        const chapters = this.chaptersBySeriesId.get(relation?.mangaUpdatesSeriesId as any) ?? [];
        return ({
          entry: e,
          media: media,
          relation: relation,
          series: series,
          chapters: chapters,
        } as ViewEntry);
      }),
    }));
  }
}
</script>

<template>
  <div class="overflow-y-auto manga-lists">
    <MangaList v-for="viewList in viewLists" :key="viewList.list.name" :viewList="viewList" class="mb-3"/>
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
