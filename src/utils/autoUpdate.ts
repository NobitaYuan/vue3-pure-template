// 在应用入口文件中使用: 如 main.js, app.jsx
import { DialogPlugin } from 'tdesign-vue-next'
import { createVersionPolling } from 'version-polling'

export function autoUpadte() {
  try {
    createVersionPolling({
      pollingInterval: 60 * 1000, // 单位为毫秒
      silent: import.meta.env.MODE === 'development', // 开发环境下不检测
      onUpdate: (self) => {
        // 当检测到有新版本时，执行的回调函数，可以在这里提示用户刷新页面
        // const result = confirm('页面有更新，点击确定刷新页面！')
        // if (result) {
        //   self.onRefresh()
        // } else {
        //   self.onCancel()
        // }
        // 强制更新可以用alert

        // alert('有新版本，请刷新页面');

        const dialogInstance = DialogPlugin.confirm({
          header: '系统提示！',
          body: `系统有更新，刷新页面以获取最新版本。使用旧版本可能会影响您的使用体验哦~`,
          confirmBtn: '刷新',
          cancelBtn: '稍后我自己刷新',
          onConfirm: () => {
            self.onRefresh()
            dialogInstance.destroy()
          },
          onCancel: () => {
            self.onCancel()
            dialogInstance.destroy()
          },
        })
      },
    })
  } catch (error) {
    console.error('autoUpadte error:', error)
  }
}
