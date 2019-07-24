export default [
  {
    path: '/wallet/home',
    name: 'wallet',
    component: () => import('@/views/wallet/home')
  },
  {
    path: '/wallet/recharge',
    name: 'recharge',
    component: () => import('@/views/wallet/recharge')
  },
  {
    path: '/wallet/withdraw',
    name: 'withdraw',
    component: () => import('@/views/wallet/withdraw')
  },
  {
    path: '/wallet/recording',
    name: 'recording',
    component: () => import('@/views/wallet/recording')
  }
]