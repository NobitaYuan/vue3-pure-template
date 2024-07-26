import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,vue}'],
    },
    {
        languageOptions: {
            globals: globals.browser,
        },
    },
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        /* 自定义规则
        "off"   或者 0  //关闭规则
        "warn"  或者 1  //把规则作为警告（不影响退出代码）
        "error" 或者 2  //把规则作为错误（退出代码触发时为1）
        */
        rules: {
            indent: [1, 4], //缩进风格
            '@typescript-eslint/no-unused-vars': 2, //变量声明了但未使用
            'no-extra-semi': 0, // 不必要的分号
            'vue/multi-word-component-names': 0, // 组件名必须是多个单词
        },
    },
]
