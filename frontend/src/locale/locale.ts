import type {I18n} from 'vue-i18n';
import {createI18n as vueCreateI18n} from 'vue-i18n';
import {datetimeFormatsEn, messagesEn} from '@/locale/en';
import {datetimeFormatsDe, messagesDe} from '@/locale/de';

const messages = {
  en: messagesEn,
  de: messagesDe,
};

const datetimeFormats = {
  en: datetimeFormatsEn,
  de: datetimeFormatsDe,
};

export function createI18n(): I18n {
  let browserLocale = (navigator.language ?? '').toLowerCase();
  const match = browserLocale.match(/^([a-z][a-z])/);
  if (match) {
    browserLocale = match[1];
  } else {
    browserLocale = 'en';
  }
  return vueCreateI18n({
    locale: browserLocale,
    fallbackLocale: 'en',
    messages: messages,
    datetimeFormats: datetimeFormats,
    legacy: true,
  });
}
