import { createApp } from 'vue'
import './assets/style/main.css'
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'
// pinia持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 权限控制
import '@/router/permission'

// 线上环境自动更新
import { autoUpadte } from '@/utils/autoUpdate'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { i18n } from './i18n'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')

autoUpadte()
