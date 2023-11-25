<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import BootstrapThemeSwitch from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import AniListUserSearch from '@/components/navbar/AniListUserSearch.vue';
import MangaUpdatesUpdater from '@/components/navbar/MangaUpdatesUpdater.vue';
import LocaleSelector from '@/components/locale/LocaleSelector.vue';

@Options({
  name: 'NavBar',
  components: {
    AniListUserSearch,
    BootstrapThemeSwitch,
    LocaleSelector,
    MangaUpdatesUpdater,
  },
  emits: {
    'toggleSidebar': undefined,
  },
})
export default class NavBar extends Vue {
}

</script>

<template>
  <!-- z-index needed, otherwise shadow not showing -->
  <nav class="navbar border-bottom shadow flex-nowrap" style="z-index: 1">
    <div>
      <div class="navbar-sidebar-toggler mx-1 c-pointer">
        <i class="fa fa-bars me-2" @click="$emit('toggleSidebar')"/>
      </div>
      <div class="navbar-nav flex-row">
        <div class="nav-item">
          <RouterLink class="nav-link active" aria-current="page" to="/">List</RouterLink>
        </div>
        <div class="nav-item">
          <RouterLink class="nav-link active" aria-current="page" to="/about">About</RouterLink>
        </div>
      </div>
    </div>
    <div>
      <div class="d-flex flex-row">
        <AniListUserSearch class="me-2"/>
        <MangaUpdatesUpdater class=""/>
      </div>
    </div>
    <div>
      <div class="d-flex flex-row align-items-center">
        <LocaleSelector class="navbar-locale-select"/>
        <BootstrapThemeSwitch class="navbar-theme-switch ms-2"/>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

nav.navbar .nav-item {
  margin-inline-end: 1rem;
}

@include media-breakpoint-down(sm) {
  nav.navbar {
    --bs-navbar-padding-x: 0.5rem;
  }

  nav.navbar .navbar-nav,
  nav.navbar .navbar-locale-select,
  nav.navbar .navbar-theme-switch {
    display: none;
  }
}

@include media-breakpoint-up(sm) {
  nav.navbar {
    --bs-navbar-padding-x: 1rem;
  }

  nav.navbar .navbar-sidebar-toggler {
    display: none;
  }
}
</style>

