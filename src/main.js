import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/scss/global.scss';
import '@/assets/scss/iconfont/iconfont.css';
import 'vant/lib/icon/local.css';
import filters from '@/filter';
import VueClipboard from 'vue-clipboard2';
import VueSocketIO from 'vue-socket.io';
import { Lazyload, Icon, Cell, CellGroup, loading, Button, Toast,Dialog } from 'vant';
import VueQrcode from '@xkeshi/vue-qrcode';
import 'amfe-flexible/index.js';
import '@/assets/icons/index.js';
Vue.use(filters);
Vue.use(VueClipboard);
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(Icon);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(loading);
Vue.use(Button);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Lazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/goods_default.png'),
  loading: require('@/assets/images/goods_default.png'),
  attempt: 1,
  listenEvents: ['scroll'],
  lazyComponent: true
});
Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://40.114.70.112:2019',

}));
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
