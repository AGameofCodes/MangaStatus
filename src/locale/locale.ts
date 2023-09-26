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
  return vueCreateI18n({
    locale: 'de',
    fallbackLocale: 'en',
    messages: messages,
    datetimeFormats: datetimeFormats,
    legacy: true,
  });
}
