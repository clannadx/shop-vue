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
  {
    path: '/trade/record',
    name: 'trade-record',
    component: () => import('@/views/trade/trade-record')
  },
  {
    path: '/trade/info/:payWay/:orderId',
    name: 'info',
    component: () => import('@/views/trade/info')
  }
]