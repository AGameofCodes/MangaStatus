<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {BTable, type TableItem} from 'bootstrap-vue-next';
import type {TableFieldObject} from 'bootstrap-vue-next/dist/src/types';
import type {AniListMangaListEntry} from '@/data/models/anilist/AniListMangaListEntry';
import type {AniListMedia} from '@/data/models/anilist/AniListMedia';
import type {AniListMangaList} from '@/data/models/anilist/AniListMangaList';
import type {MangaUpdatesRelation} from '@/data/models/mangaupdates/MangaUpdatesRelation';
import type {MangaUpdatesSeries} from '@/data/models/mangaupdates/MangaUpdatesSeries';
import type {MangaUpdatesChapter} from '@/data/models/mangaupdates/MangaUpdatesChapter';

export type ViewList = {
  list: AniListMangaList,
  entries: ViewEntry[]
}

export type ViewEntry = {
  entry: AniListMangaListEntry,
  media: AniListMedia | null,
  relation: MangaUpdatesRelation | null,
  series: MangaUpdatesSeries | null,
  chapters: MangaUpdatesChapter[]
};

type CellData<I, V> = {
  value: V,
  index: number,
  item: TableItem<I>,
  field: TableFieldObject<I>,
  items: TableItem<I>[],
  toggleDetails: () => void,
  detailsShowing: boolean | undefined
}

@Options({
  name: 'MangaList',
  components: {BTable},
})
export default class MangaList extends Vue {
  @Prop({required: true})
  readonly viewList!: ViewList;

  private bTableRefreshHack = true;

  get localeListName(): string {
    const key = 'manga.status.' + this.viewList.list.name.toLocaleLowerCase();
    const res = this.$t(key);
    return res == 'key' ? this.viewList.list.name : res;
  }

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
    }, {
      key: 'entry.progress',
      label: this.$t('manga.progress'),
      sortable: true,
      tdClass: 'text-end',
      thClass: 'text-end',
    }, {
      key: 'newChapters',
      formatter: (value, key, item: TableEntry) => this.newChapterCount(item),
      label: this.$t('manga.chapters.newCount'),
      sortable: true,
      tdClass: 'text-end',
      thClass: 'text-end text-nowrap',
    }, {
      key: 'latestChapters',
      label: this.$t('manga.chapters.latest'),
      sortable: true,
      tdClass: 'text-nowrap',
    }];
  }

  get tableEntries(): ViewEntry[] {
    return this.viewList.entries;
  }

  newChapterCount(entry: ViewEntry): number {
    const max = entry.media?.chapters || entry.chapters.reduce((l, r) => Math.max(l, r.chapter), 0);
    return max === 0 ? 0 : max - entry.entry.progress;
  }

  latestChaptersSorted(entry: ViewEntry): MangaUpdatesChapter[] {
    return entry.chapters.sort((l, r) => l.chapter - r.chapter);
  }

  cd<V = any>(data: V): CellData<ViewEntry, V> {
    return (data as CellData<ViewEntry, V>);
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
  <div class="card">
    <h3 class="card-title p-3">{{ localeListName }}</h3>
    <BTable ref="table" v-if="bTableRefreshHack" :fields="fields" :items="tableEntries" :primary-key="'id'"
            class="manga-table" hover striped>
      <template #cell(media.coverImage.large)="data">
        <img :src="data.value as string" alt="cover-img" class="list-cover"/>
      </template>
      <template #cell(media.title.userPreferred)="data">
        <div class="flex-grow-1">
          <div>{{ cd(data).item.media?.title.userPreferred }}</div>
          <div>{{ cd(data).item.media?.title.english }}</div>
        </div>
        <div v-if="cd(data).item.relation" style="font-size: 0.5em">
          MangaUpdates:
          <a v-if="cd(data).item.series" :href="cd(data).item.series.url" target="_blank">
            {{ cd(data).item.series.title }}
          </a>
        </div>
      </template>
      <template #cell(entry.score)="data">
        <i class="fa fa-star" style="color: #ff9933"/>
        {{ cd(data).value }}
      </template>
      <template #cell(progress)="data">
        {{ cd(data).value + ' / ' + (cd(data).item.media?.chapters ?? '?') }}
      </template>
      <template #cell(latestChapters)="data">
        <div v-for="c in latestChaptersSorted(cd(data).item)">
          {{ c.chapter + ' (' + c.group + ')' }}
        </div>
      </template>
    </BTable>
    <!--    <table class="table table-striped manga-table mb-1">-->
    <!--      <thead>-->
    <!--        <tr>-->
    <!--          <th></th>-->
    <!--          <th>{{ $t('manga.title') }}</th>-->
    <!--          <th class="text-end">{{ $t('manga.score') }}</th>-->
    <!--          <th class="text-end">{{ $t('manga.progress') }}</th>-->
    <!--          <th class="text-end">{{ $t('manga.chapters.newCount') }}</th>-->
    <!--          <th>{{ $t('manga.chapters.latest') }}</th>-->
    <!--        </tr>-->
    <!--      </thead>-->
    <!--      <tbody>-->
    <!--        <tr v-for="entry in tableEntries">-->
    <!--          <td><img :src="entry.media?.coverImage.large" alt="cover-img" class="list-cover"/></td>-->
    <!--          <td>-->
    <!--            &lt;!&ndash;            <div class="d-flex flex-column h-100">&ndash;&gt;-->
    <!--            <div class="flex-grow-1">-->
    <!--              <div>{{ entry.media?.title.userPreferred }}</div>-->
    <!--              <div>{{ entry.media?.title.english }}</div>-->
    <!--            </div>-->
    <!--            <div v-if="entry.relation" style="font-size: 0.5em">-->
    <!--              MangaUpdates:-->
    <!--              <template v-if="entry.series">{{ entry.series.title }}</template>-->
    <!--            </div>-->
    <!--            &lt;!&ndash;            </div>&ndash;&gt;-->
    <!--          </td>-->
    <!--          <td class="text-end">{{ entry.entry.score }}</td>-->
    <!--          <td class="text-end" style="min-width: 5rem">-->
    <!--            {{ entry.entry.progress + ' / ' + (entry.media?.chapters ?? '?') }}-->
    <!--          </td>-->
    <!--          <td class="text-end" style="min-width: 5rem">-->
    <!--            {{ newChapterCount(entry) }}-->
    <!--          </td>-->
    <!--          <td style="min-width: 5rem">-->
    <!--            <div v-for="c in latestChaptersSorted(entry)">-->
    <!--              {{ c.chapter + ' (' + c.group + ')' }}-->
    <!--            </div>-->
    <!--          </td>-->
    <!--        </tr>-->
    <!--      </tbody>-->
    <!--    </table>-->
  </div>
</template>

<style>
.manga-table .list-cover {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 0.25rem;
}

.manga-table tr td:first-child,
.manga-table tr th:first-child {
  padding-inline-start: 1rem;
}

.manga-table tr td:last-child,
.manga-table tr th:last-child {
  padding-inline-end: 1rem;
}

.manga-table > :not(caption) tr:last-child td {
  border-bottom-width: 0;
}
</style>
