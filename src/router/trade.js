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
    path: '/trade/info',
    name: 'info',
    component: () => import('@/views/trade/info')
  }
]