<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {BTable, type TableItem} from 'bootstrap-vue-next';
//@ts-ignore TS2307
import type {TableField, TableFieldObject} from 'bootstrap-vue-next/dist/src/types';
import type {ViewEntry, ViewList} from '@/components/manga/MangaList.vue';
import MangaEntryDetailsModal from '@/components/manga/MangaEntryDetailsModal.vue';
import {get, latestChaptersSorted, latestChapterString, newChapterCount} from '@/components/manga/util.manga';
import {decode} from 'html-entities';

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
  components: {BTable, MangaEntryDetailsModal},
})
export default class MangaListTable extends Vue {
  @Prop({required: true})
  readonly viewList!: ViewList;

  bTableRefreshHack = true;
  sortKey: string | null = null;
  sortAsc: boolean = false;

  //methods
  latestChaptersSorted = latestChaptersSorted;
  latestChapterString = latestChapterString;
  newChapterCount = newChapterCount;
  decode = decode;

  get fields(): TableFieldObject<ViewEntry>[] {
    return [{
      key: 'media.coverImage.large',
      label: '',
      sortable: false,
      tdClass: 'c-pointer',
    }, {
      key: 'media.title.userPreferred',
      label: this.$t('manga.title'),
      sortable: true,
      tdClass: 'c-pointer',
      thClass: 'c-pointer',
    }, {
      key: 'entry.score',
      label: this.$t('manga.score'),
      sortable: true,
      tdClass: 'text-center manga-column-score c-pointer',
      thClass: 'text-center manga-column-score c-pointer',
    }, {
      key: 'entry.progress',
      label: this.$t('manga.progress'),
      sortable: true,
      tdClass: 'text-end text-nowrap c-pointer',
      thClass: 'text-end c-pointer',
    }, {
      key: 'newChapters',
      label: this.$t('manga.chapters.newCount'),
      sortable: true,
      tdClass: 'text-end c-pointer',
      thClass: 'text-end c-pointer',
    }, {
      key: 'latestChapters',
      label: this.$t('manga.chapters.latest'),
      sortable: false,
      tdClass: 'manga-column-latest-chapters c-pointer',
      thClass: 'manga-column-latest-chapters',
    }];
  }

  get tableEntries(): ViewEntry[] {
    return this.viewList.entries;
  }

  get tableEntriesSorted(): ViewEntry[] {
    if (!this.sortKey) {
      return this.tableEntries;
    }
    const keyExtractor = (e: ViewEntry) => get<any>(e, this.sortKey!);
    const comparer = (l: ViewEntry, r: ViewEntry) => {
      const lkey = keyExtractor(l);
      const rkey = keyExtractor(r);
      if ([null, undefined].includes(lkey) && [null, undefined].includes(lkey)) {
        return 0;
      } else if ([null, undefined].includes(lkey) && ![null, undefined].includes(lkey)) {
        return -1;
      } else if (![null, undefined].includes(lkey) && [null, undefined].includes(lkey)) {
        return 1;
      } else if (typeof lkey === 'number' && typeof rkey === 'number') {
        return lkey - rkey;
      } else if (typeof lkey === 'string' && typeof rkey === 'string') {
        return lkey.localeCompare(rkey);
      } else if (lkey < rkey) {
        return -1;
      } else if (lkey > rkey) {
        return 1;
      }
      return 0;
    };
    return [...this.tableEntries].sort((l, r) => comparer(l, r) * (this.sortAsc ? 1 : -1));
  }

  cd<V = any>(data: V): CellData<ViewEntry, V> {
    return (data as CellData<ViewEntry, V>);
  }

  hd<V = any>(data: V): HeadData<V> {
    return (data as HeadData<V>);
  }

  onHeaderClicked(fieldKey: string, field: TableField<ViewEntry>, event: MouseEvent, isFooter: boolean): void {
    if (!field.sortable) {
      return;
    }

    if (this.sortKey === fieldKey) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortAsc = false;
    }
    this.sortKey = fieldKey;
  }

  onRowClicked(entry: TableItem<ViewEntry>): void {
    (this.$refs.detailsModal as MangaEntryDetailsModal).open(entry);
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
  <div>
    <BTable ref="table" v-if="bTableRefreshHack" :fields="fields" :items="tableEntriesSorted" :primary-key="'id'"
            class="manga-table" hover striped responsive no-sort-reset sort-by="newChapters" sort-desc
            @row-clicked="onRowClicked as any /* TODO dumb typing issue */"
            @head-clicked="onHeaderClicked">
      <template #cell(media.coverImage.large)="data">
        <img :src="data.value as string" alt="cover-img" class="list-cover"/>
      </template>
      <template #cell(media.title.userPreferred)="data">
        <div class="flex-grow-1">
          <div>{{ cd(data).item.media?.title.native }}</div>
          <div>{{ cd(data).item.media?.title.english ?? cd(data).item.media?.title.romaji }}</div>
        </div>
        <div v-if="cd(data).item.relation" class="d-flex flex-row" style="font-size: 0.5em">
          <span>
            MangaUpdates:&nbsp;
          </span>
          <template v-if="cd(data).item.series">
            <a :href="cd(data).item.series!.url" target="_blank">
              {{ decode(cd(data).item.series!.title) }}
            </a>
          </template>
          <span v-else>{{ $t('mangaupdates.relation.found') }}</span>
        </div>
      </template>
      <template #head(entry.score)="data">
        <div class="table-header-mobile"><i class="fa fa-star" style="color: var(--bs-orange)"/></div>
        <div class="table-header-desktop"> {{ hd(data).label }}</div>
      </template>
      <template #cell(entry.score)="data">
        <div class="table-data-mobile">{{ cd(data).value }}</div>
        <div class="table-data-desktop">
          <i class="fa fa-star" style="color: var(--bs-orange)"/> {{ cd(data).value }}
        </div>
      </template>
      <template #head(entry.progress)="data">
        <div class="table-header-mobile"><i class="fa fa-bars-progress"/></div>
        <div class="table-header-desktop"> {{ hd(data).label }}</div>
      </template>
      <template #cell(entry.progress)="data">
        {{ cd(data).value + '/' + latestChapterString(cd(data).item) }}
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
    <MangaEntryDetailsModal ref="detailsModal"/>
  </div>
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
  max-height: calc(var(--manga-cover-size) * 2);
  object-fit: cover;
  border-radius: calc(var(--manga-cover-size) / 16);
}

//disable bottom border on last row
.manga-table > :not(caption) tr:last-child td {
  border-bottom-width: 0;
}

@include media-breakpoint-down(sm) {
  .manga-table {
    --manga-cover-size: 3rem;
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
