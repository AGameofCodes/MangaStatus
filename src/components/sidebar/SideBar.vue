<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import SideBarNavItem from '@/components/sidebar/SideBarNavItem.vue';
import {Prop} from 'vue-property-decorator';
import LocaleSelector from '@/components/locale/LocaleSelector.vue';
import BootstrapThemeSwitch from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import SideBarHead from '@/components/sidebar/SideBarHead.vue';

@Options({
  name: 'SideBar',
  components: {
    BootstrapThemeSwitch,
    LocaleSelector,
    SideBarHead,
    SideBarNavItem,
  },
  emits: {
    'close': undefined,
  },
})
export default class SideBar extends Vue {
  @Prop({default: false})
  toggled!: boolean;
}
</script>

<template>
  <div :class="{ toggled: toggled }" class="sidebar border-right shadow bg-body">
    <div class="d-flex flex-column">
      <ul class="nav flex-column mb-auto">
        <li>
          <SideBarHead @close="$emit('close')"/>
        </li>
        <SideBarNavItem :text="$t('locale')" faIcon="fa-language">
          <template #end>
            <LocaleSelector class="navbar-locale-select me-1"/>
          </template>
        </SideBarNavItem>
        <SideBarNavItem :text="$t('design')" faIcon="fa-moon">
          <template #end>
            <BootstrapThemeSwitch class="navbar-theme-switch"/>
          </template>
        </SideBarNavItem>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

$width: 15em;

@include media-breakpoint-down(sm) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: $width;
    max-width: #{'clamp(0em, '}$width#{', 100%)'};
    transition: width ease-in-out 0.25s;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 10000;
    height: 100%;

    &:not(.toggled) {
      width: 0 !important;
    }

    .sidebar-nav-item {
      border-top: 0;
      border-bottom: 0;
    }

  }
}

@include media-breakpoint-up(sm) {
  .sidebar {
    display: none;
  }
}

</style>
