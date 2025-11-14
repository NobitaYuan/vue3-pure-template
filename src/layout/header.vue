<script lang="tsx" setup>
import { useDarkModeStore } from '@/stores'
import { SunnyIcon, MoonIcon } from 'tdesign-icons-vue-next'
import { SwitchProps } from 'tdesign-vue-next'
import { RouterLink } from 'vue-router'
import navCom from './nav.vue'
import userInfo from './components/userInfo.vue'

const logoUrl = new URL('@/assets/images/logo.png', import.meta.url).href

const darkModeStore = useDarkModeStore()

const title = import.meta.env.VITE_APP_TITLE
const renderContent: SwitchProps['label'] = (h, data) => {
  return data.value ? <SunnyIcon /> : <MoonIcon />
}
</script>

<template>
  <div class="header">
    <RouterLink to="/" class="logo">
      <img class="logoImg" :src="logoUrl" alt="logo" />
      <div class="text">
        {{ title }}
      </div>
    </RouterLink>
    <div class="nav">
      <navCom />
    </div>
    <div class="setting">
      <t-switch :size="'large'" v-model="darkModeStore.isDark" :label="renderContent"></t-switch>
      <userInfo />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  padding-left: 12px;
  padding-right: 24px;
  background-color: #0052d9;
  transition: all 0.3s;
  color: #fff;
  .logo {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: bold;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
    .text {
      font-size: 20px;
      font-weight: bold;
    }
    .logoImg {
      width: 50px;
    }
  }
  .nav {
    height: 100%;
    padding: 0 12px;
  }
  .setting {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    :deep(.t-switch) {
      background-color: var(--td-brand-color-6);
    }
  }
}
</style>
