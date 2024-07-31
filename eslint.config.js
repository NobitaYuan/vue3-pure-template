import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,vue}'],
        languageOptions: {
            parser: 'vue-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                sourceType: 'module',
                ecmaVersion: 2020,
                project: './tsconfig.json', // 确保指向你的 tsconfig.json 文件
            },
            globals: globals.browser,
        },
        rules: {
            indent: [1, 4], //缩进风格
            '@typescript-eslint/no-unused-vars': 2, //变量声明了但未使用
            'no-extra-semi': 0, // 不必要的分号
            'vue/multi-word-component-names': 0, // 组件名必须是多个单词
        },
    },
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
]
