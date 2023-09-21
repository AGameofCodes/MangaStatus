<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import BootstrapThemeSwitch from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';

@Options({
  name: 'UserSearch',
  components: {},
})
export default class UserSearch extends Vue {
}

</script>

<template>
  <div class="input-group">
    <input class="form-control" type="search" placeholder="Search" aria-label="Search">
    <button class="btn btn-primary">
      <i class="fa fa-search"></i>
    </button>
  </div>
</template>
