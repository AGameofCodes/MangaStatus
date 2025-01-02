<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-facing-decorator';
import {BTable, type TableItem} from 'bootstrap-vue-next';
//@ts-ignore TS2307
import type {TableFieldObject} from 'bootstrap-vue-next/dist/src/types';
import type {ViewEntry, ViewList} from '@/components/manga/MangaList.vue';
import MangaEntryDetailsModal from '@/components/manga/MangaEntryDetailsModal.vue';
import {latestChaptersSorted, latestChapterString, newChapterCount} from '@/components/manga/util.manga';
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

@Component({
  name: 'MangaListTable',
  components: {BTable, MangaEntryDetailsModal},
})
export default class MangaListTable extends Vue {
  @Prop({required: true})
  readonly viewList!: ViewList;

  bTableRefreshHack = true;

  //methods
  latestChaptersSorted = latestChaptersSorted;
  latestChapterString = latestChapterString;
  newChapterCount = newChapterCount;
  decode = decode;

  get fields(): TableFieldObject<ViewEntry>[] {
    return [{
      key: 'media.aniList.coverImage.large',
      label: '',
      sortable: false,
      tdClass: 'c-pointer',
    }, {
      key: 'media.aniList.title.userPreferred',
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

  cd<V = any>(data: V): CellData<ViewEntry, V> {
    return (data as CellData<ViewEntry, V>);
  }

  hd<V = any>(data: V): HeadData<V> {
    return (data as HeadData<V>);
  }

  onRowClicked(entry: TableItem<ViewEntry>): void {
    (this.$refs.detailsModal as MangaEntryDetailsModal).open(entry);
  }

  // @Watch('viewList', {deep: true})
  // private onViewListChanged(): void {
    // this.bTableRefreshHack = false;
    // this.$nextTick(() => {
    //   this.bTableRefreshHack = true;
    //   // (this.$refs.table as any).refresh();
    //   // (this.$refs.table as any).$forceUpdate();
    // });
  // }
}
</script>

<template>
  <div>
    <BTable ref="table" v-if="bTableRefreshHack" :fields="fields" :items="tableEntries" :primary-key="'id'"
            class="manga-table" hover striped responsive no-sort-reset :sort-by="[{key: 'newChapters', order: 'desc'}]"
            @row-clicked="onRowClicked">
      <template #cell(media.aniList.coverImage.large)="data">
        <img :src="data.value as string" alt="cover-img" class="list-cover"/>
      </template>
      <template #cell(media.aniList.title.userPreferred)="data">
        <div class="flex-grow-1">
          <div>{{ cd(data).item.media?.aniList.title.native }}</div>
          <div>{{ cd(data).item.media?.aniList.title.english ?? cd(data).item.media?.aniList.title.romaji }}</div>
        </div>
        <div v-if="cd(data).item.media?.mangaDex" class="d-flex flex-row" style="font-size: 0.5em">
          <span>
            MangaDex:&nbsp;
          </span>
          <a :href="'https://mangadex.org/title/' + cd(data).item.media!.mangaDex!.id" target="_blank">
            {{ cd(data).item.media!.mangaDex!.attributes.title['en'] }}
          </a>
        </div>
        <div v-if="cd(data).item.media?.mangaUpdates" class="d-flex flex-row" style="font-size: 0.5em">
          <span>
            MangaUpdates:&nbsp;
          </span>
          <a :href="cd(data).item.media!.mangaUpdates!.url" target="_blank">
            {{ decode(cd(data).item.media!.mangaUpdates!.title) }}
          </a>
        </div>
      </template>
      <template #head(entry.score)="data">
        <span class="table-header-mobile"><i class="fa fa-star" style="color: var(--bs-orange)"/></span>
        <span class="table-header-desktop"> {{ hd(data).label }}</span>
      </template>
      <template #cell(entry.score)="data">
        <span class="table-data-mobile">{{ cd(data).value }}</span>
        <span class="table-data-desktop">
          <i class="fa fa-star" style="color: var(--bs-orange)"/> {{ cd(data).value }}
        </span>
      </template>
      <template #head(entry.progress)="data">
        <span class="table-header-mobile"><i class="fa fa-bars-progress"/></span>
        <span class="table-header-desktop"> {{ hd(data).label }}</span>
      </template>
      <template #cell(entry.progress)="data">
        {{ cd(data).value + '/' + latestChapterString(cd(data).item) }}
      </template>
      <template #head(newChapters)="data">
        <span class="table-header-mobile"><i class="fa fa-plus" style="color: var(--bs-success)"/></span>
        <span class="table-header-desktop"> {{ hd(data).label }}</span>
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
