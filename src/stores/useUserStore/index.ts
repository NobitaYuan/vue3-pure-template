import { defineStore } from 'pinia'
import { getToken, userInfoKey, userTokenKey } from '@/utils/localStorage/token'
import { clearLocal, getFromLocal } from '@/utils'
import { getUserInfo, login, loginParams, userInfo } from '@/api/user'

const InitUserInfo: userInfo = {
  isDefaultModifyPwd: false,
  isPasswordExpired: false,
  permissions: [],
  roles: [],
  // @ts-ignore
  user: {},
}

// 用户信息store
export const useUserStore = defineStore('userStore', {
  state: () => ({
    hasUserInfo: false,
    token: getToken() || '',
    info: getUserInitInfo(),
  }),
  getters: {
    userName(state) {
      return state.info?.user?.nickName || ''
    },
    userToken(state) {
      return state.token
    },
    userInfo(state) {
      return state.info
    },
  },
  actions: {
    async login(params: loginParams) {
      const res = await login(params)
      this.token = res.data.token
      return res
    },
    async getUserInfo() {
      const res = await getUserInfo()
      this.info = res.data
      this.hasUserInfo = true
      return res
    },
    logout(reload: boolean = false) {
      this.token = ''
      this.hasUserInfo = false
      this.info = { ...InitUserInfo }
      clearLocal()
      if (reload) {
        window.location.reload()
      }
    },
  },
  // 持久化 token 和 userInfo
  persist: [
    {
      key: userTokenKey, // 存储在localStorage中的key
      pick: ['token'], // 从state中取的属性的key
      serializer: {
        // 存储时的序列化
        serialize: (value) => value.token,
        // 读取时的反序列化
        deserialize: (value) => {
          return JSON.parse(value)
        },
      },
    },
    {
      key: userInfoKey,
      pick: ['info'],
      serializer: {
        serialize: (value) => {
          return JSON.stringify(value.info)
        },
        deserialize: (value) => {
          return JSON.parse(value)
        },
      },
    },
  ],
})

const getUserInitInfo = (): userInfo => {
  return getFromLocal(userInfoKey) || { ...InitUserInfo }
}
