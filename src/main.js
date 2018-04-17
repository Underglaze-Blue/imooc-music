import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import fastClick from 'fastclick';
import axios from 'axios';
import VueLazyLoad from 'vue-lazyload';

import 'common/stylus/index.styl';

fastClick.attach(document.body);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
});
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
