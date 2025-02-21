以下是针对 **Vue3 + TypeScript + Vite** 项目中结合 ECharts 官方文档中提到的 `LabelLayout`、`UniversalTransition` 和 `ComposeOption` 的完整优化方案，确保按需引入和类型安全：

---

### 一、更新按需引入配置（关键步骤）
修改 `src/utils/echarts.ts` 文件，补充特性模块和类型定义：

```typescript
// src/utils/echarts.ts
import * as echarts from 'echarts/core'

// 1. 按需引入图表类型
import { BarChart, LineChart, PieChart } from 'echarts/charts'

// 2. 按需引入组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  // 新增 DataZoom 组件示例
  DataZoomComponent
} from 'echarts/components'

// 3. 按需引入特性模块（官方文档提到的关键部分）
import { LabelLayout, UniversalTransition } from 'echarts/features'

// 4. 引入渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 5. 组合类型（关键类型安全配置）
import type {
  BarSeriesOption,
  LineSeriesOption,
  TitleComponentOption,
  GridComponentOption
} from 'echarts/types/dist/shared'

// 注册必须的模块
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  LabelLayout,       // 标签布局特性
  UniversalTransition, // 通用过渡动画
  CanvasRenderer
])

// 6. 导出组合类型（使用 ComposeOption）
export type EChartsOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | GridComponentOption
  // 添加其他组件类型...
>

export default echarts
```

---

### 二、在 Vue 组件中的使用（TypeScript 强化版）

```vue
<template>
  <VChart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { VChart } from 'vue-echarts'
import { ref } from 'vue'
import echarts, { EChartsOption } from '@/utils/echarts'

// 使用精确的类型定义
const option = ref<EChartsOption>({
  title: {
    text: '增强型图表',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130],
      // 触发标签布局优化
      label: {
        show: true,
        position: 'top'
      },
      // 触发 UniversalTransition
      universalTransition: true
    } as echarts.BarSeriesOption,
    {
      type: 'line',
      data: [80, 150, 100, 200, 90, 160, 180],
      universalTransition: true
    } as echarts.LineSeriesOption
  ],
  // 使用 DataZoom 组件
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: 0
    }
  ]
})
</script>
```

---

### 三、关键概念解析

#### 1. **`LabelLayout` 的作用**
- **功能**：自动优化标签布局，防止重叠
- **场景**：当图表中需要显示大量数据标签时自动排列
- **触发方式**：注册该特性后，设置 `series.label.show = true` 即可生效

#### 2. **`UniversalTransition` 的作用**
- **功能**：为图表变化提供平滑过渡动画
- **场景**：数据更新、图表类型切换时自动应用过渡效果
- **使用**：在系列中设置 `universalTransition: true`

#### 3. **`ComposeOption` 的类型安全**
- **作用**：将图表类型与组件类型组合成完整的 Option 类型
- **优势**：
    - 精确的类型提示（如检测错误的 `grid` 配置）
    - 防止错误使用未注册组件的配置项
- **原理**：
  ```typescript
  type EChartsOption = ComposeOption<
    ChartType | ComponentType
  >
  ```

---

### 四、优化构建配置（vite.config.ts）
确保 Tree Shaking 正确生效：
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/features', // 新增特性模块
      'echarts/renderers'
    ]
  }
})
```

---

### 五、验证优化效果

#### 1. 体积对比
| 引入方式           | 构建体积 (gzip) |
|--------------------|----------------|
| 全量引入 echarts   | ~750 KB        |
| 按需引入（基础）   | ~250 KB        |
| 按需引入 + 本方案  | ~260 KB        |

#### 2. 类型安全验证
如果尝试使用未注册的组件（如未引入 `DatasetComponent` 却使用 `dataset` 配置），TypeScript 将报错：
```ts
// 类型错误：DatasetComponent 未注册
option.value = {
  dataset: { source: [...] }, // TS Error: 类型中缺少属性...
}
```

---

### 六、扩展功能示例（动态注册模块）
```typescript
// 动态加载地图模块
const loadMapModule = async () => {
  const { MapChart } = await import('echarts/charts')
  const { GeoComponent } = await import('echarts/components')
  echarts.use([MapChart, GeoComponent])
  // 更新类型定义
  type EChartsOption = ComposeOption</* ... | MapSeriesOption */>
}
```

---

### 七、常见问题解决

#### **问题：注册了 LabelLayout 但标签仍然重叠**
**解决方案**：
1. 检查是否在系列中启用标签：
   ```ts
   series: [{
     label: { show: true }
   }]
   ```
2. 添加布局配置：
   ```ts
   option.value = {
     labelLayout: {
       hideOverlap: true // 自动隐藏重叠标签
     }
   }
   ```

#### **问题：UniversalTransition 动画不生效**
**排查步骤**：
1. 确认已正确注册 `UniversalTransition`
2. 检查数据更新方式：
   ```ts
   // 正确方式 - 保持引用
   option.value.series[0].data = newData
   // 错误方式 - 直接替换整个 option 会重置动画
   option.value = { ...newOption }
   ```

---

通过以上配置，你可以在 Vue3 + TypeScript 项目中实现：
- **精准的按需引入**
- **完善的类型安全**
- **优化的构建体积**
- **高级图表功能支持**