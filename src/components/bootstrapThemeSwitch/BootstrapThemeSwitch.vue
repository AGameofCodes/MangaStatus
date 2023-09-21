<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'BootstrapThemeSwitch',
})
export default class BootstrapThemeSwitch extends Vue {
  private darkInternal: boolean = false;

  mounted(): void {
    this.readSetting();
    this.updateTheme();
  }

  private get dark(): boolean {
    return this.darkInternal;
  }

  private set dark(value: boolean) {
    this.darkInternal = value;
    this.updateSetting();
    this.updateTheme();
  }

  private readSetting(): void {
    this.darkInternal = localStorage.getItem('darkmode') === ('' + true)
  }

  private updateSetting(): void {
    localStorage.setItem('darkmode', '' + this.darkInternal);
  }

  private updateTheme(): void {
    if (this.darkInternal) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
    }
  }
}
</script>

<template>
  <div class="form-check form-switch light-dark-switch">
    <input class="form-check-input" type="checkbox" role="switch" v-model="dark">
  </div>
</template>

<style scoped>
.light-dark-switch .form-check-input {
  --bs-form-switch-bg: url(assets/sun.svg) !important;
}

.light-dark-switch .form-check-input:focus {
  --bs-form-switch-bg: url(assets/sun_focus.svg) !important;
}

.light-dark-switch .form-check-input:checked,
.light-dark-switch .form-check-input:checked:focus {
  --bs-form-switch-bg: url(assets/moon.svg) !important;
}
</style>
