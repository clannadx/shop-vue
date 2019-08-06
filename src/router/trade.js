export default [
  {
    path: '/trade/home',
    name: 'trade',
    component: () => import('@/views/trade/home')
  },
  {
    path: '/trade/fast',
    name: 'fast',
    component: () => import('@/views/trade/fast')
  },
  // {
  //   path: '/trade/withdraw',
  //   name: 'withdraw',
  //   component: () => import('@/views/trade/withdraw')
  // },
  // {
  //   path: '/trade/recording',
  //   name: 'recording',
  //   component: () => import('@/views/trade/recording')
  // }
]