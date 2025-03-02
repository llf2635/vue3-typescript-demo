### GSAP 简介

**GSAP** (GreenSock Animation Platform) 是一个高性能的 JavaScript 动画库，用于创建跨浏览器的平滑动画效果。支持 CSS、SVG、DOM 元素、Canvas 甚至 JavaScript 对象的动画。

---

### 核心作用
1. 创建复杂的动画序列和时间轴控制。
2. 优化动画性能，避免卡顿。
3. 支持多种动画类型（位移、旋转、颜色、SVG路径等）。
4. 提供插件扩展能力（滚动触发、拖拽、物理效果等）。

---

### 核心概念
1. **Tween**：单个动画效果，控制一个目标对象的属性变化（如 `gsap.to()`）。
2. **Timeline**：时间轴容器，用于编排多个 Tween 动画的时序。
3. **Easing**：缓动函数，控制动画速度变化（如 `Power4.easeOut`）。
4. **Plugins**：扩展功能插件（如 `ScrollTrigger`、`Draggable`）。

---

### 常用方法
| 方法                  | 说明                                 |
|-----------------------|--------------------------------------|
| `gsap.to()`           | 从当前状态过渡到目标状态。           |
| `gsap.from()`         | 从指定状态过渡到当前状态。           |
| `gsap.fromTo()`       | 自定义起始和结束状态。               |
| `timeline.add()`      | 将动画添加到时间轴。                 |
| `timeline.addPause()` | 在时间轴中添加暂停点。               |
| `gsap.effects`        | 预定义动画效果（需插件支持）。       |

---

### 在 Vue3 + TS + Vite 中集成 GSAP

#### 1. 安装依赖
```bash
npm install gsap
# 可选插件
npm install @gsap/shockingly @gsap/business
```

#### 2. 基础使用示例
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger' // 按需引入插件

// 注册插件
gsap.registerPlugin(ScrollTrigger)

const boxRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 确保 DOM 已渲染
  if (!boxRef.value) return

  // 示例1：基础动画
  gsap.to(boxRef.value, {
    x: 200,
    rotation: 360,
    duration: 2,
    ease: 'power2.out',
    delay: 0.5
  })

  // 示例2：时间轴动画
  const tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(boxRef.value, { y: 100, duration: 1 })
    .to(boxRef.value, { opacity: 0.5, duration: 0.5 }, '+=0.5') // 0.5秒延迟

  // 示例3：滚动触发动画
  gsap.to(boxRef.value, {
    scrollTrigger: {
      trigger: boxRef.value,
      start: 'top center',
      end: 'bottom top',
      toggleActions: 'play none none reverse'
    },
    x: 300,
    backgroundColor: '#ff0000'
  })
})
</script>

<template>
  <div ref="boxRef" class="box">Animate Me!</div>
</template>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background: #42b883;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

---

### 进阶用法示例

#### 1. 交错动画（Stagger）
```typescript
// 多个元素动画
const items = ref<HTMLElement[]>([])

gsap.from(items.value, {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2 // 每个元素间隔0.2秒
})
```

#### 2. 动画回调
```typescript
gsap.to(element, {
  x: 100,
  onStart: () => console.log('动画开始'),
  onComplete: () => console.log('动画完成')
})
```

#### 3. 响应式数据联动
```typescript
const progress = ref(0)

gsap.to({ value: 0 }, {
  value: 1,
  duration: 3,
  onUpdate: (tween) => {
    progress.value = tween.progress() // 实时更新Vue响应式变量
  }
})
```

---

### 最佳实践
1. **动画清理**：在组件卸载时移除动画：
   ```typescript
   import { onUnmounted } from 'vue'
   
   const ctx = gsap.context(() => {}, boxRef) // 作用域限定
   onUnmounted(() => ctx.revert())
   ```
2. **性能优化**：优先使用 `transform` 属性（如 `x` 替代 `left`）。
3. **插件按需加载**：仅引入需要的插件减少包体积。

通过以上方式，可以在 Vue3 项目中高效利用 GSAP 实现专业级动画效果。