<script lang="ts"  >
import {RouterView} from 'vue-router';
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'App',
  components: {
    RouterView,
  },
})
export default class App extends Vue {
}

</script>

<template>
  <RouterView/>
</template>
