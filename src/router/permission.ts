import 'nprogress/nprogress.css' // progress bar style
import NProgress from 'nprogress' // progress bar

import { useUserStore } from '@/stores/useUserStore/index'
import router from '@/router/index'

NProgress.configure({ showSpinner: false })

// 白名单
const whiteListRouters = ['/login', '/index']

// 路由守卫--前置
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()

  if (userStore.token) {
    if (to.path === '/login') {
      next()
      return
    }
    // const redirect = decodeURIComponent(from.query.redirect as string)
    // console.log('redirect', redirect)
    // if (redirect) {
    //   next(to.path === redirect ? { ...to, replace: true } : { path: redirect, query: to.query })
    //   return
    // }
    if (!userStore.hasUserInfo) {
      userStore.getUserInfo()
    }
    next()
  } else {
    if (whiteListRouters.indexOf(to.path) !== -1) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
    }
  }
})

// 路由守卫--后置
router.afterEach((to) => {
  NProgress.done()
  if (to.path === '/login') {
    const userStore = useUserStore()
    userStore.logout()
  }
})
