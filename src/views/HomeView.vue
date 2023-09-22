<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import MangaLists from '@/components/MangaLists.vue';

@Options({
  name: 'HomeView',
  components: {MangaLists},
})
export default class HomeView extends Vue {
}
</script>

<template>
  <MangaLists/>
</template>
