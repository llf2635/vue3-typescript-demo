在 Vue3 + TypeScript + Vite 中使用 ECharts 并实现按需引入，可以通过 `vue-echarts`（专为 Vue3 封装的 ECharts 组件）结合 ECharts 的模块化引入来实现。以下是详细步骤：

---

### 步骤 1：安装依赖
```bash
bun add echarts vue-echarts
# 安装 ECharts 核心类型（如果 echarts 未自带类型）
npm install @types/echarts --save-dev
```

---

### 步骤 2：按需引入 ECharts 模块
#### 1. 创建 `src/utils/echarts.ts` 文件
用于集中管理按需引入的 ECharts 模块：
```typescript
// src/utils/echarts.ts
import * as echarts from 'echarts/core'

// 按需引入图表类型
import {
  BarChart,
  LineChart,
  PieChart,
  // 添加其他需要的图表类型...
} from 'echarts/charts'

// 按需引入组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  // 添加其他需要的组件...
} from 'echarts/components'

// 引入 Canvas 渲染器（必须）
import { CanvasRenderer } from 'echarts/renderers'

// 注册必需的组件和渲染器
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
])

export default echarts
```

---

### 步骤 3：配置 Vite 优化 Tree Shaking
在 `vite.config.ts` 中添加 ECharts 的按需优化：
```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers'],
  },
})
```

---

### 步骤 4：创建 Vue 组件
#### 1. 创建 `src/components/Chart.vue`
```vue
<template>
  <VChart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { VChart } from 'vue-echarts'
import { ref } from 'vue'
import echarts from '@/utils/echarts' // 导入按需配置后的 echarts

// 定义图表配置项（TypeScript 类型推断）
const option = ref<echarts.EChartsOption>({
  title: {
    text: '示例图表',
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar', // 对应已注册的 BarChart
      data: [120, 200, 150, 80, 70, 110, 130],
    },
    {
      type: 'line', // 对应已注册的 LineChart
      data: [80, 150, 100, 200, 90, 160, 180],
    },
  ],
})
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
```

---

### 步骤 5：全局注册组件（可选）
在 `src/main.ts` 中全局注册 `VChart`：
```typescript
// src/main.ts
import { createApp } from 'vue'
import { VChart } from 'vue-echarts'
import App from './App.vue'

const app = createApp(App)
app.component('VChart', VChart)
app.mount('#app')
```

---

### 步骤 6：在父组件中使用
```vue
<template>
  <Chart />
</template>

<script setup lang="ts">
import Chart from '@/components/Chart.vue'
</script>
```

---

### 关键优化说明
1. **按需引入模块**  
   通过 `echarts/core` 和 `echarts/charts` 等路径，仅引入实际需要的图表和组件，大幅减少打包体积。例如：
   ```typescript
   // 只引入柱状图和折线图
   import { BarChart, LineChart } from 'echarts/charts'
   ```

2. **Tree Shaking 配置**  
   Vite 的 `optimizeDeps.include` 确保 ECharts 相关模块在预构建阶段被正确处理。

3. **类型安全**  
   `echarts.EChartsOption` 类型确保配置项符合 ECharts 的类型定义，避免低级错误。

---

### 扩展：动态注册图表类型
如果需要动态切换图表类型（如根据用户选择加载不同图表），可以使用异步加载：
```typescript
// 在组件中动态加载模块
const loadScatterChart = async () => {
  const { ScatterChart } = await import('echarts/charts')
  echarts.use([ScatterChart])
}
```

---

### 最终效果
- 打包体积优化：仅包含已注册的图表和组件（例如引入柱状图 + 折线图时，构建产物比全量引入减少约 70%）。
- 类型安全：TypeScript 提供完整的类型提示和校验。
- 代码简洁：通过 `vue-echarts` 组件化调用，维护更便捷。

---

通过这种方式，你可以在 Vue3 + TypeScript + Vite 项目中高效、优雅地集成 ECharts，并享受按需引入带来的性能优势。