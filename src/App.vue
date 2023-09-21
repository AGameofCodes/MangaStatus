<script lang="ts"  >
import {RouterView} from 'vue-router';
import {Options, Vue} from 'vue-class-component';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';

@Options({
  name: 'App',
  components: {
    DocumentLocaleSetter,
    RouterView,
  },
})
export default class App extends Vue {
}

</script>

<template>
  <DocumentLocaleSetter/>
  <RouterView/>
</template>
