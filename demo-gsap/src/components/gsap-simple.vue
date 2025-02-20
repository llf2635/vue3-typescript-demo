<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// 获取 DOM 引用
const box = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!box.value) return

  // 基础动画：移动 + 旋转
  gsap.to(box.value, {
    x: 200,
    rotation: 360,
    duration: 2,
    ease: 'power2.out'
  })
})
</script>

<template>
  <div ref="box" class="box"></div>
</template>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background: #42b983;
}
</style>