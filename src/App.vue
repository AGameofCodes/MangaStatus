<script lang="ts">
import {RouterView} from 'vue-router';
import {Options, Vue} from 'vue-class-component';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';
import NavBar from '@/components/NavBar.vue';
import LocaleSaver from '@/components/locale/LocaleSaver.vue';
import StoragePersist from '@/components/StoragePersist.vue';

@Options({
  name: 'App',
  components: {
    DocumentLocaleSetter,
    LocaleSaver,
    NavBar,
    RouterView,
    StoragePersist,
  },
})
export default class App extends Vue {
}

</script>

<template>
  <div class="d-flex flex-column h-100 w-100">
    <LocaleSaver/>
    <DocumentLocaleSetter/>
    <StoragePersist/>
    <NavBar/>
    <RouterView class="flex-grow-1"/>
  </div>
</template>
