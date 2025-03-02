**GSAP（GreenSock Animation Platform）** 是一个高性能的 JavaScript 动画库，广泛用于创建复杂的网页动画和交互效果。它具有跨浏览器兼容性、灵活的动画控制、流畅的性能表现以及丰富的插件生态，是前端开发中动画实现的首选工具之一。

---

### **GSAP 的核心作用**
1. **高性能动画**：通过优化算法减少重绘和重排，保证动画流畅。
2. **精细控制**：支持时间轴（Timeline）、动画序列、暂停/恢复、速度控制等。
3. **跨平台兼容**：支持所有现代浏览器（包括 IE9+）。
4. **丰富的插件**：扩展功能如滚动触发、物理动画、复杂路径等。
5. **轻量模块化**：按需引入核心库和插件，减少打包体积。

---

### **常用 GSAP 插件**
| 插件名称            | 作用                                 |
|---------------------|--------------------------------------|
| `ScrollTrigger`     | 基于滚动位置触发动画（核心插件）     |
| `TextPlugin`        | 实现文字逐字或渐变效果               |
| `EaselPlugin`       | 与 Adobe EaselJS 集成                |
| `MorphSVGPlugin`    | 复杂 SVG 路径变形动画                |
| `DrawSVGPlugin`     | SVG 路径绘制动画                     |
| `Draggable`         | 实现拖拽交互                         |
| `Physics2DPlugin`   | 添加物理运动效果（如惯性、弹性）     |
| `CustomEase`        | 自定义贝塞尔缓动曲线                 |

---

### **在 Vue3 + TypeScript + Vite 中使用 GSAP**

#### 1. 安装 GSAP
```bash
npm install gsap
# 或
yarn add gsap
```

#### 2. 引入 GSAP 及插件
在 Vue 组件中按需引入：
```typescript
// 示例：引入核心库和 ScrollTrigger
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册插件（必须调用）
gsap.registerPlugin(ScrollTrigger);
```

#### 3. 在 Vue 组件中使用
```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import { CustomEase } from "gsap/CustomEase";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { EaselPlugin } from "gsap/EaselPlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextPlugin } from "gsap/TextPlugin";

// 注册插件
gsap.registerPlugin(Flip,ScrollTrigger,Observer,ScrollToPlugin,Draggable,MotionPathPlugin,EaselPlugin,PixiPlugin,TextPlugin,RoughEase,ExpoScaleEase,SlowMo,CustomEase);

const box = ref<HTMLElement | null>(null);

onMounted(() => {
  if (box.value) {
    // 基本动画示例
    gsap.to(box.value, {
      x: 100,
      rotation: 360,
      duration: 2,
      scrollTrigger: {
        trigger: box.value,
        start: "top center", // 滚动到元素顶部居中时触发
        toggleActions: "play none none reverse"
      }
    });
  }
});
</script>

<template>
  <div ref="box" class="box">Hello GSAP!</div>
</template>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: #42b883;
}
</style>
```

#### 4. 类型声明支持（TypeScript）
如果遇到类型错误，在 `vite-env.d.ts` 中添加：
```typescript
/// <reference types="gsap/ScrollTrigger" />
```

---

### **注意事项**
1. **Tree-Shaking 优化**：Vite 默认会 Tree-Shaking，确保在 `vite.config.ts` 中不排除 GSAP：
   ```typescript
   export default defineConfig({
     optimizeDeps: {
       exclude: ['gsap']
     }
   });
   ```
