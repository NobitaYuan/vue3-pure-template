import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig((env: ConfigEnv) => {
    const { mode } = env
    // 环境变量
    const envVar = loadEnv(mode, process.cwd())
    return {
        plugins: [
            vueDevTools(),
            vue(),
            createHtmlPlugin({
                inject: {
                    data: {
                        documentTitle: envVar.VITE_APP_TITLE,
                    },
                },
            }),
            AutoImport({
                imports: ['vue', 'vue-router'],
                resolvers: [ElementPlusResolver()],
                dts: 'src/types/auto-imports.d.ts',
            }),
            Components({
                resolvers: [ElementPlusResolver()],
                dts: 'src/types/components.d.ts',
            }),
            visualizer({
                filename: 'boundleView.html', //分析图生成的文件名
                open: true, //如果存在本地服务端口，将在打包后自动展示
            }),
        ],
        resolve: {
            alias: {
                '@': '/src',
            },
        },
        server: {
            host: true,
        },
    }
})
