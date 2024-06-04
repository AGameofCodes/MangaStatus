<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import MangaLists from '@/components/manga/MangaLists.vue';

@Component({
  name: 'HomeView',
  components: {MangaLists},
})
export default class HomeView extends Vue {
}
</script>

<template>
  <MangaLists/>
</template>
