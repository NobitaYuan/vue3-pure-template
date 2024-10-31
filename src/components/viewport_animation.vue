<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
interface IProps {
    animateCalss?: string // 配合animate.css使用，效果更佳
    duration?: string // 动画持续时间
    once?: boolean // 动画是否只播放一次
}
const Props = withDefaults(defineProps<IProps>(), {
    animateCalss: 'rise_up',
    duration: '0.5s',
    once: true,
})
const show = ref(true)
const containerBox = ref<HTMLElement | null>(null)
const { stop } = useIntersectionObserver(containerBox, ([{ isIntersecting }]) => {
    show.value = isIntersecting
    if (Props.once) {
        stop()
    }
})
</script>

<template>
    <div class="viewport_animation_container" :class="show ? Props.animateCalss : ''" ref="containerBox">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.viewport_animation_container {
}
.rise_up {
    --animate-duration: v-bind(Props.duration);
    animation: up var(--animate-duration) ease-in-out;
    @keyframes up {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>
