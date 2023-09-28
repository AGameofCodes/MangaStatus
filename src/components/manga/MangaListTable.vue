<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {BTable, type TableItem} from 'bootstrap-vue-next';
import type {TableFieldObject} from 'bootstrap-vue-next/dist/src/types';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';
import type {ViewEntry, ViewList} from '@/components/manga/MangaList.vue';

type HeadData<I> = {
  label: string,
  column: string,
  field: TableFieldObject<I>,
  'is-foot': boolean,
}

type CellData<I, V> = {
  value: V,
  index: number,
  item: TableItem<I>,
  field: TableFieldObject<I>,
  items: TableItem<I>[],
  toggleDetails: () => void,
  detailsShowing: boolean | undefined,
}

@Options({
  name: 'MangaListTable',
  components: {BTable},
})
export default class MangaListTable extends Vue {
  @Prop({required: true})
  readonly viewList!: ViewList;

  bTableRefreshHack = true;

  get fields(): TableFieldObject<ViewEntry>[] {
    return [{
      key: 'media.coverImage.large',
      label: '',
      sortable: true,
    }, {
      key: 'media.title.userPreferred',
      label: this.$t('manga.title'),
      sortable: true,
    }, {
      key: 'entry.score',
      label: this.$t('manga.score'),
      sortable: true,
      tdClass: 'text-center manga-column-score',
      thClass: 'text-center manga-column-score',
    }, {
      key: 'entry.progress',
      label: this.$t('manga.progress'),
      sortable: true,
      tdClass: 'text-end text-nowrap',
      thClass: 'text-end',
    }, {
      key: 'newChapters',
      formatter: (value: never, key: never, item: ViewEntry) => this.newChapterCount(item),
      label: this.$t('manga.chapters.newCount'),
      sortable: true,
      tdClass: 'text-end',
      thClass: 'text-end',
    }, {
      key: 'latestChapters',
      label: this.$t('manga.chapters.latest'),
      sortable: true,
      tdClass: 'manga-column-latest-chapters text-nowrap',
      thClass: 'manga-column-latest-chapters',
    }];
  }

  get tableEntries(): ViewEntry[] {
    return this.viewList.entries;
  }

  newChapterCount(entry: ViewEntry): number {
    const max = entry.media?.chapters || entry.chapters.reduce((l, r) => Math.max(l, r.chapter), 0);
    return Math.max(0, max - entry.entry.progress);
  }

  lastestChapterString(entry: ViewEntry): string {
    if (entry.media?.chapters) {
      return '' + entry.media.chapters;
    } else if (entry.chapters.length) {
      return entry.chapters.reduce((l, r) => Math.max(l, r.chapter), 0) + '+';
    }
    return '?';
  }

  latestChaptersSorted(entry: ViewEntry): MangaUpdatesChapter[] {
    return entry.chapters.sort((l, r) => l.chapter - r.chapter);
  }

  cd<V = any>(data: V): CellData<ViewEntry, V> {
    return (data as CellData<ViewEntry, V>);
  }

  hd<V = any>(data: V): HeadData<V> {
    return (data as HeadData<V>);
  }

  @Watch('viewList', {deep: true})
  private onViewListChanged(): void {
    this.bTableRefreshHack = false;
    this.$nextTick(() => {
      this.bTableRefreshHack = true;
      // (this.$refs.table as any).refresh();
      // (this.$refs.table as any).$forceUpdate();
    });
  }
}
</script>

<template>
  <!--  <div>-->
  <BTable ref="table" v-if="bTableRefreshHack" :fields="fields" :items="tableEntries" :primary-key="'id'"
          class="manga-table" hover striped responsive no-sort-reset sort-by="newChapters" sort-desc>
    <template #cell(media.coverImage.large)="data">
      <img :src="data.value as string" alt="cover-img" class="list-cover"/>
    </template>
    <template #cell(media.title.userPreferred)="data">
      <div class="flex-grow-1">
        <div>{{ cd(data).item.media?.title.native }}</div>
        <div>{{ cd(data).item.media?.title.english }}</div>
      </div>
      <div v-if="cd(data).item.relation" style="font-size: 0.5em">
        MangaUpdates:
        <a v-if="cd(data).item.series" :href="cd(data).item.series!.url" target="_blank">
          {{ cd(data).item.series!.title }}
        </a>
      </div>
    </template>
    <template #head(entry.score)="data">
      <div class="table-header-mobile"><i class="fa fa-star" style="color: var(--bs-orange)"/></div>
      <div class="table-header-desktop"> {{ hd(data).label }}</div>
    </template>
    <template #cell(entry.score)="data">
      <div class="table-data-mobile">{{ cd(data).value }}</div>
      <div class="table-data-desktop"><i class="fa fa-star" style="color: var(--bs-orange)"/> {{ cd(data).value }}</div>
    </template>
    <template #head(entry.progress)="data">
      <div class="table-header-mobile"><i class="fa fa-bars-progress"/></div>
      <div class="table-header-desktop"> {{ hd(data).label }}</div>
    </template>
    <template #cell(entry.progress)="data">
      {{ cd(data).value + '/' + lastestChapterString(cd(data).item) }}
    </template>
    <template #head(newChapters)="data">
      <div class="table-header-mobile"><i class="fa fa-plus" style="color: var(--bs-success)"/></div>
      <div class="table-header-desktop"> {{ hd(data).label }}</div>
    </template>
    <template #cell(latestChapters)="data">
      <div v-for="c in latestChaptersSorted(cd(data).item)">
        {{ c.chapter + ' (' + c.group + ')' }}
      </div>
    </template>
  </BTable>
</template>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

//disable wrapping of table headers
.manga-table th {
  white-space: nowrap;
}

//cover
.manga-table .list-cover {
  max-width: var(--manga-cover-size);
  //height: var(--manga-cover-size);
  object-fit: cover;
  border-radius: calc(var(--manga-cover-size) / 16);
}

//disable bottom board on last row
.manga-table > :not(caption) tr:last-child td {
  border-bottom-width: 0;
}

@include media-breakpoint-down(sm) {
  .manga-table {
    --manga-cover-size: 3rem;
    --manga-cover-corner-radius: 0.25rem;
    font-size: 0.8em;
    max-width: 100vw;
    overflow-x: hidden;
  }

  .manga-table th,
  .manga-table td {
    padding: 0.25rem !important;
  }

  //.manga-table .manga-column-score,
  .manga-table .manga-column-latest-chapters {
    display: none;
  }

  .manga-table .table-header-desktop,
  .manga-table .table-data-desktop {
    display: none;
  }
}

@include media-breakpoint-up(sm) {
  .manga-table {
    --manga-cover-size: 4rem;
    --manga-cover-corner-radius: 0.25rem;
  }

  //more horizontal space usage at the start of the row
  .manga-table tr td:first-child,
  .manga-table tr th:first-child {
    padding-inline-start: 1rem;
  }

  //more horizontal space usage at the end of the row
  .manga-table tr td:last-child,
  .manga-table tr th:last-child {
    padding-inline-end: 1rem;
  }

  .manga-table .table-header-mobile,
  .manga-table .table-data-mobile {
    display: none;
  }
}
</style>
