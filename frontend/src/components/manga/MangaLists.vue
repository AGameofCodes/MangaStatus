<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {MangaStore} from '@/stores/MangaStore';
import MangaList, {type ViewEntry, type ViewList} from '@/components/manga/MangaList.vue';
import {BTable} from 'bootstrap-vue-next';
import {newChapterCount} from '@/components/manga/util.manga';
import FilterBar from '@/components/manga/FilterBar.vue';
import Loading from '@/components/Loading.vue';

@Component({
  name: 'MangaLists',
  components: {
    BTable,
    FilterBar,
    Loading,
    MangaList,
  },
})
export default class MangaLists extends Vue {
  filter: string | undefined = '';

  get mangaStore(): MangaStore {
    return new MangaStore();
  };

  get viewLists(): ViewList[] {
    const order = ['reading', 'paused', 'planning', 'completed', 'dropped'];
    const lists = this.mangaStore.aniListLists;

    const filterparts = this.filter?.trim().toLowerCase().split(' ') ?? [];
    return lists.map(l => ({
      list: l,
      entries: (l.entries ?? [])
          .filter(e => { // apply filter if set
            const media = this.mangaStore.mediaByAniListId.get(e.mediaId);
            return !filterparts.length
                || filterparts.some(fp => media!.aniList.title.english?.toLowerCase().includes(fp))
                || filterparts.some(fp => media!.aniList.title.native?.toLowerCase().includes(fp))
                || filterparts.some(fp => media!.aniList.title.romaji?.toLowerCase().includes(fp));
          })
          .map(e => {
            const media = this.mangaStore.mediaByAniListId.get(e.mediaId);
            const viewEntry = {
              entry: e,
              media: media,
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
        <Loading v-if="mangaStore.isLoading"/>
        <MangaList v-else v-for="viewList in viewLists" :key="viewList.list.name" :viewList="viewList" class="mb-3"/>
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
