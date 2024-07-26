import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

export const useDarkModeStore = defineStore('darkMode', () => {
    const isDark = useDark()

    const toggleDark = (bl?: boolean) => {
        if (bl === undefined) isDark.value = !isDark.value
        else isDark.value = Boolean(bl)
    }

    return { isDark, toggleDark }
})
