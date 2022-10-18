import AutoResponsive from './autoresponsive.vue';

export default {
  install: app => {
    app.component('auto-responsive', AutoResponsive);
  }
};
