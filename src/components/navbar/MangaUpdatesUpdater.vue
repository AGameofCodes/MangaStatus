<script lang="ts">
import {Progress} from '@/data/service/MangaUpdatesDataService';
import {Options, Vue} from 'vue-class-component';
import {ServiceStore} from '@/stores/ServiceStore';
import {BSpinner} from 'bootstrap-vue-next';

@Options({
  name: 'MangaUpdatesUpdater',
  components: {
    BSpinner,
  },
})
export default class MangaUpdatesUpdater extends Vue {
  //vars
  progress: Progress = new Progress(this.onProgress.bind(this), this.onFinished.bind(this));
  progressType: string | null = null;
  progressValue: number | null = null;
  progressMax: number | null = null;

  wakeLock: WakeLockSentinel | null = null;

  get serviceStore(): ServiceStore {
    return new ServiceStore();
  }

  //event handler
  async onUpdateMangaUpdatesDb(): Promise<void> {
    this.progressType = 'starting';
    try {
      this.wakeLock = await navigator.wakeLock.request();
    } catch (_) {
    }
    this.serviceStore.mangaUpdatesDataService.updateDb(this.progress);
  };

  onProgress(type: string, progress: number, max: number): void {
    this.progressType = type;
    this.progressValue = progress;
    this.progressMax = max;
  }

  onFinished(): void {
    this.wakeLock?.release();
    this.wakeLock = null;

    this.progressType = 'finished';
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

  get progressStyle(): any {
    if (this.progressValue === null || this.progressMax === null) {
      return {};
    }
    return {
      '--progress-value': this.progressValue / this.progressMax,
    };
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
          {{ $t('fetch.mangaUpdates.' + progressType) }}
        </template>
        <template v-else>
          {{ $t('fetch.mangaUpdates.' + progressType) + ': ' + (progressValue ?? 0) + '/' + (progressMax ?? 1) }}
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
