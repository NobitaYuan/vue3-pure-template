import { defineStore } from 'pinia'
import { getToken, setToken, userInfoKey, userTokenKey } from '@/utils/localStorage/token'
import { clearLocal, getFromLocal } from '@/utils'
import * as serverUserApi from '@/api/user/user'

interface UserInfo {
  id: string
  username: string
}

const InitUserInfo: UserInfo = {
  id: '',
  username: '',
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
      return state.info?.username || ''
    },
    userToken(state) {
      return state.token
    },
    userInfo(state) {
      return state.info
    },
  },
  actions: {
    async login(username: string, password: string) {
      const { data, error } = await serverUserApi.login(username, password)
      if (error || !data) throw error
      this.token = data.data.accessToken
      setToken(data.data.accessToken)
      this.info = data.data.user
      this.hasUserInfo = true
    },
    async getUserInfo(userId: string) {
      const { data, error } = await serverUserApi.getUser(userId)
      if (error || !data) throw error
      this.info = data.data
      this.hasUserInfo = true
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
      key: userTokenKey,
      pick: ['token'],
      serializer: {
        serialize: (value) => value.token,
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

const getUserInitInfo = (): UserInfo => {
  return getFromLocal(userInfoKey) || { ...InitUserInfo }
}
