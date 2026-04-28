import { client } from '../generated/client'

/** 注册 */
export function register(username: string, password: string, confirmPassword: string) {
  return client.POST('/api/v1/auth/register', {
    body: { username, password, confirmPassword },
  })
}

/** 登录 */
export function login(username: string, password: string) {
  return client.POST('/api/v1/auth/login', {
    body: { username, password },
  })
}

/** 用户列表（分页） */
export function getUserList(params?: { page?: number; size?: number }) {
  return client.GET('/api/v1/users', { params: { query: params } })
}

/** 用户详情 */
export function getUser(id: string) {
  return client.GET('/api/v1/users/{id}', { params: { path: { id } } })
}

/** 更新用户 */
export function updateUser(id: string, body: { username?: string }) {
  return client.PATCH('/api/v1/users/{id}', { params: { path: { id } }, body })
}

/** 删除用户 */
export function deleteUser(id: string) {
  return client.DELETE('/api/v1/users/{id}', { params: { path: { id } } })
}
