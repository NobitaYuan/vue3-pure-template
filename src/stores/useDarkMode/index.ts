import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = useDark({
    onChanged: (isDark) => {
      document.documentElement.classList.toggle('dark', isDark)
      document.documentElement.setAttribute('theme-mode', isDark ? 'dark' : '')
    },
  })

  const toggleDark = (bl?: boolean) => {
    if (bl === undefined) isDark.value = !isDark.value
    else isDark.value = Boolean(bl)
  }

  return { isDark, toggleDark }
})
