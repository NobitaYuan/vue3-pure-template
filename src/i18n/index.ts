import { getFromLocal, saveToLocal } from '@/utils'
import { createI18n } from 'vue-i18n'
import zhCn from './locales/zh-cn.json'
import en from './locales/en.json'

const localLangKey = 'lang'

const i18n = createI18n({
    locale: getFromLocal(localLangKey) || 'zh-cn',
    fallbackLocale: 'zh-cn',
    messages: {
        'zh-cn': zhCn,
        en,
    },
})

type LangType = 'zh-cn' | 'en'
const setLang = (lang: LangType = 'zh-cn') => {
    i18n.global.locale = lang
    saveToLocal(localLangKey, lang)
    document.querySelector('html')?.setAttribute('lang', lang)
}

// 当前语言
const curLang = toRef(i18n.global, 'locale')

// 监听curLang变化,
const stopLangWatch = watch(curLang, (lang) => {
    setLang(lang)
})

// init
setLang(getFromLocal(localLangKey))

export { i18n, setLang, curLang, stopLangWatch }
export type { LangType }
