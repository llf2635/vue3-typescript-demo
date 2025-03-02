<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TextPlugin from 'gsap/TextPlugin'
import Draggable from 'gsap/Draggable'

// 注册插件
gsap.registerPlugin(ScrollTrigger, TextPlugin, Draggable)

const elementRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const draggableRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 确保 DOM 已加载
  if (!elementRef.value || !textRef.value || !draggableRef.value) return

  // 示例1: ScrollTrigger 滚动触发动画
  gsap.to(elementRef.value, {
    scrollTrigger: {
      trigger: elementRef.value,
      start: 'top center', // 当元素顶部到达视口中心时触发
      toggleActions: 'play none none reverse' // 滚动进入时播放，离开时反向
    },
    x: 300,
    rotation: 360,
    duration: 2
  })

  // 示例2: TextPlugin 文字动画
  gsap.to(textRef.value, {
    duration: 3,
    text: {
      value: 'This text is animated by GSAP!', // 逐字符显示
      delimiter: ' ' // 按空格分隔单词
    },
    ease: 'none'
  })

  // 示例3: Draggable 拖拽功能
  Draggable.create(draggableRef.value, {
    bounds: '#container', // 限制在父容器内拖拽
    inertia: true, // 启用惯性效果
    onDrag: () => console.log('Dragging...')
  })
})

// 清理动画
onUnmounted(() => {
  gsap.killTweensOf(elementRef.value) // 停止所有动画
})
</script>

<template>
  <div class="container" id="container">
    <div ref="elementRef" class="box">Scroll Trigger</div>
    <div ref="textRef" class="text"></div>
    <div ref="draggableRef" class="draggable-box">Drag Me</div>
  </div>
</template>

<style scoped>
.container {
  height: 200vh; /* 用于滚动演示 */
}
.box {
  width: 100px;
  height: 100px;
  background: #42b883;
}
.draggable-box {
  width: 80px;
  height: 80px;
  background: #ff6b6b;
  cursor: move;
}
</style>