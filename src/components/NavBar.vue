<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import BootstrapThemeSwitch from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import AniListUserSearch from '@/components/AniListUserSearch.vue';
import MangaUpdatesUpdater from '@/components/MangaUpdatesUpdater.vue';
import LocaleSelector from '@/components/locale/LocaleSelector.vue';

@Options({
  name: 'NavBar',
  components: {
    AniListUserSearch,
    BootstrapThemeSwitch,
    LocaleSelector,
    MangaUpdatesUpdater,
  },
})
export default class NavBar extends Vue {
}

</script>

<template>
  <nav class="navbar navbar-expand">
    <div class="container-fluid">
<!--      <a class="navbar-brand" href="#">Navbar</a>-->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
<!--        <ul class="navbar-nav me-auto mb-2 mb-lg-0">-->
<!--          <li class="nav-item">-->
<!--            <a class="nav-link active" aria-current="page" href="#">Home</a>-->
<!--          </li>-->
<!--          <li class="nav-item">-->
<!--            <a class="nav-link" href="#">Link</a>-->
<!--          </li>-->
<!--          <li class="nav-item dropdown">-->
<!--            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">-->
<!--              Dropdown-->
<!--            </a>-->
<!--            <ul class="dropdown-menu">-->
<!--              <li><a class="dropdown-item" href="#">Action</a></li>-->
<!--              <li><a class="dropdown-item" href="#">Another action</a></li>-->
<!--              <li>-->
<!--                <hr class="dropdown-divider">-->
<!--              </li>-->
<!--              <li><a class="dropdown-item" href="#">Something else here</a></li>-->
<!--            </ul>-->
<!--          </li>-->
<!--          <li class="nav-item">-->
<!--            <a class="nav-link disabled">Disabled</a>-->
<!--          </li>-->
<!--        </ul>-->
        <div class="mx-auto">
          <div class="d-flex flex-row">
            <AniListUserSearch class="mx-1"/>
            <MangaUpdatesUpdater class="mx-1"/>
          </div>
        </div>
        <div>
          <div class="d-flex flex-row align-items-center">
            <LocaleSelector class="ms-2"/>
            <BootstrapThemeSwitch class="ms-2"/>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
