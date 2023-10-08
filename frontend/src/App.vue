<script lang="ts">
import {RouterView} from 'vue-router';
import {Options, Vue} from 'vue-class-component';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';
import NavBar from '@/components/navbar/NavBar.vue';
import LocaleSaver from '@/components/locale/LocaleSaver.vue';
import StoragePersist from '@/components/StoragePersist.vue';
import SideBar from '@/components/sidebar/SideBar.vue';

@Options({
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
  <div class="h-100 w-100">
    <LocaleSaver/>
    <DocumentLocaleSetter/>
    <StoragePersist/>
    <SideBar ref="sidebar" class="h-100 w-100" :toggled="sidebarToggled"
             @close="sidebarToggled=false"/>
    <div class="d-flex flex-column h-100 w-100">
      <NavBar @toggleSidebar="sidebarToggled = !sidebarToggled"/>
      <RouterView class="flex-grow-1"/>
    </div>
  </div>
</template>
