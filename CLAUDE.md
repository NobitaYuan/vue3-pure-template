# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 运用第一性原理 思考，拒绝经验主义和路径盲从，不要假设我完全清楚目标，保持审慎，从原始需求和问题出发
> 若目标模糊请停下和我讨论，若目标清晰但路径非最优，请直接建议更短、更低成本的办法。

---

## Quick Reference (AI 必读)

当接手此项目时，**必须遵守以下核心约定**：

| 场景              | 详细说明                                                     |
| ----------------- | ------------------------------------------------------------ |
| 创建新页面        | [查看](#1-创建新页面)                                        |
| 环境判断          | [查看](#2-环境判断)                                          |
| LocalStorage 操作 | [查看](#3-localstorage的操作)                                |
| Token 管理        | [查看](#4-token-管理)                                        |
| HTTP 请求         | [查看](#5-http-请求)                                         |
| UI 组件           | [查看](#6-ui-组件选择)                                       |
| 导入路径          | [查看](#7-导入路径规范)                                      |
| 代码注释          | [查看](#8-代码注释)                                          |
| API 接口编写      | [查看](#9-api-接口编写规范)                                  |
| 组件 API 接入     | [查看](#10-组件-api-接入规范)                                |
| 状态管理          | [查看](#11-状态管理pinia)                                    |
| 自动导入          | [查看](#12-自动导入)                                         |
| Lint & 格式化     | Oxlint + Oxfmt，配置文件 `.oxlintrc.json` / `.oxfmtrc.jsonc` |

当识别到上述场景时，严格执行详细说明中的规范。

**当后续增加新的规范时，也必须记录在 CLAUDE.md 中，如果你不清楚该新增功能是否要成为一个新的规范，请立刻马上询问开发人员**

---

## 项目概述

**Vue3 Pure Template** - 一个通用的 Vue 3 项目模板，集成了常用开发工具和规范，可快速启动新项目开发。

### 技术栈

- **Runtime**: Vue 3.5 + TypeScript（`<script setup lang="ts">`）
- **构建工具**: Vite 8（内置 Rolldown + Oxc）
- **代码规范**: Oxlint（Lint）+ Oxfmt（格式化），基于 Oxc（Rust 实现）
- **UI 框架**: TDesign Vue Next 1.13（主要，组件自动导入）
- **样式**: Tailwind CSS 3.4 + SCSS + CSS Variables
- **路由**: Vue Router 4.5（createWebHistory）
- **状态管理**: Pinia 2.3 + pinia-plugin-persistedstate
- **国际化**: Vue I18n 9.14
- **工具库**: @vueuse/core 10.11
- **包管理**: pnpm（必须使用）

### 快速开始

```bash
pnpm i            # 安装依赖（必须用 pnpm）
pnpm dev          # 启动开发服务器
pnpm generate:api # 从后端 openapi.json 生成 TypeScript 类型（src/api/generated/api.d.ts）
pnpm build-dev    # 构建 development
pnpm build-test   # 构建 test
pnpm build-pro    # 构建 production
pnpm lint         # 代码检查（Oxlint）
pnpm lint:fix     # 代码检查并修复（Oxlint）
pnpm format       # 代码格式化（Oxfmt）
```

**注意**: 不要使用 npm 或 yarn。代码格式化和 lint 通过 husky + lint-staged 在提交时自动执行（Oxfmt + Oxlint）。

---

## 项目结构

```
src/
├── api/
│   ├── generated/              # 自动生成（勿手动编辑）
│   │   ├── api.d.ts            # openapi-typescript 生成的类型
│   │   └── client.ts           # openapi-fetch 客户端（含 auth 中间件）
│   ├── user/                 # 类型安全的 API 函数（openapi-fetch，新模块用这个）
│   │   └── user.ts
│   └── user/                   # 旧 axios API（遗留代码，不新增）
├── assets/
│   ├── images/
│   └── style/                 # main.css, tailwind.css, var.css, reset.css
├── components/                # 共享组件
├── i18n/                      # locales/zh-cn.json, en.json
├── layout/                    # index.vue, header.vue, nav.vue, components/
├── router/                    # index.ts（路由定义）, permission.ts（路由守卫）
├── stores/
│   ├── useUserStore/          # 用户 store（含 persist 持久化）
│   └── useDarkMode/           # 暗黑模式 store
├── types/                     # auto-imports.d.ts, components.d.ts（勿编辑）
├── utils/
│   ├── request/               # Axios 封装（index.ts + type.ts）
│   ├── localStorage/          # LS 工具 + token 管理
│   ├── isDev.ts               # 环境判断
│   ├── transParams.ts         # 参数转换
│   └── autoUpdate.ts          # 自动更新
├── views/                     # 页面（index/, login/, error/）
├── App.vue
└── main.ts
```

---

## 核心约定和规范（重要）

### 1. 创建新页面

**目录结构：**

```
src/views/yourPageName/
├── index.vue              # 必须
├── components/            # 可选
└── types.ts               # 可选
```

**步骤：**

1. 在 `src/views/` 下创建页面文件夹，入口为 `index.vue`
2. 在 `src/router/index.ts` 添加懒加载路由
3. 如需导航，在 `src/layout/nav.vue` 添加导航项
4. 隐藏顶部栏：`meta: { showHeader: false }`

```typescript
// src/router/index.ts
{
  path: '/your-page',
  name: 'yourPage',
  meta: { title: '页面名称' },
  component: () => import('@/views/yourPageName/index.vue'),
}
```

```vue
<script setup lang="ts">
// 组合式 API，无需 return
</script>
<template>
  <div class="your-page"></div>
</template>
<style lang="scss" scoped></style>
```

### 2. 环境判断

**必须从 `@/utils/isDev` 导入：**

```typescript
import { isDev, isProduction } from '@/utils/isDev'

// ✅
if (isDev) {
  console.log('开发环境')
}

// ❌ 不要直接用
if (import.meta.env.MODE === 'development') {
}
```

导出：`isDev`、`isProduction`

### 3. LocalStorage的操作

优先使用 Pinia store 的 `persist` 配置（参考第 11 节）。非响应式场景使用 `@/utils/localStorage`：

```typescript
import { saveToLocal, getFromLocal, removeFromLocal } from '@/utils/localStorage'

// ✅
saveToLocal('key', { name: 'Alice' })

// ❌
localStorage.setItem('key', JSON.stringify(value))
```

方法：`saveToLocal`、`getFromLocal`、`removeFromLocal`、`clearLocal`

### 4. Token 管理

**从 `@/utils/localStorage/token` 导入：**

```typescript
import { getToken, setToken, clearUserToken, clearAllLocalStorage } from '@/utils/localStorage/token'
```

常量：`userTokenKey`、`userInfoKey`。实际登录通过 `useUserStore().login()` 管理，persist 自动同步。

### 5. HTTP 请求

项目有两种 API 客户端，**新模块必须使用 OpenAPI 方案**：

#### 方案 A：OpenAPI 类型安全（推荐，新模块必须用）

```typescript
import { client } from '@/api/generated/client'

// GET 带查询参数
const { data, error } = await client.GET('/api/v1/users', {
  params: { query: { page: 1, size: 20 } },
})

// GET 带路径参数
const { data, error } = await client.GET('/api/v1/users/{id}', {
  params: { path: { id: '123' } },
})

// POST 带 body
const { data, error } = await client.POST('/api/v1/auth/login', {
  body: { username: 'admin', password: '123456' },
})

// PATCH 带路径参数 + body
const { data, error } = await client.PATCH('/api/v1/users/{id}', {
  params: { path: { id: '123' } },
  body: { username: 'newName' },
})

// DELETE 带路径参数
const { data, error } = await client.DELETE('/api/v1/users/{id}', {
  params: { path: { id: '123' } },
})
```

特性：路径和参数完全类型检查、自动 Bearer token、401 自动登出、业务错误自动 MessagePlugin 提示

**响应结构**：`{ data, error }` — 成功时 `data` 为 `{ code, message, data }` ，失败时 `error` 有值

**不要设 baseUrl**：OpenAPI spec 中的路径已包含 `/api/v1` 前缀

```typescript
import request from '@/utils/request'

// 仅用于已存在的 src/api/user/ 等旧代码
const res = await request<UserInfo>({
  url: '/user/getInfo',
  method: 'get',
})
```

**返回类型：** `Result<T> { code, msg, data, rows, total }`。不用于新模块。

### 6. UI 组件选择

**TDesign Vue Next** 为唯一 UI 框架，`t-` 前缀组件自动导入，无需 import。

```vue
<t-button theme="primary">按钮</t-button>
<t-input v-model="value" />
```

```typescript
// 需要类型时手动导入
import { FormProps, MessagePlugin } from 'tdesign-vue-next'
// 图标
import { SunnyIcon } from 'tdesign-icons-vue-next'
```

`src/types/components.d.ts` 和 `auto-imports.d.ts` 为自动生成，禁止手动编辑。

### 7. 导入路径规范

```typescript
// ✅ @ 别名导通用模块
import { useUserStore } from '@/stores/useUserStore'

// ❌ 通用模块避免相对路径
import { useUserStore } from '../../stores/useUserStore'

// ✅ 模块私有组件用相对路径
import headerView from './header.vue'
```

自动导入无需手动 import 的 API 和组件，详见：[12. 自动导入](#12-自动导入)

### 8. 代码注释

- 复杂逻辑增加注释说明功能和实现逻辑
- 函数注释一行即可：`/** 函数功能描述 */`
- 代码较多时用 `/* ===================xxx功能===================== */` 分隔

### 9. API 接口编写规范

**新模块必须在 `src/api/server/` 下创建，使用 openapi-fetch 类型安全方案。**

#### 目录结构

```
src/api/server/<module>.ts      # 一个文件搞定，类型由 OpenAPI spec 自动生成
```

不需要手写 `type.ts` — 类型从后端 `openapi.json` 自动推导。

#### 写法模板

```typescript
// src/api/server/post.ts
import { client } from '../generated/client'

/** 创建帖子 */
export function createPost(data: { title: string; content: string }) {
  return client.POST('/api/v1/posts', { body: data })
}

/** 帖子列表（分页） */
export function getPostList(params?: { page?: number; size?: number }) {
  return client.GET('/api/v1/posts', { params: { query: params } })
}

/** 帖子详情 */
export function getPost(id: string) {
  return client.GET('/api/v1/posts/{id}', { params: { path: { id } } })
}

/** 更新帖子 */
export function updatePost(id: string, data: { title?: string; content?: string }) {
  return client.PATCH('/api/v1/posts/{id}', { params: { path: { id } }, body: data })
}

/** 删除帖子 */
export function deletePost(id: string) {
  return client.DELETE('/api/v1/posts/{id}', { params: { path: { id } } })
}
```

#### 参数写法速查

| 类型 | 写法                                   |
| ---- | -------------------------------------- |
| 查询 | `params: { query: { page: 1 } }`       |
| 路径 | `params: { path: { id: '123' } }`      |
| Body | `body: { title: 'xxx' }`               |
| 混合 | `params: { path: { id } }, body: data` |

**路径必须与 OpenAPI spec 完全一致** — 写错会编译报红。运行 `pnpm generate:api` 更新类型。

#### 前后端协作流程

```
后端修改 API → pnpm export-spec（后端）→ 更新 openapi.json
→ pnpm generate:api（前端）→ 更新 src/api/generated/api.d.ts
```

后端新增模块后，前端需要：1) 拉取最新 openapi.json → 2) `pnpm generate:api` → 3) 在 `src/api/server/` 新建对应文件

参考：`src/api/server/user.ts`

### 10. 组件 API 接入规范

使用 `<script setup lang="ts">`，标准模式：

```typescript
const loading = ref(false)
const data = ref<YourType[]>([])

// 查询
const fetchData = async () => {
  loading.value = true
  try {
    const { data: res, error } = await getList()
    if (error) return // client 中间件已自动弹 MessagePlugin
    data.value = res!.data
  } finally {
    loading.value = false
  }
}
onMounted(() => fetchData())

// 新增/修改/删除（统一模式）
const handleAction = async () => {
  loading.value = true
  try {
    const { error } = await someApiCall(/* 数据 */)
    if (error) return
    MessagePlugin.success('成功')
    await fetchData() // 统一刷新
  } finally {
    loading.value = false
  }
}
```

**核心原则：**

1. `loading.value` 统一管理，try-finally 确保重置
2. 用 `{ data, error }` 解构 — `error` 有值时 return（client 中间件已弹错误提示）
3. 成功时手动 `MessagePlugin.success()`，修改/删除后统一 `fetchData()` 刷新，禁止手动 push/filter
4. 使用 `ref()` 包装状态，`.value` 访问修改

### 11. 状态管理(Pinia)

Store 放在 `src/stores/useXxxStore/index.ts`，支持 Options 和 Setup 两种风格：

```typescript
// Setup 风格
export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = useDark({
    /* ... */
  })
  const toggleDark = (bl?: boolean) => {
    /* ... */
  }
  return { isDark, toggleDark }
})

// Options 风格（参考 useUserStore）
// state → getters → actions → persist
```

```typescript
const userStore = useUserStore()
userStore.token // state
userStore.userName // getter
await userStore.login(params) // action
```

持久化：`pinia-plugin-persistedstate`，在 `persist` 数组中配置 `key`、`pick`、`serializer`

### 12. 自动导入

`unplugin-auto-import` + `unplugin-vue-components`，以下无需手动 import：

- **Vue API**: `ref`, `reactive`, `computed`, `watch`, `onMounted`, `nextTick` 等
- **Vue Router**: `useRouter`, `useRoute`
- **TDesign**: `<t-button>`, `<t-input>` 等 `t-` 前缀组件

需导入**类型**时才手动 import（如 `FormProps`, `MessagePlugin`）

---

## 环境变量

```
VITE_APP_TITLE        # 页面标题
VITE_APP_ENV          # 当前环境（development/test/production）
VITE_APP_BASE_API_URL # 服务端接口地址（同时用作开发代理前缀）
```

定义在 `.env.development`、`.env.test`、`.env.production` 中，类型声明在 `src/types/vite-env.d.ts`。

## 关于计划（Plan）

**与项目相关的计划md文档都要写到plan文件夹中**

## 提交代码

不要在commit信息里写claudeCode水印！！！
不要在commit信息里写claudeCode水印！！！
不要在commit信息里写claudeCode水印！！！

## Code Quality

- **禁止补丁叠补丁式的修改** — 如果发现某处代码已经是 workaround 堆叠的状态，必须先重构到干净的状态再继续开发，不要在烂代码上继续打补丁
- **禁止在生产代码中使用 `any`** — 必须使用具体类型；第三方库类型缺失时可用 type assertion 并加注释说明原因
