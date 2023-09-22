<script lang="ts">
import {RouterView} from 'vue-router';
import {Options, Vue} from 'vue-class-component';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';
import NavBar from '@/components/NavBar.vue';

@Options({
  name: 'App',
  components: {
    NavBar,
    DocumentLocaleSetter,
    RouterView,
  },
})
export default class App extends Vue {
}

</script>

<template>
  <div class="d-flex flex-column h-100 w-100">
    <DocumentLocaleSetter/>
    <NavBar/>
    <RouterView class="flex-grow-1"/>
  </div>
</template>
