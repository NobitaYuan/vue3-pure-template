import createClient from 'openapi-fetch'
import type { paths } from './api'
import { getToken } from '@/utils/localStorage/token'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/stores/useUserStore'

const client = createClient<paths>()

client.use({
  async onRequest({ request }) {
    const token = getToken()
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },
  async onResponse({ response }) {
    // 只处理 JSON 响应
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) return response

    // 克隆响应以便读取 body（不消耗原始流）
    const cloned = response.clone()
    const body = await cloned.json()

    // 401：身份失效，跳转登录
    if (body.code === 401) {
      MessagePlugin.warning({ content: '身份验证失效，请重新登录', closeBtn: true })
      useUserStore().logout(true)
      return response
    }

    // 其他业务错误：弹出提示
    if (body.code && body.code !== 200) {
      MessagePlugin.error({ content: body.message || '请求失败', closeBtn: true })
    }

    return response
  },
  async onError({ error }) {
    const message = error instanceof TypeError ? '网络连接异常，请检查网络' : '请求出错，请稍后重试'
    MessagePlugin.error({ content: message, closeBtn: true })
    throw error
  },
})

export { client }
