<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Logo from '@/components/Logo.vue';

@Component({
  name: 'SideBar',
  components: {Logo},
  emits: {
    'close': () => true,
  } as any,
})
export default class SideBar extends Vue {
}
</script>

<template>
  <nav class="navbar border-bottom shadow flex-nowrap">
    <div class="sidebar-closer mx-1 c-pointer d-flex flex-row align-items-center">
      <i class="fa fa-arrow-left me-2" @click="$emit('close')"/>

      <!-- 'hack' to ensure this nav is the same height as the navbar -->
      <input class="form-control d-inline mx-0 px-0" style="visibility: hidden; width: 0;"/>
      <Logo/>
    </div>
  </nav>
</template>
