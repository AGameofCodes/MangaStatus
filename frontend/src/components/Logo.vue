<template>
  <div class="logo">
    <img src="/favicon.ico" alt="logo" height="24" width="24" class="me-1">
    <b>MangaStatus</b>
  </div>
</template>

<style>
.logo {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>

<script lang="ts">
import {Options, Vue} from 'vue-property-decorator';

@Options({name: 'Logo'})
export default class Logo extends Vue {
}
</script>