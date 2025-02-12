import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

// 读取eslintrc-auto-import.json的配置，加入global中
const __dirname = dirname(fileURLToPath(import.meta.url))
const autoimportConfig = JSON.parse(readFileSync(resolve(__dirname, './.eslintrc-auto-import.json')))

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,vue}'],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...autoimportConfig.globals,
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        rules: {
            /* 
         "off"   或者 0  //关闭规则
         "warn"  或者 1  //把规则作为警告（不影响退出代码）
         "error" 或者 2  //把规则作为错误（退出代码触发时为1）
         */
            indent: [1, 4], //缩进风格
            '@typescript-eslint/no-unused-vars': 2, //变量声明了但未使用
            'no-extra-semi': 2, // 不必要的分号
            'vue/multi-word-component-names': 0, // 组件名必须是多个单词
        },
    },
]
