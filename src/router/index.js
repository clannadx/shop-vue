import Vue from 'vue';
import Router from 'vue-router';
import { getLocalStorage } from '@/utils/local-storage';

import home from './home';
import items from './items';
import user from './user';
import order from './order';
import login from './login';
import wallet from './wallet';
import trade from './trade'
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
    if (to.meta.login) {
      next({ name: 'login', query: { redirect: to.name } });
      return;
    }
  }
  next();
});

export default RouterModel;
