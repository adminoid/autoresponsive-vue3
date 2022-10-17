'use strict';

const AutoResponsive = require('./autoresponsive.vue');

export default {
  install(app) {
    app.component('AutoResponsive', AutoResponsive);
  }
};
