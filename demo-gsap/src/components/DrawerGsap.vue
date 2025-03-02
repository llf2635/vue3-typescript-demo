<template>
  <button @click="toggleDrawer">切换抽屉</button>
  <div class="drawer" ref="drawerRef">
    <div class="drawer-content">抽屉内容</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

const drawerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const drawerTween = ref<gsap.core.Tween>()

const toggleDrawer = () => {
  if (!drawerTween.value) {
    drawerTween.value = gsap.to(drawerRef.value, {
      x: '100%',
      paused: true,
      duration: 0.5,
      ease: 'power2.inOut'
    })
  }

  isOpen.value ? drawerTween.value.reverse() : drawerTween.value.play()
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  transform: translateX(100%);
}
</style>