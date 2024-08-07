<script lang="ts">
import {Progress} from '@/data/service/Progress';
import {Component, Vue} from 'vue-facing-decorator';
import {ServiceStore} from '@/stores/ServiceStore';
import {BSpinner} from 'bootstrap-vue-next';
import {toast} from 'vue3-toastify';

@Component({
  name: 'MangaUpdatesUpdater',
  components: {
    BSpinner,
  },
})
export default class MangaUpdatesUpdater extends Vue {
  //vars
  progressMangaDex: Progress = new Progress(this.onProgress.bind(this), () => {});
  progressMangaUpdates: Progress = new Progress(this.onProgress.bind(this), this.onFinished.bind(this));
  progressType: string | null = null;
  progressValue: number | null = null;
  progressMax: number | null = null;

  wakeLock: WakeLockSentinel | null = null;

  get serviceStore(): ServiceStore {
    return new ServiceStore();
  }

  get progressStyle(): any {
    if (this.progressValue === null || this.progressMax === null) {
      return {};
    }
    return {
      '--progress-value': this.progressValue / this.progressMax,
    };
  }

  //event handler
  async onUpdateMangaUpdatesDb(): Promise<void> {
    this.progressType = 'general.starting';
    await this.tryAcquireWakeLock();
    await this.serviceStore.mangaDexDataService.updateDb(this.progressMangaDex);
    await this.serviceStore.mangaUpdatesDataService.updateDb(this.progressMangaUpdates);
  };

  onProgress(type: string, progress: number, max: number): void {
    this.progressType = type;
    this.progressValue = progress;
    this.progressMax = max;
  }

  onFinished(): void {
    this.wakeLock?.release();
    this.wakeLock = null;

    this.progressType = 'general.finished';
    this.progressValue = null;
    this.progressMax = null;

    setTimeout(() => this.onReset(), 3000);
  }

  onReset(): void {
    this.wakeLock?.release();
    this.wakeLock = null;

    this.progressType = null;
    this.progressValue = null;
    this.progressMax = null;
  }

  //functions
  private async tryAcquireWakeLock(): Promise<void> {
    try {
      if (navigator.wakeLock) {
        this.wakeLock = await navigator.wakeLock.request('screen');
      } else {
        toast.warning(this.$t('wakeLock.permissionDenied'));
      }
    } catch (err: any) {
      toast.warning(this.$t('wakelock.notSupported'));
    }
  }
}
</script>

<template>
  <button :disabled="!!progressType" class="btn btn-secondary progress-btn" :style="progressStyle"
          @click="onUpdateMangaUpdatesDb">
    <i v-if="!progressType" class="fa fa-refresh"/>
    <template v-else>
      <span class="text-nowrap">
        <BSpinner small class="me-2"/>
        <template v-if="progressValue === null || progressMax === null">
          {{ $t('fetch.' + progressType) }}
        </template>
        <template v-else>
          {{ $t('fetch.' + progressType) + ': ' + (progressValue ?? 0) + '/' + (progressMax ?? 1) }}
        </template>
      </span>
    </template>
  </button>
</template>

<style>
.progress-btn {
  --progress-value: 0;
  background: linear-gradient(to right,
  var(--bs-success),
  var(--bs-success) calc(var(--progress-value) * 100%),
  var(--bs-btn-bg) calc(var(--progress-value) * 100%),
  var(--bs-btn-bg));
}
</style>
