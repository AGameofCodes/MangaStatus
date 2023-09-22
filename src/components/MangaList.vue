<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import type {MangaListModel} from '@/models/MangaListCollection';
import {Prop} from 'vue-property-decorator';
import {BTable, type TableField} from 'bootstrap-vue-next';

@Options({
  name: 'MangaList',
  components: {BTable},
})
export default class MangaList extends Vue {
  @Prop({required: true})
  readonly list!: MangaListModel;

  private get listName(): string {
    const key = 'manga.status.' + this.list.name.toLocaleLowerCase();
    const res = this.$t(key);
    return res == 'key' ? this.list.name : res;
  }

  private get fields(): TableField[] {
    return [{
      key: 'media.coverImage.large',
      label: '',
      sortable: true,
    }, {
      key: 'media.title.userPreferred',
      label: this.$t('manga.title'),
      sortable: true,
    }, {
      key: 'score',
      label: this.$t('manga.score'),
      sortable: true,
      tdClass: 'text-end',
      thClass: 'text-end',
    }, {
      key: 'progress',
      label: this.$t('manga.progress'),
      sortable: true,
      tdClass: 'text-end',
      thClass: 'text-end',
    }];
  }
}

</script>

<template>
  <div class="card">
    <h3 class="card-title p-3">{{ listName }}</h3>
    <BTable :fields="fields" :items="list.entries" :primary-key="'id'" class="manga-table" hover striped>
      <template #cell(media.coverImage.large)="data">
        <img :src="data.value as string" alt="cover-img" class="list-cover"/>
      </template>
      <template #cell(progress)="data">
        {{ data.value + ' / ' + (data.item.media.chapters ?? '?') }}
      </template>
    </BTable>
    <!--      <table class="table table-striped">-->
    <!--        <thead>-->
    <!--          <tr>-->
    <!--            <th></th>-->
    <!--            <th>title</th>-->
    <!--            <th>score</th>-->
    <!--            <th>chapter</th>-->
    <!--          </tr>-->
    <!--        </thead>-->
    <!--        <tbody>-->
    <!--          <tr v-for="manga in list.entries">-->
    <!--            <td><img :src="manga.media.coverImage.large" class="list-cover" alt="cover-img"/></td>-->
    <!--            <td>{{ manga.media.title.userPreferred }}</td>-->
    <!--            <td>{{ manga.score }}</td>-->
    <!--            <td class="text-end" style="min-width: 5rem">-->
    <!--              {{ manga.progress + ' / ' + (manga.media.chapters ?? '?') }}-->
    <!--            </td>-->
    <!--          </tr>-->
    <!--        </tbody>-->
    <!--      </table>-->
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
</style>
