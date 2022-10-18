import { createApp } from 'vue';
import Autoresponsive from '../src/index';
import App from './app.vue';

createApp(App)
  .use(Autoresponsive)
  .mount('#app');
