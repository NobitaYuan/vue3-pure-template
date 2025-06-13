import { createApp } from 'vue'
import './assets/style/main.css'
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { i18n } from './i18n'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
