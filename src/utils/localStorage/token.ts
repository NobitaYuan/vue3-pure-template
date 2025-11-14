export const userTokenKey = 'userToken'

export const userInfoKey = 'userInfo'

const setToken = (value: string) => {
  localStorage.setItem(userTokenKey, value)
}

const getToken = () => {
  return localStorage.getItem(userTokenKey)
}

const clearUserToken = () => {
  localStorage.removeItem(userTokenKey)
}

const clearAllLocalStorage = () => {
  localStorage.clear()
}

export { setToken, getToken, clearAllLocalStorage, clearUserToken }
