import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import './assets/bootstrap.extensions.scss';
import 'bootstrap/dist/css/bootstrap.css';
// noinspection ES6UnusedImports
import * as bootstrap from 'bootstrap';
// noinspection ES6UnusedImports
import * as popper from '@popperjs/core';
import '@fortawesome/fontawesome-free/css/all.css';
import {createI18n} from '@/locale/locale';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createI18n());

app.mount('#app');
