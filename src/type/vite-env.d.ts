/// <reference types="vite/client" />
interface ImportMetaEnv {
    //  页面标题
    readonly VITE_APP_TITLE: string
    //  当前环境
    readonly VITE_APP_ENV: string
    //  服务端接口地址
    readonly VITE_APP_BASE_API_URL: string
    // 其他环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
