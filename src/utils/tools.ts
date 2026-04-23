/** 可折叠的组合输出 */
export const groupLog = (msg: string, ...args: any[]) => {
  console.groupCollapsed(msg)
  console.log(...args)
  console.groupEnd()
}

// 睡眠
export const sleep = (n: number = 0.5) => {
  return new Promise((resolve) => {
    setTimeout(resolve, n * 1000)
  })
}

/**
 * @description 获取键值映射的值
 * @param 传入key
 * @param 传入reflect
 * @return  返回值
 */
export const getValueInReflect = <T extends object>(key: keyof T, reflect: T) => {
  if (key in reflect) return reflect[key]
  return key || ''
}

/**
 * @description 根据value获取对应的label文本
 * @param val 要匹配的值
 * @param options 选项数组
 * @param keys 可选：自定义label和value的key名
 * @returns 匹配到的label或原始值
 */
export const getOptionsLabel = <T extends Record<string, any>>(val: any, options: T[], keys?: { label?: keyof T; value?: keyof T }) => {
  const { label = 'label', value = 'value' } = keys || {}
  const result = options.find((item) => {
    return item[value] === val
  })
  if (!result) return val
  return result[label]
}

/**
 * 创建事件监听器的控制函数
 * @param type - 要监听的事件类型，必须是 WindowEventMap 中定义的事件
 * @param listener - 事件处理函数
 * @param options - 事件监听器选项 (可选)
 *                - 当为布尔值时，表示是否在捕获阶段处理
 *                - 当为对象时，可包含 capture、once、passive 等选项
 * @returns [添加事件监听器的函数, 移除事件监听器的函数]
 *
 * @example
 * // 使用示例
 * const [addClick, removeClick] = getEventControl('click', () => console.log('clicked'));
 * addClick();    // 添加点击监听
 * removeClick(); // 移除点击监听
 */
export const getDocumentEventControl = <K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
): [() => void, () => void] => {
  // 添加事件监听器的函数
  const addEvent = () => {
    document.addEventListener(type, listener, options)
  }
  // 移除事件监听器的函数
  const removeEvent = () => {
    document.removeEventListener(type, listener, options)
  }
  // 返回添加和移除事件的函数对
  return [addEvent, removeEvent]
}

/**
 * 创建window的事件监听器的控制函数
 */
export const getWindowEventControl = <K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
): [() => void, () => void] => {
  // 添加事件监听器的函数
  const addEvent = () => {
    window.addEventListener(type, listener, options)
  }
  // 移除事件监听器的函数
  const removeEvent = () => {
    window.removeEventListener(type, listener, options)
  }
  // 返回添加和移除事件的函数对
  return [addEvent, removeEvent]
}

/**
 * 测试 WebSocket 连接是否可用
 * @param {string} url - WebSocket 连接的 URL
 * @param {number} [timeout=10000] - 连接超时时间，单位为毫秒，默认为 10000 毫秒
 * @returns {Promise<boolean>} - 一个 Promise，连接成功时解析为 true，连接失败或超时则拒绝
 */
export function testWebSocketConnection(url: string, timeout: number = 10000): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    const timer = setTimeout(() => {
      ws.close()
      reject(new Error(`WS连接超时: ${timeout}ms`))
    }, timeout)

    ws.onopen = () => {
      clearTimeout(timer)
      console.log('✅ WebSocket 可连接')
      ws.close()
      resolve(true)
    }
    ws.onerror = (e) => {
      clearTimeout(timer)
      console.error('❌ WebSocket 连接失败:', e)
      reject(e)
    }
  })
}

/**
 * 保留n位小数
 * @param num 要处理的数字
 * @param fixedNum 保留的小数位数
 * @returns 处理后的数字
 */
export const numToFixed = (num: number, fixedNum: number = 2) => {
  if (typeof num !== 'number') return num
  return Number(num.toFixed(fixedNum))
}
