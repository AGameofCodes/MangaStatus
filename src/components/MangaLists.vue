<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import type {MangaListModel} from '@/models/MangaListCollection';
import {AniListStore} from '@/stores/AniListStore';
import MangaList from '@/components/MangaList.vue';

@Options({
  name: 'MangaLists',
  components: {MangaList},
})
export default class MangaLists extends Vue {
  private aniListStore = new AniListStore();

  get lists(): MangaListModel[] {
    return this.aniListStore.manga?.lists ?? [];
  }
}

</script>

<template>
  <div class="overflow-y-auto p-3">
    <MangaList v-for="list in lists" :key="list.name" :list="list"/>
  </div>
</template>
