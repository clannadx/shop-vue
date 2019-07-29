import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'vant/lib/icon/local.css';
import '@/assets/scss/global.scss';
import '@/assets/scss/iconfont/iconfont.css';
import filters from '@/filter';
import 'amfe-flexible/index.js'
import '@/assets/icons/index.js';
Vue.use(filters);

import { Lazyload, Icon, Cell, CellGroup, loading, Button, Toast } from 'vant';
import VueQrcode from '@xkeshi/vue-qrcode';


Vue.component(VueQrcode.name, VueQrcode);
Vue.use(Icon);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(loading);
Vue.use(Button);
Vue.use(Toast);
Vue.use(Lazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/goods_default.png'),
  loading: require('@/assets/images/goods_default.png'),
  attempt: 1,
  listenEvents: ['scroll'],
  lazyComponent: true
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
