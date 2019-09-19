export default [
  {
    path: '/withdraw',
    name: 'centerWithdraw',
    component: () => import('@/views/wallet/center/withdraw')
  },
  {
    path: '/recharge',
    name: 'CcenterRecharge',
    component: () => import('@/views/wallet/center/recharge')
  },
]