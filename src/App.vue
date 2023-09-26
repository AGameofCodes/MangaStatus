<script lang="ts">
import {RouterView} from 'vue-router';
import {Options, Vue} from 'vue-class-component';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';
import NavBar from '@/components/NavBar.vue';
import LocaleSaver from '@/components/locale/LocaleSaver.vue';

@Options({
  name: 'App',
  components: {
    DocumentLocaleSetter,
    LocaleSaver,
    NavBar,
    RouterView,
  },
})
export default class App extends Vue {
}

</script>

<template>
  <div class="d-flex flex-column h-100 w-100">
    <LocaleSaver/>
    <DocumentLocaleSetter/>
    <NavBar/>
    <RouterView class="flex-grow-1"/>
  </div>
</template>