2. **按需加载插件**：仅引入需要的插件以减少体积。
3. **学习资源**：
    - 官方文档：[GSAP Docs](https://greensock.com/docs/)
    - 中文教程：[GSAP 入门指南](https://www.zhangxinxu.com/wordpress/?p=9840)

通过上述步骤，你可以在 Vue3 + TypeScript + Vite 中高效使用 GSAP 实现复杂的动画效果。


# 使用示例

好的，我现在需要帮助用户在Vue3 + TypeScript + Vite项目中实现一些常用动画，比如抽屉、下拉菜单、侧边栏菜单，使用GSAP。首先，我得确认用户的环境和需求。他们使用的是Vue3，所以需要考虑组合式API，可能用<script setup>语法。TypeScript的话，要注意类型声明。Vite作为构建工具，安装依赖应该没问题。

首先，用户可能需要先安装GSAP。虽然GSAP可以通过CDN引入，但在Vite项目中，更推荐使用npm安装。所以第一步应该是运行npm install gsap。然后，在需要的组件中导入GSAP，可能需要导入gsap核心和需要的插件，比如ScrollTrigger，但用户提到的动画可能不需要插件，基础功能足够。

接下来，考虑抽屉动画。抽屉通常是从一侧滑入滑出，可能需要transform或width/height的变化。使用GSAP的to方法，设置x或y属性，或者使用scale。需要注意在Vue中，可能需要使用ref来获取DOM元素，确保动画在元素挂载后执行，所以要在onMounted生命周期钩子中处理，或者在模板引用绑定后。

下拉菜单的话，可能需要高度变化或者opacity的变化。比如，点击按钮后，菜单展开，高度从0到auto，或者淡入。但GSAP处理height: auto可能有问题，可以考虑使用fromTo方法，或者使用scaleY，配合transformOrigin。或者使用opacity和display属性，但可能需要结合Vue的v-if或v-show指令，控制元素的显示隐藏，再触发动画。

侧边栏菜单可能类似于抽屉，但可能从左侧或右侧滑入。同样使用transform的x属性，设置初始位置为负的宽度，然后滑动到0。需要注意关闭时反向动画，或者使用reverse方法。

在Vue中，可能需要将动画逻辑封装到函数中，通过事件触发，比如点击按钮时调用toggle函数，控制动画的播放和反向。同时，可能需要使用ref来存储GSAP的动画实例，方便后续控制。

另外，考虑到TypeScript，需要为DOM元素指定类型，比如使用HTMLDivElement或HTMLElement。在模板中使用ref时，需要声明对应的变量类型，避免类型错误。

还有，Vite的热更新可能会影响动画的测试，需要确保元素正确渲染后再执行动画，可能需要在onMounted或nextTick中初始化动画。

可能的代码结构：在组件中导入gsap，定义需要的ref变量，在setup函数或<script setup>中编写动画函数，绑定到按钮的点击事件。使用v-show或v-if控制元素的显示，结合动画的onComplete回调来切换状态，或者在动画完成后手动更新状态。

需要注意GSAP的动画时间线管理，避免多个动画冲突。比如，使用一个timeline来控制多个动画序列，或者为每个元素创建独立的动画实例。

最后，测试各种动画的流畅度和兼容性，确保在不同浏览器下表现一致。可能需要使用will-change属性优化性能，或者requestAnimationFrame，但GSAP本身已经处理了这些优化。

总结步骤：
1. 安装GSAP。
2. 在组件中导入gsap。
3. 使用ref获取DOM元素。
4. 在onMounted中或事件处理函数中定义动画。
5. 通过事件触发动画，使用to/from方法，设置duration和ease。
6. 处理动画完成后的状态，比如隐藏元素。
7. 考虑TypeScript类型声明。
8. 测试动画效果和交互。




在 Vue3 + TypeScript + Vite 项目中使用 GSAP 实现常见动画效果的完整示例：

```bash
npm install gsap
```

### 一、抽屉动画 (Drawer)
```vue
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
```

### 二、下拉菜单 (Dropdown)
```vue
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
```

### 三、侧边栏菜单 (Sidebar)
```vue
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
```

### 关键实现要点：
1. **动画初始化**：使用 `gsap.timeline()` 或 `gsap.to()` 创建可控制的动画实例
2. **状态管理**：通过 `paused: true` 初始化暂停状态，后续通过 `play()`/`reverse()` 控制
3. **性能优化**：
   - 使用 transform 属性而不是直接修改位置属性
   - 对固定定位元素使用 will-change: transform
4. **交互增强**：
   - 下拉菜单使用 height + opacity 组合动画
   - 侧边栏添加遮罩层点击关闭功能
5. **响应式处理**：
   - 使用 Vue 的 ref 绑定 DOM 元素
   - 通过响应式状态管理动画状态

可以根据具体需求调整 easing 函数（推荐使用 `power1`-`power4` 或 `elastic` 等预设缓动）和动画时长，GSAP 的 Ease Visualizer 工具可帮助选择最佳缓动效果。