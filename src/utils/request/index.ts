import axios from 'axios'
// type
import type { CreateAxiosDefaults, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/useUserStore/index'
import { transParams } from '../transParams'
import { getToken } from '../localStorage/token'
import { Result } from './type'
import { MessagePlugin } from 'tdesign-vue-next'

//设置默认请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  timeout: 20000,
} as CreateAxiosDefaults)

//
const axiosMap = new Map<string, number>()
const gapTime = 0

// 请求拦截
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers || { isToken: undefined }).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || { repeatSubmit: undefined }).repeatSubmit === false
    //
    if (getToken() && !isToken) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    // 设置时间戳
    config.headers['Ts'] = new Date().getTime()
    // get请求映射params参数
    if (['get', 'post'].includes(config.method) && config.params) {
      let url = config.url + '?' + transParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    // 防止数据重复提交
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      }

      const key = JSON.stringify(requestObj)

      if (axiosMap.has(key)) {
        //存在相同的key，判断value的时间差
        const time = axiosMap.get(key)!
        if (new Date().getTime() - time < gapTime) {
          const message = '数据正在处理，请勿重复提交'
          MessagePlugin.warning({
            content: message,
            closeBtn: true,
          })
          console.warn(`[${config.url}]: ` + message)
          axiosMap.set(key, new Date().getTime())
          return Promise.reject(new Error(message))
        } else {
          axiosMap.set(key, new Date().getTime())
        }
      } else {
        axiosMap.set(key, new Date().getTime())
      }
    }

    return config
  },
  (error: any) => {
    console.error('请求拦截报错：', error)
    // 对请求错误做些什么
    return Promise.reject({
      msg: '请求拦截报错!',
      error,
    })
  },
)

// 响应拦截
service.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    if (code === 200) {
      return Promise.resolve(res)
    }
    // 身份验证失败
    if (code === 401) {
      const msg = '身份验证失效，请重新登录~'
      logInDev(res)
      MessagePlugin.warning({
        content: msg,
        closeBtn: true,
      })
      useUserStore().logout(true)
      return Promise.reject(res)
    }
    logInDev(res)
    MessagePlugin.error({ content: res.data.msg, closeBtn: true })
    return Promise.reject(res)
  },
  (err: any) => {
    let { message } = err
    if (message === 'Network Error') {
      message = '后端接口连接异常'
      console.error('响应拦截：后端接口连接异常')
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
      console.error('响应拦截：系统接口请求超时')
    }
    MessagePlugin.error({
      content: message,
      closeBtn: true,
    })
    return Promise.reject({
      msg: '响应拦截出错!' + message,
    })
  },
)

/**
 * @description 封装好的请求方法，有类型提示
 * @param { AxiosRequestConfig } config 配置项
 * @return { Promise<Result<T>> } 返回一个Promise
 */
function request<T = any>(config: AxiosRequestConfig): Promise<Result<T>> {
  return new Promise((resolve, reject) => {
    service(config)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err?.msg)
      })
  })
}

// log一下信息
const logInDev = (res: AxiosResponse<Result<any>, any>) => {
  try {
    console.groupCollapsed(`%c请求响应错误：【${res.config.url}】[${res.config.method}]`, `color:#d54941`)
    const msg = res?.data?.msg || '未知错误'
    console.error(`\n响应信息：${msg}`, '\n请求参数 data：', JSON.parse(res?.config?.data || '-'), '\n响应:', res?.data)
    console.groupEnd()
  } catch (error) {
    console.groupEnd()
    void error
  }
}

export default request
