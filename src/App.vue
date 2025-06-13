<script setup lang="ts">
import { TdConfigProviderProps } from 'tdesign-vue-next'
import { RouterView } from 'vue-router'
import zh_CN_Config from 'tdesign-vue-next/es/locale/zh_CN'
const globalConfig = { ...zh_CN_Config } as unknown as TdConfigProviderProps['globalConfig']
</script>

<template>
    <t-config-provider :global-config="globalConfig">
        <RouterView v-slot="{ Component, route }">
            <transition :mode="'out-in'" enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp">
                <keep-alive>
                    <component :is="Component" :key="route.name" />
                </keep-alive>
            </transition>
        </RouterView>
    </t-config-provider>
</template>

<style lang="scss" scoped>
// 动画速度
.animate__animated {
    --animate-duration: 0s;
}
</style>
