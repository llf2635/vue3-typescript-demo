<script setup lang="ts">
// K 线图，示例来源 https://echarts.apache.org/examples/zh/index.html#chart-type-candlestick
// 以下内容来自 Echarts 提供的 import code generator 生成的代码，采用的是 Canavs 实现。参考 https://vue-echarts.dev/?renderer=canvas#codegen

import {ref} from "vue";
import VChart from "vue-echarts";
import echarts from '..//utils/echarts' // 导入按需配置后的 echarts

// 这样我们只需要到 ECharts 仓库复制他提供的 option 到这里即可  https://echarts.apache.org/examples/zh/index.html
// 定义图表配置项（TypeScript 类型推断）
const option = ref<echarts.EChartsOption>(

)


</script>

<template>
  <v-chart class="chart" :option="option" autoresize/>
</template>

<style scoped>
.chart {
  height: 400px;
}
</style>