import { createApp } from 'vue';
import Autoresponsive from '../src/autoresponsive';
import App from './app.vue';

createApp(App).use(Autoresponsive).mount('#app');
