<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {BModal} from 'bootstrap-vue-next';
import type {ViewEntry} from '@/components/manga/MangaList.vue';
import {Modal} from 'bootstrap';
import {latestChaptersSorted, latestChapterString, newChapterCount} from './util.manga';

@Component({
  name: 'MangaEntryDetailsModal',
  components: {BModal},
})
export default class MangaEntryDetailsModal extends Vue {
  entry: ViewEntry | null = null;

  //functions
  latestChaptersSorted = latestChaptersSorted;
  latestChapterString = latestChapterString;
  newChapterCount = newChapterCount;

  open(entry: ViewEntry): void {
    this.entry = entry;
    new Modal(this.$refs.modal as Element).show();
  }

  dismiss(): void {
    this.entry = null;
    new Modal(this.$refs.modal as Element).hide();
  }
}
</script>

<template>
  <div ref="modal" class="modal manga-details-modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content" v-if="entry">
        <div class="modal-header">
          <div class="modal-title">
            <div class="mb-0">{{ entry.media?.aniList.title?.native }}</div>
            <div style="font-size: 0.5em">{{ entry.media?.aniList.title?.english ?? entry.media?.aniList.title?.romaji }}</div>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-row">
            <img :src="entry.media?.aniList.coverImage.large as string" alt="cover-img" class="modal-cover"/>
            <div class="ms-1">

              <!--          <div>-->
              <!--            {{ $t('manga.title') + ': ' }}-->
              <!--            <span class="mb-0">{{ entry.media?.title?.native }}</span>-->
              <!--            <span style="font-size: 0.5em">{{ entry.media?.title?.english ?? entry.media?.title?.romaji }}</span>-->
              <!--          </div>-->

              <div>
                {{ $t('manga.score') + ':' }}
                <i class="fa fa-star" style="color: var(--bs-orange)"/>
                {{ entry.entry.score }}
              </div>

              <div>
                {{ $t('manga.progress') + ': ' + entry.entry.progress + '/' + latestChapterString(entry) }}
              </div>

              <div>
                {{ $t('manga.chapters.newCount') + ': ' + newChapterCount(entry) }}
              </div>

              <div v-if="entry.media?.mangaUpdatesChapters?.length">
                <div>{{ $t('manga.chapters.latest') + ': ' }}</div>
                <ul class="mb-0 ps-3">
                  <li v-for="c in latestChaptersSorted(entry)">
                    {{ c.chapter + ' (' + c.group + ')' }}
                  </li>
                </ul>
              </div>

              <div v-if="entry.media?.mangaDex">
                <span>
                  MangaDex:
                </span>
                <a :href="'https://mangadex.org/title/' + entry.media!.mangaDex!.id" target="_blank">
                  {{ entry.media!.mangaDex!.attributes.title['en'] }}
                </a>
              </div>
              <div v-if="entry.media?.mangaUpdates">
                <span>
                  MangaUpdates:
                </span>
                <a :href="entry.media.mangaUpdates.url" target="_blank">
                  {{ entry.media.mangaUpdates.title }}
                </a>
                <!--                  <span class="ms-auto">-->
                <!--                    {{ formatDateTimeSeconds(new Date(entry.series!.last_updated.as_rfc3339)) }}-->
                <!--                  </span>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

@include media-breakpoint-down(sm) {
  .modal.manga-details-modal {
    --manga-cover-size: 3rem;
    font-size: 0.8em;
    --bs-modal-header-padding: 0.5rem;
    --bs-modal-padding: 0.5rem;
    --bs-modal-footer-padding: 0.5rem;
  }
}

@include media-breakpoint-up(sm) {
  .manga-details-modal {
    --manga-cover-size: 4rem;
  }
}

.manga-details-modal .modal-cover {
  max-width: var(--manga-cover-size);
  max-height: calc(var(--manga-cover-size) * 2);
  object-fit: cover;
  border-radius: calc(var(--manga-cover-size) / 16);
}
</style>