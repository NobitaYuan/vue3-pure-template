<script lang="ts" setup>
import { useUserStore } from '@/stores/useUserStore'
import { UserCircleIcon, ChevronDownIcon, PoweroffIcon, MailIcon } from 'tdesign-icons-vue-next'

const userStore = useUserStore()
</script>

<template>
  <div class="userInfo">
    <!-- 消息 -->
    <t-popup expand-animation placement="bottom-right" trigger="click">
      <t-badge :count="3" :offset="[4, 6]">
        <t-button theme="default" shape="square" variant="text">
          <MailIcon />
        </t-button>
      </t-badge>
      <template #content>
        <div class="w-[260px] min-h-[180px]">
          <t-empty></t-empty>
        </div>
      </template>
    </t-popup>

    <!-- 用户 -->
    <t-dropdown :min-column-width="120" trigger="click" :placement="'bottom-right'">
      <template #dropdown>
        <t-dropdown-menu>
          <t-dropdown-item class="operations-dropdown-container-item"> <UserCircleIcon />用户信息 </t-dropdown-item>
          <t-dropdown-item class="operations-dropdown-container-item" @click="userStore.logout(true)"> <PoweroffIcon />退出登录 </t-dropdown-item>
        </t-dropdown-menu>
      </template>
      <t-button theme="default" variant="text">
        <template #icon>
          <UserCircleIcon class="header-user-avatar" />
        </template>
        <div class="header-user-account">{{ userStore.userName }}</div>
        <template #suffix><ChevronDownIcon /></template>
      </t-button>
    </t-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.userInfo {
  display: flex;
  gap: 8px;
  :deep(.t-button--variant-text) {
    color: #fff;
    &:hover {
      color: var(--td-brand-color);
      background-color: var(--td-bg-color-container);
    }
  }
}
.operations-dropdown-container-item {
  width: 100%;
  display: flex;
  align-items: center;

  :deep(.t-dropdown__item-text) {
    display: flex;
    align-items: center;
  }

  .t-icon {
    font-size: var(--td-comp-size-xxs);
    margin-right: var(--td-comp-margin-l);
  }

  :deep(.t-dropdown__item) {
    width: 100%;
    margin-bottom: 0;
  }

  &:last-child {
    :deep(.t-dropdown__item) {
      margin-bottom: 8px;
    }
  }
}
</style>
