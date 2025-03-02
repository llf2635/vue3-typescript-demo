<template>
  <button @click="toggleSidebar">☰</button>
  <div class="sidebar" ref="sidebarRef">
    <div class="sidebar-content">
      <h3>菜单</h3>
      <nav>
        <a v-for="item in 5" :key="item">菜单项 {{ item }}</a>
      </nav>
    </div>
    <div class="sidebar-overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

const sidebarRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const sidebarTl = ref<gsap.core.Timeline>()

const toggleSidebar = () => {
  if (!sidebarTl.value) {
    sidebarTl.value = gsap.timeline({ paused: true })
        .to(sidebarRef.value, {
          x: '-100%',
          duration: 0.4,
          ease: 'power3.out'
        })
        .to('.sidebar-overlay', {
          opacity: 1,
          duration: 0.2
        }, 0)
  }

  isOpen.value ? sidebarTl.value.reverse() : sidebarTl.value.play()
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: -100%;
  width: 250px;
  height: 100vh;
  background: white;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  opacity: 0;
  z-index: 999;
}
</style>