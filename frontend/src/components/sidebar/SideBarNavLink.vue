<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import SideBarNavItem from '@/components/sidebar/SideBarNavItem.vue';

@Component({
  name: 'SideBarNavLink',
  components: {SideBarNavItem},
})
export default class SideBarNavLink extends Vue {
  @Prop({required: false})
  faIcon!: string;
  @Prop({required: false})
  text!: string;
  @Prop({required: true})
  to!: string;
}
</script>

<style>
.no-link, .no-link:link, .no-link:hover {
  color: inherit;
  text-decoration: inherit;
}
</style>

<template>
  <SideBarNavItem :fa-icon="faIcon" :text="text">
    <template #text="props">
      <RouterLink :to="to" class="no-link">
        {{ props.text }}
      </RouterLink>
    </template>
  </SideBarNavItem>
</template>
