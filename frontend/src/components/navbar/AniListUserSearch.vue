<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {MangaStore} from '@/stores/MangaStore';
import {ServiceStore} from '@/stores/ServiceStore';
import {BSpinner} from 'bootstrap-vue-next';

@Options({
  name: 'AniListUserSearch',
  components: {
    BSpinner,
  },
})
export default class AniListUserSearch extends Vue {
  searching = false;

  get mangaStore(): MangaStore {
    return new MangaStore();
  }

  get serviceStore(): ServiceStore {
    return new ServiceStore();
  }

  get userName(): string {
    return this.mangaStore.userName ?? '';
  }

  set userName(val: string) {
    this.mangaStore.updateUserName(val);
  }

  mounted(): void {
    if (this.userName) {
      this.mangaStore.reloadCache();
    }
  }

  onSearch(): void {
    this.searching = true;
    this.serviceStore.aniListDataService.updateDb()
        .finally(() => this.searching = false);
  }
}

</script>

<template>
  <div class="input-group flex-nowrap">
    <input v-model="userName" :disabled="searching" :placeholder="$t('aniList.username')" aria-label="Search" class="form-control"
           type="search" @keydown.enter="onSearch">
    <button :disabled="searching" class="btn btn-primary" @click="onSearch">
      <BSpinner v-if="searching" small/>
      <i v-else class="fa fa-search"></i>
    </button>
  </div>
</template>
