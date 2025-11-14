<script setup lang="ts">
import Layout from '@/layout/index.vue'
import { TdConfigProviderProps } from 'tdesign-vue-next'
import zh_CN_Config from 'tdesign-vue-next/es/locale/zh_CN'
const globalConfig = { ...zh_CN_Config } as unknown as TdConfigProviderProps['globalConfig']
</script>

<template>
  <t-config-provider :global-config="globalConfig">
    <Layout />
  </t-config-provider>
</template>

<style lang="scss" scoped></style>
