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
  <div>
    <DocumentLocaleSetter/>
    <NavBar/>
    <RouterView/>
  </div>
</template>
