<script lang="ts" setup>
import headerView from './header.vue'
</script>

<template>
  <div class="layout_container">
    <header class="hd" v-if="$route.meta.showHeader !== false">
      <headerView></headerView>
    </header>
    <main class="bd">
      <RouterView v-slot="{ Component, route }">
        <!-- <transition :mode="'out-in'" enter-active-class="animate__animated animate__fadeInDown" leave-active-class="animate__animated animate__fadeOutUp"> -->
        <component :is="Component" :key="route.name" class="bd_container" />
        <!-- </transition> -->
      </RouterView>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout_container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--layout-bg);
  .hd {
    flex-shrink: 0;
  }
  .bd {
    flex: 1;
    overflow: auto;
    // padding: 12px;
    // .bd_container {
    //   // border: 1px solid #e4e7ed;
    //   border-radius: 4px;
    //   background-color: var(--td-bg-color-container);
    // }
  }
}
// 动画速度
.animate__animated {
  --animate-duration: 0.15s;
}
</style>
