<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Options({
  name: 'FilterBar',
  components: {},
  emits: {
    'update:modelValue': (modelValue: string) => true,
  },
})
export default class FilterBar extends Vue {
  @Prop({required: true})
  modelValue!: string;
}

</script>

<template>
  <!-- z-index needed, otherwise shadow not showing -->
  <nav class="navbar border-bottom shadow flex-nowrap filter-bar" style="z-index: 1">
    <div class="input-group mx-auto">
      <input class="form-control" :value="modelValue" :placeholder="$t('filter')"
             @input="$emit('update:modelValue', ($event.target! as HTMLInputElement).value)"/>
      <button v-if="modelValue?.trim().length" class="btn btn-secondary" @click="$emit('update:modelValue', '')">
        <i class="fa fa-xmark"/>
      </button>
    </div>
  </nav>
</template>
<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

@include media-breakpoint-up(sm) {
  nav.filter-bar > div {
    width: 33%;
  }
}
</style>


