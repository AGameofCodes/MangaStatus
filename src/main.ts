import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';

import {createI18n} from '@/locale/locale';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createI18n());

app.mount('#app');
