export interface Result<T = any> {
  code: number
  msg: string
  data: T
  // 下面两个参数是分页时用的的
  rows: T[]
  total: number
}
