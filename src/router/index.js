import Vue from 'vue';
import Router from 'vue-router';
import { setLocalStorage, getLocalStorage } from '@/utils/local-storage';

import home from './home';
import items from './items';
import user from './user';
import order from './order';
import login from './login';
import wallet from './wallet';
import trade from './trade';
Vue.use(Router);

const RouterModel = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [...home, ...items, ...user, ...order, ...login, ...wallet, ...trade]
});

RouterModel.beforeEach((to, from, next) => {
  const { Authorization } = getLocalStorage(
    'Authorization'
  );
  if (!Authorization) {
    if (to.path === '/login/auth') {
      next();
    } else {
      next()
      // window.location.href = 'https://open.xianliao.updrips.com/connect/oauth2/authorize?appid=qBSdYLZEuaTMssbI&redirect_uri=http://47.111.165.42:8080/wx/auth/auth_by_xianliao&response_type=code';
      return false;
    }
  } else {
    next();
  }
});

export default RouterModel;
