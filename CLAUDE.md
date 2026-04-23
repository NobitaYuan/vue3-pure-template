# CLAUDE.md

Use 'bd' for task tracking

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 运用第一性原理 思考，拒绝经验主义和路径盲从，不要假设我完全清楚目标，保持审慎，从原始需求和问题出发
> 若目标模糊请停下和我讨论，若目标清晰但路径非最优，请直接建议更短、更低成本的办法。

---

## Quick Reference (AI 必读)

当接手此项目时，**必须遵守以下核心约定**：

| 场景              | 详细说明                      |
| ----------------- | ----------------------------- |
| 创建新页面        | [查看](#1-创建新页面)         |
| 环境判断          | [查看](#2-环境判断)           |
| LocalStorage 操作 | [查看](#3-localstorage的操作) |
| Token 管理        | [查看](#4-token-管理)         |
| HTTP 请求         | [查看](#5-http-请求)          |
| UI 组件           | [查看](#6-ui-组件选择)        |
| 导入路径          | [查看](#7-导入路径规范)       |
| 代码注释          | [查看](#8-代码注释)           |
| API 接口编写      | [查看](#9-api-接口编写规范)   |
| 组件 API 接入     | [查看](#10-组件-api-接入规范) |
| 状态管理          | [查看](#11-状态管理pinia)     |
| 自动导入          | [查看](#12-自动导入)          |

当识别到上述场景时，严格执行详细说明中的规范。

**当后续增加新的规范时，也必须记录在 CLAUDE.md 中，如果你不清楚该新增功能是否要成为一个新的规范，请立刻马上询问开发人员**

---

## 项目概述

**Vue3 Pure Template** - 一个通用的 Vue 3 项目模板，集成了常用开发工具和规范，可快速启动新项目开发。

### 技术栈

- **Runtime**: Vue 3.5 + TypeScript（`<script setup lang="ts">`）
- **构建工具**: rolldown-vite（Vite 兼容）
- **UI 框架**: TDesign Vue Next 1.13（主要，组件自动导入）
- **样式**: Tailwind CSS 3.4 + SCSS + CSS Variables
- **路由**: Vue Router 4.5（createWebHistory）
- **状态管理**: Pinia 2.3 + pinia-plugin-persistedstate
- **国际化**: Vue I18n 9.14
- **工具库**: @vueuse/core 10.11
- **包管理**: pnpm（必须使用）

### 快速开始

```bash
# 安装依赖（必须用 pnpm）
pnpm i

# 启动开发服务器
pnpm dev

# 构建不同环境版本
pnpm build-dev     # development
pnpm build-test    # test
pnpm build-pro     # production

# 代码检查
pnpm lint
pnpm lint:fix
```

**注意**: 项目使用 pnpm。不要使用 npm 或 yarn。代码格式化通过 husky + lint-staged 在提交时自动执行。

---

## 项目结构

```
src/
├── api/                      # API 接口模块
│   └── user/
│       ├── type.ts           # 类型定义（请求参数 + 响应）
│       └── index.ts          # API 函数
├── assets/                   # 静态资源
│   ├── images/
│   └── style/                # 全局样式
│       ├── main.css          # 样式入口
│       ├── tailwind.css      # Tailwind 入口
│       ├── var.css           # CSS 变量
│       └── reset.css         # 样式重置
├── components/               # 共享组件
├── i18n/                     # 国际化
│   ├── index.ts              # i18n 实例 + 工具函数
│   └── locales/
│       ├── zh-cn.json
│       └── en.json
├── layout/                   # 布局组件
│   ├── index.vue             # 主布局
│   ├── header.vue            # 顶部栏
│   ├── nav.vue               # 导航
│   └── components/
│       └── userInfo.vue      # 用户信息
├── router/                   # 路由
│   ├── index.ts              # 路由定义
│   └── permission.ts         # 路由守卫
├── stores/                   # Pinia 状态管理
│   ├── index.ts              # 统一导出
│   ├── useUserStore/         # 用户 store
│   │   ├── index.ts
│   │   └── type.ts
│   └── useDarkMode/          # 暗黑模式 store
│       └── index.ts
├── types/                    # 类型声明
│   ├── vite-env.d.ts         # 环境变量类型
│   ├── auto-imports.d.ts     # 自动生成（勿编辑）
│   └── components.d.ts       # 自动生成（勿编辑）
├── utils/                    # 工具函数
│   ├── index.ts              # 统一导出
│   ├── request/
│   │   ├── index.ts          # Axios 封装
│   │   └── type.ts           # Result 类型
│   ├── localStorage/
│   │   ├── index.ts          # 通用 LS 操作
│   │   └── token.ts          # Token 管理
│   ├── isDev.ts              # 环境判断
│   ├── transParams.ts        # 参数转换
│   └── autoUpdate.ts         # 自动更新检测
├── views/                    # 页面视图
│   ├── index/                # 首页
│   ├── login/                # 登录页
│   └── error/                # 错误页
├── App.vue                   # 根组件
└── main.ts                   # 应用入口
```

---

## 核心约定和规范（重要）

### 1. 创建新页面

**目录结构规范：**

```
src/views/yourPageName/
├── index.vue              # 页面入口（必须）
├── components/            # 页面私有组件（可选）
│   └── SubComponent.vue
└── types.ts               # 类型定义（可选）
```

**步骤：**

1. 在 `src/views/` 下创建页面文件夹，入口文件为 `index.vue`
2. 在 `src/router/index.ts` 添加懒加载路由
3. 如需导航，在 `src/layout/nav.vue` 添加导航项
4. 如需隐藏顶部栏，设置 `meta: { showHeader: false }`

**路由配置示例：**

```typescript
// src/router/index.ts
{
  path: '/your-page',
  name: 'yourPage',
  meta: { title: '页面名称' },
  component: () => import('@/views/yourPageName/index.vue'),
}
```

**页面组件模板：**

```vue
<script setup lang="ts">
// 组合式 API，无需 return
</script>

<template>
  <div class="your-page"></div>
</template>

<style lang="scss" scoped>
.your-page {
}
</style>
```

### 2. 环境判断

**必须从 `@/utils/isDev` 导入：**

```typescript
import { isDev, isProduction } from '@/utils/isDev'

// ✅ 正确
if (isDev) {
  console.log('开发环境')
}

// ❌ 错误 - 不要直接用
if (import.meta.env.MODE === 'development') {
}
```

**可用的导出：**

- `isDev` - 是否开发环境
- `isProduction` - 是否生产环境

### 3. LocalStorage的操作

**优先使用 Pinia 持久化：**

对于需要持久化的状态，优先使用 Pinia store 的 `persist` 配置（参考第 11 节）。

**或使用 `@/utils/localStorage` 工具（非响应式场景）：**

```typescript
import { saveToLocal, getFromLocal, removeFromLocal } from '@/utils/localStorage'

// ✅ 正确 - 非 Vue 场景 / 工具函数中
saveToLocal('user-data', { name: 'Alice', age: 25 })
const data = getFromLocal('user-data')

// ❌ 错误 - 不要直接用
localStorage.setItem('key', JSON.stringify(value))
```

**可用方法：**

- `saveToLocal(key, value)` - 保存（自动 JSON 序列化）
- `getFromLocal(key)` - 获取（自动 JSON 反序列化）
- `removeFromLocal(key)` - 删除
- `clearLocal()` - 清空

### 4. Token 管理

**必须从 `@/utils/localStorage/token` 导入：**

```typescript
import { getToken, setToken, clearUserToken, clearAllLocalStorage } from '@/utils/localStorage/token'

// ✅ 正确
const token = getToken()
setToken('your-token-here')
clearUserToken() // 清除 token
clearAllLocalStorage() // 清空所有 localStorage

// ❌ 错误 - 不要直接用
localStorage.setItem('userToken', token)
```

**常量：**

- `userTokenKey` - token 存储的键名
- `userInfoKey` - 用户信息存储的键名

**注意：** 实际登录场景中，token 通过 Pinia store 的 `useUserStore().login()` 管理，store 的 persist 配置会自动同步 token 到 localStorage，一般不需要手动调用 setToken。

### 5. HTTP 请求

**必须从 `@/utils/request` 导入：**

```typescript
import request from '@/utils/request'

// ✅ 正确
const response = await request<UserInfo>({
  url: '/user/getInfo',
  method: 'get',
})

// 带参数的请求
const result = await request<{ token: string }>({
  url: '/user/login',
  method: 'post',
  data: { username: 'admin', password: '123' },
})

// 不需要 token 的请求
const result = await request({
  url: '/public/data',
  headers: { isToken: false },
  method: 'get',
})

// ❌ 错误 - 不要直接用 axios 或 fetch
import axios from 'axios'
axios.get('/api/user/info')
```

**特性：**

- 基于 axios 封装
- 自动添加 `Bearer` token 到请求头（可通过 `headers: { isToken: false }` 禁用）
- 统一的错误处理（自动显示 MessagePlugin）
- 防重复提交（可通过 `headers: { repeatSubmit: false }` 禁用）
- 类型安全的返回值（泛型支持）
- 401 自动登出
- `baseURL` 使用环境变量 `VITE_APP_BASE_API_URL`

**返回类型定义：**

见: `src/utils/request/type.ts`

```typescript
interface Result<T = any> {
  code: number
  msg: string
  data: T
  rows: T[] // 分页时使用
  total: number // 分页时使用
}
```

### 6. UI 组件选择

**TDesign Vue Next** 为唯一 UI 框架，组件已通过 `unplugin-vue-components` + `TDesignResolver` 实现自动导入。

**使用方式：**

```vue
<template>
  <!-- ✅ 直接使用 t- 前缀组件，无需 import -->
  <t-button theme="primary" @click="handleClick">按钮</t-button>
  <t-input v-model="value" />
  <t-form :data="formData" :rules="rules">
    <t-form-item label="名称" name="name">
      <t-input v-model="formData.name" />
    </t-form-item>
  </t-form>
</template>
```

```typescript
// ✅ 需要类型时从 tdesign-vue-next 导入
import { FormInstanceFunctions, FormProps, MessagePlugin } from 'tdesign-vue-next'
```

**图标：**

```typescript
// 从 tdesign-icons-vue-next 导入图标
import { SunnyIcon, MoonIcon } from 'tdesign-icons-vue-next'
```

**注意：** `src/types/components.d.ts` 和 `src/types/auto-imports.d.ts` 为自动生成的文件，禁止手动编辑。

### 7. 导入路径规范

```typescript
// ✅ 使用 @ 别名导入通用模块
import { useUserStore } from '@/stores/useUserStore'
import { isDev } from '@/utils/isDev'
import request from '@/utils/request'
import { login } from '@/api/user'

// ❌ 使用通用方法或通用组件时，避免相对路径
import { useUserStore } from '../../stores/useUserStore'

// ✅ 使用只有当前模块才用得到的组件时，使用相对路径
import headerView from './header.vue'
import userInfo from './components/userInfo.vue'
```

**自动导入无需手动 import 的 API 和组件，详见**：[12. 自动导入](#12-自动导入)

### 8. 代码注释

- 当书写一些复杂逻辑的代码时，要增加注释，说明该代码的功能和实现逻辑。
- 关于书写函数的注释，不用写那么多冗余的，就写一行说明是什么功能就行了。
  ```typescript
  /**
   * 函数功能描述
   */
  function func(params) {}
  ```
- 当代码行数比较多的时候也要适当增加以下注释，用以视觉上区分不同的功能模块。
  ```typescript
  /* ===================xxx功能===================== */
  ```

### 9. API 接口编写规范

**目录结构规范：**

```
src/api/
├── user/              # 用户相关接口
│   ├── type.ts       # 类型定义（响应类型）
│   └── index.ts      # API 函数
├── yourModule/        # 新增模块
│   ├── type.ts
│   └── index.ts
└── ...
```

**编写原则：**

1. **type.ts** - 只定义响应类型

   ```typescript
   // ✅ 正确 - 只定义响应类型
   export interface UserResponse {
     id: string
     username: string
     nickName: string
     permissions: string[]
     roles: string[]
   }

   // ❌ 错误 - 不需要单独定义 DTO / 请求参数类型
   export interface CreateUserDto {
     username: string
     password?: string
   }
   ```

2. **index.ts** - 使用 `Partial<T>` 作为请求参数

   ```typescript
   import request from '@/utils/request'
   import type { UserResponse } from './type'

   // ✅ 正确 - 使用 Partial<T> 作为请求参数
   export function createUser(data: Partial<UserResponse>) {
     return request<UserResponse>({
       url: '/user/create',
       method: 'post',
       data,
     })
   }

   export function updateUser(userId: string, data: Partial<UserResponse>) {
     return request<UserResponse>({
       url: `/user/${userId}`,
       method: 'patch',
       data,
     })
   }
   ```

3. **URL 规范** - 不需要 API 前缀

   ```typescript
   // ✅ 正确 - request 的 baseURL 已通过 VITE_APP_BASE_API_URL 配置
   url: '/user/login'

   // ❌ 错误 - 不要重复添加前缀
   url: '/api/user/login'
   ```

4. **request 工具** - 已自动处理数据提取
   ```typescript
   // request 函数已经返回 res.data，不需要手动访问
   const response = await getUsers()
   // response 直接是 UserResponse[]，不需要 response.data
   ```

**完整示例：**

参考 `src/api/user/` 的实现。

### 10. 组件 API 接入规范

本规范定义了在 Vue 3 组件中调用 API 时的标准模式，使用 `<script setup lang="ts">`。

#### 10.1 状态管理

```typescript
const loading = ref(false)
const data = ref<YourType[]>([])
```

#### 10.2 查询操作（GET）

```typescript
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getList()
    data.value = response.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
```

#### 10.3 新增操作（POST）

```typescript
const handleAdd = async () => {
  loading.value = true
  try {
    await create(/* 数据 */)
    await fetchData()
    MessagePlugin.success('成功信息')
  } finally {
    loading.value = false
  }
}
```

#### 10.4 修改操作（PUT/PATCH）

```typescript
const handleSave = async (id: string) => {
  loading.value = true
  try {
    await update(/* 数据 */)
    MessagePlugin.success('成功信息')
    await fetchData()
  } finally {
    loading.value = false
  }
}
```

#### 10.5 删除操作（DELETE）

```typescript
const handleDelete = async (id: string) => {
  loading.value = true
  try {
    await deleteItem(/* 数据 */)
    await fetchData()
    MessagePlugin.success('成功信息')
  } finally {
    loading.value = false
  }
}
```

#### **核心原则：**

1. **loading 统一管理**：所有 API 调用前后都要正确设置 `loading.value` 状态
2. **try-finally 模式**：确保 loading 一定被重置，即使出错也不会卡住界面
3. **不使用 catch**：request 工具已自动处理错误并显示 MessagePlugin，组件层不需要重复处理
4. **数据统一刷新**：修改/删除操作成功后，统一调用 `fetchData()` 重新获取列表，避免数据不一致
5. **禁止手动数据操作**：不要在组件中手动 push、filter 数据，保证数据源单一
6. **使用 ref 响应式**：使用 `ref()` 包装状态，通过 `.value` 访问和修改

### 11. 状态管理(Pinia)

**Store 定义规范：**

Store 文件放在 `src/stores/useXxxStore/index.ts`。

**Setup 风格：**

```typescript
import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = useDark({
    onChanged: (isDark: boolean) => {
      document.documentElement.classList.toggle('dark', isDark)
      document.documentElement.setAttribute('theme-mode', isDark ? 'dark' : '')
    },
  })

  const toggleDark = (bl?: boolean) => {
    if (bl === undefined) isDark.value = !isDark.value
    else isDark.value = Boolean(bl)
  }

  return { isDark, toggleDark }
})
```

**在组件中使用：**

```typescript
const userStore = useUserStore()
// 读取 state
const token = userStore.token
// 读取 getter
const name = userStore.userName
// 调用 action
await userStore.login(params)
```

**持久化配置说明：**

- 使用 `pinia-plugin-persistedstate` 插件
- 在 `persist` 数组中配置需要持久化的字段
- `key` 为 localStorage 中的键名
- `pick` 指定需要持久化的 state 属性
- `serializer` 可自定义序列化方式

### 12. 自动导入

项目通过 `unplugin-auto-import` 和 `unplugin-vue-components` 实现自动导入，**无需手动 import**。

**Vue 核心 API（自动导入）：**

```typescript
// ✅ 直接使用，无需 import
const count = ref(0)
const doubled = computed(() => count.value * 2)
const route = useRoute()
const router = useRouter()

onMounted(() => {
  /* ... */
})
watch(count, (newVal) => {
  /* ... */
})
```

以下 Vue API 已自动导入：
`ref`, `reactive`, `computed`, `watch`, `watchEffect`, `onMounted`, `onUnmounted`,
`onBeforeMount`, `onBeforeUnmount`, `toRef`, `toRefs`, `nextTick`, `provide`, `inject` 等。

以下 Vue Router API 已自动导入：
`useRouter`, `useRoute`, `onBeforeRouteLeave`, `onBeforeRouteUpdate`

**TDesign 组件（自动导入）：**

```vue
<template>
  <!-- ✅ 直接使用 t- 前缀组件，无需 import -->
  <t-button>按钮</t-button>
  <t-input v-model="value" />
</template>
```

**注意：**

- 自动导入声明在 `src/types/auto-imports.d.ts` 和 `src/types/components.d.ts`，这两个文件为自动生成，禁止手动编辑
- ESLint 全局配置已包含自动导入的声明（`.eslintrc-auto-import.json`）
- 只有需要导入**类型**时才需要手动 import（如 `FormProps`, `MessagePlugin`）

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
