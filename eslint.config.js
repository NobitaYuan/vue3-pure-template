import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueEslintParser from 'vue-eslint-parser'

export default [
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],

    {
        files: ['**/*.{js,mjs,cjs,ts,vue}'],
        languageOptions: {
            globals: globals.browser,
            parser: vueEslintParser,
            parserOptions: {
                parser: '@typescript-eslint/parser',
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
        },
        rules: {
            /* 
            "off"   或者 0  //关闭规则
            "warn"  或者 1  //把规则作为警告（不影响退出代码）
            "error" 或者 2  //把规则作为错误（退出代码触发时为1）
            */
            indent: [1, 4], //缩进风格
            '@typescript-eslint/no-unused-vars': 2, //变量声明了但未使用
            'no-extra-semi': 0, // 不必要的分号
            'vue/multi-word-component-names': 0, // 组件名必须是多个单词
        },
    },
]
