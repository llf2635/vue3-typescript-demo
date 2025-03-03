<template>
  <div class="container">
    <div class="controls">
      <select v-model="direction" class="direction-select">
        <option value="top">Top</option>
        <option value="right">Right</option>
        <option value="bottom">Bottom</option>
        <option value="left">Left</option>
      </select>
      <button @click="toggleDrawer" class="toggle-button">
        {{ isOpen ? 'Close' : 'Open' }}
      </button>
    </div>

    <div ref="drawerContent" class="drawer-content" :class="direction">
      <div class="content-inner">
        <h2>Drawer Content</h2>
        <p>This is a responsive drawer example.</p>
        <p>Current direction: {{ direction }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'

const direction = ref<'top' | 'right' | 'bottom' | 'left'>('right')
const isOpen = ref(false)
const drawerContent = ref<HTMLElement | null>(null)

const tl = gsap.timeline({ paused: true })

watch(direction, (newDir) => {
  // 重置动画
  tl.clear()
  if (drawerContent.value) {
    // 根据方向设置初始位置和动画
    const transforms: Record<typeof newDir, string> = {
      top: 'translateY(-100%)',
      right: 'translateX(100%)',
      bottom: 'translateY(100%)',
      left: 'translateX(-100%)'
    }

    gsap.set(drawerContent.value, {
      [newDir === 'top' || newDir === 'bottom' ? 'y' : 'x']: transforms[newDir]
    })

    tl.to(drawerContent.value, {
      [newDir === 'top' || newDir === 'bottom' ? 'y' : 'x']: 0,
      duration: 0.5,
      ease: 'power1.out'
    })
  }
}, { immediate: true })

const toggleDrawer = () => {
  isOpen.value ? tl.reverse() : tl.play()
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.controls {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 1rem;
  z-index: 100;
}

.direction-select, .toggle-button {
  padding: 0.5rem 1rem;
  border: 2px solid #333;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
}

.drawer-content {
  position: fixed;
  background: #f0f0f0;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  overflow: auto;
  padding: 20px;
}

.drawer-content.top, .drawer-content.bottom {
  width: 100%;
  height: 30vh;
  left: 0;
}

.drawer-content.left, .drawer-content.right {
  width: 300px;
  height: 100vh;
  top: 0;
}

.drawer-content.top { top: 0 }
.drawer-content.right { right: 0 }
.drawer-content.bottom { bottom: 0 }
.drawer-content.left { left: 0 }

.content-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .drawer-content.left, .drawer-content.right {
    width: 80vw;
  }
}
</style>