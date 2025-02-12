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
                dts: 'src/types/auto-imports.d.ts',
                // 生成声明global的.eslintrc-auto-import.json，随后导入eslint防止报错
                eslintrc: {
                    enabled: true,
                },
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
        build: {
            /* 
            boolean | "hidden" | "inline"
            配置为 hidden 时，依旧会生成sourcemap文件，但是是隐藏的，需要手动指定文件的路径
            在控制台进入该文件后，右键添加sourcemap的路径即可，
            路径就是该文件的请求路径，然后在后缀加上.map即可
            */
            sourcemap: true,
        },
    }
})
