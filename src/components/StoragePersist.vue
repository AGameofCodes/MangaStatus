<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {toast} from 'vue3-toastify';

@Options({name: 'StoragePersist'})
export default class StoragePersist extends Vue {
  async mounted(): Promise<void> {
    if (!navigator.storage) {
      toast.error(this.$t('localStoragePersistNotSupported'), {autoClose: false, theme: 'colored'});
    } else {
      await navigator.storage.persist();
    }
  }
}
</script>

<template>
</template>
