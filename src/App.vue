<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { zhCn } from 'element-plus/es/locale/index.mjs'
import { RouterView } from 'vue-router'
</script>

<template>
    <el-config-provider :locale="zhCn">
        <RouterView v-slot="{ Component, route }">
            <transition :mode="'out-in'" enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp">
                <keep-alive>
                    <component :is="Component" :key="route.name" />
                </keep-alive>
            </transition>
        </RouterView>
    </el-config-provider>
</template>

<style lang="scss" scoped>
// 动画速度
.animate__animated {
    --animate-duration: 0s;
}
</style>
