<template>
  <div :class="['sidebar-container', { 'dark-theme': isDarkTheme }]">
    <!-- 折叠按钮 -->
    <button class="toggle-btn" @click="toggleSidebar">
      <div ref="menuIcon" class="menu-icon">☰</div>
    </button>

    <!-- 侧边栏主体 -->
    <div ref="sidebar" class="sidebar">
      <!-- 主题切换 -->
      <div class="theme-switch">
        <button @click="toggleTheme">
          {{ isDarkTheme ? '🌞' : '🌙' }}
        </button>
      </div>

      <!-- 菜单项 -->
      <div
          v-for="(item, index) in menuItems"
          :key="item.id"
          class="menu-item"
          :class="{ active: activeItem === index }"
      >
        <div
            class="parent-item"
            @click="toggleSubMenu(index)"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="text">{{ item.text }}</span>
          <span class="arrow">{{ isSubMenuOpen(index) ? '▼' : '▶' }}</span>
        </div>

        <!-- 子菜单 -->
        <div
            v-if="item.children"
            ref="subMenus"
            class="sub-menu"
        >
          <div
              v-for="child in item.children"
              :key="child.id"
              class="child-item"
              @click="setActive(index)"
          >
            {{ child.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮提示 -->
    <div v-if="isCollapsed" class="tooltip" :style="tooltipPosition">
      {{ currentTooltip }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

// 类型定义
interface MenuItem {
  id: number
  text: string
  icon: string
  children?: MenuItem[]
}

// 响应式状态
const sidebar = ref<HTMLElement | null>(null)
const menuIcon = ref<HTMLElement | null>(null)
const subMenus = ref<HTMLElement[]>([])
const isCollapsed = ref(false)
const activeItem = ref<number | null>(null)
const activeSubMenu = ref<number | null>(null)
const isDarkTheme = ref(false)
const currentTooltip = ref('')
const tooltipPosition = reactive({ left: '0', top: '0' })

// 菜单数据
const menuItems: MenuItem[] = [
  { id: 1, text: 'Dashboard', icon: '🏠' },
  {
    id: 2,
    text: 'Products',
    icon: '📦',
    children: [
      { id: 21, text: 'List', icon: '📋' },
      { id: 22, text: 'Add New', icon: '➕' }
    ]
  },
  // 更多菜单项...
]

// GSAP 时间线
const sidebarTimeline = gsap.timeline({ paused: true })

// 初始化动画
onMounted(() => {
  // 侧边栏折叠动画配置
  sidebarTimeline
      .to(sidebar.value, {
        width: 60,
        duration: 0.3,
        ease: 'power2.inOut'
      })
      .to(menuIcon.value, {
        scale: 1.2,
        duration: 0.2,
        ease: 'elastic.out(1, 0.3)'
      }, '<')

  // 响应式处理
  handleResponsive()
  window.addEventListener('resize', handleResponsive)
})

// 清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResponsive)
  sidebarTimeline.kill()
})

// 侧边栏切换
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  sidebarTimeline.reversed(!sidebarTimeline.reversed())
}

// 子菜单动画处理
const toggleSubMenu = (index: number) => {
  const subMenu = subMenus.value[index]
  if (!subMenu) return

  // 手风琴效果
  if (activeSubMenu.value !== null && activeSubMenu.value !== index) {
    gsap.to(subMenus.value[activeSubMenu.value], {
      height: 0,
      autoAlpha: 0,
      duration: 0.3
    })
  }

  if (activeSubMenu.value === index) {
    // 关闭菜单
    gsap.to(subMenu, {
      height: 0,
      autoAlpha: 0,
      duration: 0.3
    })
    activeSubMenu.value = null
  } else {
    // 打开菜单
    gsap.fromTo(subMenu,
        { height: 0, autoAlpha: 0 },
        {
          height: 'auto',
          autoAlpha: 1,
          duration: 0.3,
          onStart: () => {
            subMenu.style.display = 'block'
          }
        }
    )
    activeSubMenu.value = index
  }
}

// 响应式处理
const handleResponsive = () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  if (isMobile && !isCollapsed.value) {
    sidebarTimeline.play()
    isCollapsed.value = true
  }
}

// 工具提示处理
const showTooltip = (event: MouseEvent, text: string) => {
  if (!isCollapsed.value) return
  currentTooltip.value = text
  tooltipPosition.left = `${event.pageX + 15}px`
  tooltipPosition.top = `${event.pageY}px`
}

// 主题切换
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
}

// 辅助方法
const isSubMenuOpen = (index: number) => activeSubMenu.value === index
const setActive = (index: number) => (activeItem.value = index)
</script>

<style scoped>
.sidebar-container {
  position: relative;
  --sidebar-width: 240px;
  --icon-size: 24px;
  --transition-speed: 0.3s;
}

.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: #ffffff;
  transition: background var(--transition-speed) ease-in-out;
  padding: 20px 0;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.dark-theme .sidebar {
  background: #2d2d2d;
  color: white;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  position: relative;
}

.parent-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: var(--icon-size);
  flex-shrink: 0;
}

.text {
  white-space: nowrap;
  transition: opacity var(--transition-speed);
}

.sub-menu {
  overflow: hidden;
  padding-left: 40px;
  display: none;
}

.child-item {
  padding: 8px 0;
  opacity: 0.8;
}

.active {
  background: rgba(66, 185, 130, 0.1);
  border-radius: 4px;
}

.toggle-btn {
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 100;
  background: none;
  border: none;
  cursor: pointer;
}

.tooltip {
  position: fixed;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  .text, .arrow {
    display: none;
  }
}
</style>