<script lang="ts">
import {Vue, Options} from 'vue-class-component';
import {setDocumentLocale} from '@/locale/locale';
import {Watch} from 'vue-property-decorator';

@Options({name: 'DocumentLocaleSetter'})
export default class DocumentLocaleSetter extends Vue {
  mounted(): void {
    this.onLocaleChanged(this.$i18n.locale);
  }

  @Watch('$i18n.locale')
  onLocaleChanged(value: string): void {
    setDocumentLocale(value);
  }
}
</script>

<template>
</template>
