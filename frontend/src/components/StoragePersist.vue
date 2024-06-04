<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {toast} from 'vue3-toastify';

@Component({name: 'StoragePersist'})
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
