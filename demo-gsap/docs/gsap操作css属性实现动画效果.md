
---

### GSAP 的动画处理能力解析

GSAP 的核心优势在于它能动态修改 **任何 CSS 属性** 和 **自定义 JavaScript 属性**，甚至包括浏览器未原生支持的属性。它会自动处理以下内容：

1. **CSS 属性**：自动补全浏览器前缀（如 `-webkit-`），解析复杂格式（如 `transform` 的矩阵计算）。
2. **单位处理**：智能转换数值单位（如 `px`、`%`、`vw`）。
3. **复杂值解析**：支持颜色、路径、函数表达式（如 `calc()`）。
4. **非 CSS 属性**：支持动画化任意 JavaScript 对象属性。

---

### 使用示例（Vue3 + TS + Vite）

#### 示例 1：常见 CSS 属性动画
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const boxRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!boxRef.value) return

  // 同时动画化 transform、opacity、background-color
  gsap.to(boxRef.value, {
    x: 100,           // transform: translateX(100px)
    scale: 1.5,       // transform: scale(1.5)
    opacity: 0.5,     // CSS opacity
    backgroundColor: '#ff0000', // 自动处理颜色格式
    duration: 2
  })
})
</script>

<template>
  <div ref="boxRef" class="box">Common Properties</div>
</template>
```

---

#### 示例 2：非常见 CSS 属性
```vue
<script setup lang="ts">
// 动画化 clip-path 和 filter
gsap.to(element, {
  clipPath: 'inset(10% 20% 30% 40%)',  // 剪切路径动画
  filter: 'blur(5px) hue-rotate(90deg)', // 模糊和色相旋转
  duration: 3
})
</script>
```

---

#### 示例 3：CSS 变量（自定义属性）
```vue
<script setup lang="ts">
// 通过 GSAP 修改 CSS 变量
gsap.to(document.documentElement, {
  '--theme-color': '#00ff00', // 修改根元素的 CSS 变量
  '--size': '200px',          // 动态调整尺寸变量
  duration: 2
})
</script>

<style>
:root {
  --theme-color: #42b883;
  --size: 100px;
}
.box {
  width: var(--size);
  background: var(--theme-color);
}
</style>
```

---

#### 示例 4：非 CSS 属性（自定义 JS 对象）
```vue
<script setup lang="ts">
// 动画化任意 JavaScript 对象属性
const customObject = ref({ progress: 0, angle: 0 })

gsap.to(customObject.value, {
  progress: 100,   // 自定义数值属性
  angle: 360,      // 旋转角度
  duration: 3,
  onUpdate: () => {
    console.log('当前值:', customObject.value.progress)
  }
})
</script>
```

---

#### 示例 5：SVG 属性动画
```vue
<script setup lang="ts">
// 修改 SVG 元素的路径和描边
const svgPath = ref<SVGPathElement | null>(null)

gsap.to(svgPath.value, {
  attr: {
    d: 'M 10 80 Q 95 10 180 80', // 动态改变 SVG 路径
    'stroke-width': 5            // 描边宽度
  },
  duration: 2
})
</script>

<template>
  <svg>
    <path ref="svgPath" d="M 10 10 L 100 100" stroke="#000" />
  </svg>
</template>
```

---

### 关键原理说明

1. **自动补全**  
   GSAP 会自动将 `x` 转换为 `translateX()`，并添加浏览器前缀。例如：
   ```js
   gsap.to(element, { x: 100 }) 
   // 实际修改的是 transform: matrix(1, 0, 0, 1, 100, 0)
   ```

2. **复杂值解析**  
   支持直接操作复合属性：
   ```js
   gsap.to(element, {
     transform: 'translate(100px, 50px) rotate(30deg)', // 直接操作整个 transform
     duration: 2
   })
   ```

3. **单位智能处理**  
   混合单位自动计算：
   ```js
   gsap.to(element, {
     width: '+=50%',  // 基于当前宽度增加 50%
     x: '30vw'        // 使用视口单位
   })
   ```

---

### 注意事项

1. **性能优化**
    - 优先使用 `transform` 和 `opacity`（触发 GPU 加速）。
    - 避免频繁修改 `width`/`height`（触发重排）。

2. **浏览器兼容性**
    - 某些 CSS 属性（如 `clip-path`）需注意浏览器支持范围。

3. **动态属性监控**  
   GSAP 不会自动跟踪响应式数据变化，需手动重启动画或使用 `onUpdate` 回调。

通过这种灵活性，GSAP 可以轻松实现从简单位移动画到复杂数据可视化的全场景需求。