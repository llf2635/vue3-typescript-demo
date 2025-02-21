<script setup lang="ts">
// 仪表盘，示例来源 https://echarts.apache.org/examples/zh/index.html#chart-type-gauge
// 以下内容来自 Echarts 提供的 import code generator 生成的代码，采用的是 Canavs 实现。参考 https://vue-echarts.dev/?renderer=canvas#codegen

import {ref} from "vue";
import VChart from "vue-echarts";
import echarts from '..//utils/echarts' // 导入按需配置后的 echarts

// 这样我们只需要到 ECharts 仓库复制他提供的 option 到这里即可  https://echarts.apache.org/examples/zh/index.html
// 定义图表配置项（TypeScript 类型推断）
const option = ref<echarts.EChartsOption>(
    {
      series: [
        {
          type: 'gauge',
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: 'inherit',
            distance: 40,
            fontSize: 20
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} km/h',
            color: 'inherit'
          },
          data: [
            {
              value: 70
            }
          ]
        }
      ]
    }
)

setInterval(function () {
  myChart.setOption<echarts.EChartsOption>({
    series: [
      {
        data: [
          {
            value: +(Math.random() * 100).toFixed(2)
          }
        ]
      }
    ]
  });
}, 2000);
</script>

<template>
  <v-chart class="chart" :option="option" autoresize/>
</template>

<style scoped>
.chart {
  height: 400px;
}
</style>