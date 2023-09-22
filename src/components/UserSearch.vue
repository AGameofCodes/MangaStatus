<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {AniListStore} from '@/stores/AniListStore';

@Options({
  name: 'UserSearch',
  components: {},
})
export default class UserSearch extends Vue {
  private aniListStore = new AniListStore();

  private get userName(): string {
    return this.aniListStore.userName ?? '';
  }

  private set userName(val: string) {
    this.aniListStore.setUserName(val);
  }

  mounted(): void {
    if (this.userName) {
      this.onSearch();
    }
  }

  private onSearch(): void {
    this.aniListStore.reload();
  }
}

</script>

<template>
  <div class="input-group">
    <input class="form-control" type="search" :placeholder="$t('search')" aria-label="Search" v-model="userName"
           @keydown.enter="onSearch">
    <button class="btn btn-primary" @click="onSearch">
      <i class="fa fa-search"></i>
    </button>
  </div>
</template>
