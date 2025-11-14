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
