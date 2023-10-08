<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'SideBar',
  components: {},
  emits: {
    'close': undefined,
  },
})
export default class SideBar extends Vue {
}
</script>

<template>
  <nav class="navbar border-bottom shadow flex-nowrap">
    <div class="sidebar-closer mx-1 c-pointer">
      <i class="fa fa-arrow-left me-2" @click="$emit('close')"/>

      <!-- 'hack' to ensure this nav is the same height as the navbar -->
      <input class="form-control d-inline mx-0 px-0" style="visibility: hidden; width: 0;"/>
    </div>
  </nav>
</template>
