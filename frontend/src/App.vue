<script lang="ts">
import {RouterView} from 'vue-router';
import {Component, Vue} from 'vue-facing-decorator';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';
import NavBar from '@/components/navbar/NavBar.vue';
import LocaleSaver from '@/components/locale/LocaleSaver.vue';
import StoragePersist from '@/components/StoragePersist.vue';
import SideBar from '@/components/sidebar/SideBar.vue';

@Component({
  name: 'App',
  components: {
    DocumentLocaleSetter,
    LocaleSaver,
    NavBar,
    RouterView,
    SideBar,
    StoragePersist,
  },
})
export default class App extends Vue {
  sidebarToggled = false;
}

</script>

<template>
  <div class="h-100 w-100 overflow-hidden">
    <LocaleSaver/>
    <DocumentLocaleSetter/>
    <StoragePersist/>
    <SideBar ref="sidebar" class="h-100 w-100 overflow-hidden" :toggled="sidebarToggled"
             @close="sidebarToggled=false"/>
    <div class="d-flex flex-column h-100 w-100 overflow-hidden">
      <NavBar @toggleSidebar="sidebarToggled = !sidebarToggled"/>
      <RouterView class="flex-grow-1"/>
    </div>
  </div>
</template>
