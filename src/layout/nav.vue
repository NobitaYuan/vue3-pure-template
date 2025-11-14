<script lang="ts" setup>
const navList = [
  { name: '项目管理', path: '/project', icon: 'app' },
  { name: '体系架构设计', path: '/architectureDesign', icon: 'system-2' },
  { name: '建模知识库', path: '/knowledgelib', icon: 'system-coordinate' },
  { name: '体系框架库', path: '/framewokLib', icon: 'system-application' },
  { name: '模型库', path: '/modelLib', icon: 'system-components' },
]

const route = useRoute()
const activePath = computed(() => route.path)
const isPathActive = (path: string) => {
  const rootPath = activePath.value.split('/')[1]
  return `/${rootPath}` === path
}
</script>

<template>
  <div class="nav">
    <RouterLink class="navItem" :class="{ active: isPathActive(item.path) }" v-for="item in navList" :key="item.path" :to="item.path">
      <t-icon v-if="item.icon" :name="item.icon" />
      <div class="text">{{ item.name }}</div>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
  align-items: center;
  .navItem {
    padding: 6px 10px;
    border-radius: 2px;
    transition: all 0.15s ease-in-out;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    .text {
      white-space: nowrap;
    }
    &.active {
      background-color: #fff;
      color: var(--td-brand-color);
    }
    &:hover {
      background-color: #fff;
      color: var(--td-brand-color);
    }
  }
}
</style>
