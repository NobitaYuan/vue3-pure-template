import request from '@/utils/request'

// 用户信息
export interface userInfo {
  isDefaultModifyPwd: boolean
  isPasswordExpired: boolean
  permissions: string[]
  roles: string[]
  user: {
    avatar: string
    createBy: string
    createTime: string
    dept: unknown
    roles: unknown
    roleIds: string
    postIds: string
    roleId: string
    admin: boolean
    nickName: string
    sex: string
    userId: string
  }
}

// 登录参数
export interface loginParams {
  username: string
  password: string
}
// 登录方法
export function login(data: loginParams) {
  return request<{ token: string; username: string }>({
    url: '/user/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  })
}

// 获取用户详细信息
export function getUserInfo() {
  return request<userInfo>({
    url: '/user/getInfo',
    method: 'get',
  })
}

// 注册方法
export function register(data: loginParams) {
  return request({
    url: '/register',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  })
}

// 退出方法
export function logout() {
  return request({
    url: 'logout',
    method: 'get',
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false,
    },
    method: 'get',
    timeout: 20000,
  })
}
