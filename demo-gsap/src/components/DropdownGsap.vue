<template>
  <div class="dropdown">
    <button @click="toggleDropdown">菜单 ▼</button>
    <div class="dropdown-content" ref="dropdownRef">
      <div v-for="item in 5" :key="item">选项 {{ item }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const dropdownTl = ref<gsap.core.Timeline>()

const toggleDropdown = () => {
  if (!dropdownTl.value) {
    dropdownTl.value = gsap.timeline({ paused: true })
        .to(dropdownRef.value, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
  }

  isOpen.value ? dropdownTl.value.reverse() : dropdownTl.value.play()
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  height: 0;
  opacity: 0;
  background: white;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}
</style>