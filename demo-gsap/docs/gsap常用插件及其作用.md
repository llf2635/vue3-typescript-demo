GSAP官方文档中提到的以下插件和缓动工具中，**免费**和**付费**的区分如下：

---

### **免费插件**（包含在核心库或开放使用）
1. **ScrollTrigger**
    - 用于创建滚动驱动的动画（如视差、滚动固定、触发动画等）。
    - **免费**（从GSAP 3.5+开始集成到核心库）。

2. **ScrollTo**
    - 平滑滚动到页面指定位置。
    - **免费**（属于核心功能，无需额外插件）。

3. **Draggable**
    - 实现元素的拖拽交互功能。
    - **免费**（需单独引入，但无需会员权限）。

4. **Text**
    - 文本动画插件（如字符逐字显现效果）。
    - **免费**（但需通过`gsap.text.js`引入）。
   
1. **Flip**
    - 实现布局切换动画（如DOM元素位置/尺寸变化的平滑过渡）。
    - **付费**（会员插件，需授权）。

2. **Observer**
    - 监听触摸、滚轮、手势等交互事件。
    - **付费**（会员插件）。

3. **MotionPath**
    - 让元素沿自定义路径运动。
    - **付费**（会员插件）。

4. **Easel**
    - 与EaselJS库集成，用于Canvas动画。
    - **付费**（会员插件）。

5. **Pixi**
    - 与PixiJS库集成，用于高性能WebGL/Canvas动画。
    - **付费**（会员插件）。

---

### **缓动工具（Eases）**
1. **RoughEase**
    - 生成随机抖动的缓动效果。
    - **免费**（核心库内置）。

2. **SlowMo**
    - 慢动作缓动效果。
    - **免费**（通过`gsap.effects`使用）。

3. **CustomEase**
    - 自定义贝塞尔缓动曲线。
    - **免费**（需引入`CustomEase.js`文件，但无需会员）。

4. **ExpoScaleEase**
    - 增强指数缓动的缩放控制。
    - **付费**（需会员权限）。

---


---

### GSAP 免费插件及作用

GSAP 提供了一系列免费插件来扩展动画能力，以下是常用免费插件及其核心功能：

| 插件名称            | 作用                                                                 |
|---------------------|----------------------------------------------------------------------|
| **ScrollTrigger**   | 基于滚动位置触发动画（如视差效果、滚动到特定位置播放动画）。         |
| **TextPlugin**      | 实现文字逐字符动画（如打字机效果）。                                 |
| **Draggable**       | 为元素添加拖拽交互功能。                                             |
| **ScrollToPlugin**  | 平滑滚动到页面指定位置。                                             |
| **MotionPathPlugin**| 让元素沿 SVG/Canvas 路径运动。                                       |
| **AttrPlugin**      | 动态修改 HTML/SVG 元素的属性（如 `viewBox`、`href`）。               |
| **CSSRulePlugin**   | 动画化 CSS 规则（如 `::before`/`::after` 伪元素）。                  |

---

### 在 Vue3 + TS + Vite 中集成插件

#### 1. 安装 GSAP 及插件
```bash
npm install gsap @gsap/shockingly
```

#### 2. 基础集成示例
在 Vue3 组件中按需引入插件并注册：

```vue
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
```

---

### 进阶插件使用示例

#### 1. **MotionPathPlugin - 路径运动**
```typescript
import MotionPathPlugin from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

// 沿 SVG 路径运动
gsap.to(elementRef.value, {
  duration: 5,
  motionPath: {
    path: document.querySelector('#svg-path'), // SVG 路径元素
    align: 'self' // 元素对齐路径方向
  },
  repeat: -1
})
```

#### 2. **ScrollToPlugin - 平滑滚动**
```typescript
import ScrollToPlugin from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

// 点击按钮滚动到顶部
const scrollToTop = () => {
  gsap.to(window, {
    duration: 1,
    scrollTo: 0,
    ease: 'power2.inOut'
  })
}
```

#### 3. **AttrPlugin - 修改属性**
```typescript
import AttrPlugin from 'gsap/AttrPlugin'

gsap.registerPlugin(AttrPlugin)

// 动态修改 SVG 的 viewBox
gsap.to(svgElement, {
  duration: 2,
  attr: {
    viewBox: '0 0 500 500' // 修改 viewBox 属性
  }
})
```

---

### 最佳实践

1. **按需加载插件**：仅引入需要的插件以减少包体积。
2. **动画清理**：使用 `gsap.context()` 统一管理动画作用域：
   ```typescript
   const ctx = gsap.context(() => {
     // 所有动画在此作用域内
   }, elementRef) // 绑定到父元素
   onUnmounted(() => ctx.revert()) // 自动清理动画
   ```
3. **性能优化**：优先使用 `transform` 和 `opacity`，避免触发重排。

通过合理使用插件，可以在 Vue3 项目中实现复杂的交互和动画效果，同时保持代码的可维护性。