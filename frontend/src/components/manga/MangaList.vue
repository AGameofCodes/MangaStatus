<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import MangaListTable from '@/components/manga/MangaListTable.vue';
import type {AniListMangaListEntry} from '@/data/models/anilist/AniListMangaListEntry';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';
import type CompoundMedia from '@/data/models/CompoundMedia';

export type ViewList = {
  list: AniListMangaList,
  entries: ViewEntry[],
}
export type ViewEntry = {
  entry: AniListMangaListEntry,
  media: CompoundMedia | null,
  newChapters: number,
};

@Component({
  name: 'MangaList',
  components: {MangaListTable},
})
export default class MangaList extends Vue {
  @Prop({required: true})
  readonly viewList!: ViewList;

  get localeListName(): string {
    const key = 'manga.status.' + this.viewList.list.name.toLocaleLowerCase();
    const res = this.$t(key);
    return res == 'key' ? this.viewList.list.name : res;
  }
}
</script>

<template>
  <div class="card manga-list">
    <h3 class="card-title manga-list-title mb-0">{{ localeListName }}</h3>
    <MangaListTable :viewList="viewList"/>
  </div>
</template>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

@include media-breakpoint-down(sm) {
  .manga-list {
    border: 0 !important;

    .manga-list-title {
      padding: 0.25rem;
    }
  }
}

@include media-breakpoint-up(sm) {
  .manga-list {
    .manga-list-title {
      padding: 1rem;
    }
  }
}
</style>
