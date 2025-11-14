<script lang="ts" setup>
import { loginParams } from '@/api/user'
import { useUserStore } from '@/stores/useUserStore'
import { isDev } from '@/utils/isDev'
import { FormInstanceFunctions, FormProps, MessagePlugin } from 'tdesign-vue-next'

const title = import.meta.env.VITE_APP_TITLE

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 表单内容
const formData = ref<loginParams>({
  username: '',
  password: '',
})
// 规则
const rules: FormProps['rules'] = {
  username: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
}
const formRef = ref<FormInstanceFunctions>(null)

const isLoading = ref(false)
const loginFn = async () => {
  isLoading.value = true
  try {
    const res1 = await formRef.value.validate()
    if (res1 !== true) return
    await userStore.login(formData.value)
    await userStore.getUserInfo()
    MessagePlugin.success('登录成功')
    const redirect = route.query.redirect as string
    const toUrl = redirect ? decodeURIComponent(redirect) : '/'
    router.replace(toUrl)
  } catch (error) {
    void error
  } finally {
    isLoading.value = false
  }
}

// 开发环境下默认填入账号密码
if (isDev) {
  formData.value.username = 'admin'
  formData.value.password = 'admin123'
}
</script>

<template>
  <div class="login">
    <div class="formbox">
      <div class="title">{{ title }}</div>
      <div class="form">
        <t-form ref="formRef" :data="formData" :rules="rules" labelAlign="top">
          <t-form-item :label="$t('account')" name="username">
            <t-input size="large" v-model="formData.username" />
          </t-form-item>
          <t-form-item :label="$t('password')" name="password">
            <t-input size="large" v-model="formData.password" type="password" />
          </t-form-item>
        </t-form>
      </div>
      <div class="btn">
        <t-button block size="large" theme="primary" :loading="isLoading" @click="loginFn">{{ $t('login') }}</t-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-image: url(../../assets/images/login-bg.png);
  background-position: center center;

  .formbox {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    border-radius: 8px;
    box-shadow: 0 0 32.9px 11px rgba(0, 0, 0, 0.11);
    padding: 24px;
    padding-top: 36px;
    min-width: 450px;
    background-color: var(--td-bg-color-container);
    background: rgba(0, 66, 108, 0.6);
    box-shadow:
      0 0 32.9px 11px rgba(0, 0, 0, 0.28),
      -1px 0 22.8px 4px rgba(0, 127, 181, 0.4) inset;
    margin-bottom: 10%;
    border-radius: 10px;
    // background: rgb(0 66 108 / 60%);
    // box-shadow:
    //   0 0 32.9px 11px rgb(0 0 0 / 28%),
    //   -1px 0 22.8px 4px rgb(0 127 181 / 40%) inset;
    .title {
      font-size: 36px;
      color: #fff;
      font-weight: bold;
    }
    .form {
      width: 100%;
      :deep(.t-form__label) {
        color: #fff;
        font-size: 14px;
        &:before {
          display: none !important;
        }
      }
    }
    .btn {
      width: 100%;
    }
  }
}
</style>
