<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {toast} from 'vue3-toastify';

@Options({name: 'StoragePersist'})
export default class StoragePersist extends Vue {
  async mounted(): Promise<void> {
    if (!navigator.storage) {
      toast.error(this.$t('localStorage.notSupported'));
    } else if (!await navigator.storage.persist()) {
      toast.warning(this.$t('localStorage.persistent.notSupported'));
    }
  }
}
</script>

<template>
</template>
