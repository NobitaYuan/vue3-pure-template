import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'index',
    meta: { title: 'Taco' },
    component: () => import('@/views/index/index.vue'),
  },
  {
    path: '/data',
    name: 'data',
    meta: { title: '数据管理' },
    component: () => import('@/views/data/index.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { title: '系统设置' },
    component: () => import('@/views/settings/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { title: '404' },
    component: () => import('@/views/error/404View.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录', showHeader: false },
    component: () => import('@/views/login/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
