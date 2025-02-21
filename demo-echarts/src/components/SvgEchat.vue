<script setup lang="ts">
// 以下内容来自 Echarts 提供的 import code generator 生成的代码，采用的是 SVG 实现。参考 https://vue-echarts.dev/?renderer=canvas#codegen
// 按需引入 ECharts 图表和组件
// 以下内容参考 ECharts 在TypeScript中按需引入  https://echarts.apache.org/handbook/zh/basics/import#%E5%9C%A8-typescript-%E4%B8%AD%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
// 如果当前文件只有一个 Echart 则可以自己选择一个，例如： 折线图-LineChart / 饼状图-BarChart 等
import {
  LineChart
} from 'echarts/charts';
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import {LabelLayout, UniversalTransition} from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {SVGRenderer} from 'echarts/renderers';
// 如果当前文件只有一个 Echart 则可以自己选择一个，例如： 折线图-LineSeriesOption / 饼状图-BarSeriesOption
import type {
  // 系列类型的定义后缀都为 SeriesOption
  LineSeriesOption
} from 'echarts/charts';
// 按需导入当前 ECharts 需要的工具组件
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption
} from 'echarts/components';
import type {
  ComposeOption,
} from 'echarts/core';
import VChart from "vue-echarts";

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type EChartsOption = ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
    | LineSeriesOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
  LineChart,
]);


let base = +new Date(1968, 9, 3);
let oneDay = 24 * 3600 * 1000;
let date = [];

let data = [Math.random() * 300];

for (let i = 1; i < 20000; i++) {
  var now = new Date((base += oneDay));
  date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}

// 这样我们只需要到 ECharts 仓库复制他提供的 option 到这里即可  https://echarts.apache.org/examples/zh/index.html
const option: EChartsOption =
    {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'center',
        text: 'Large Area Chart'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
          data: data
        }
      ]
    };

</script>

<template>
  <v-chart class="chart" :option="option"/>
</template>

<style scoped>
.chart {
  width: 800px;
  height: 400px;
}
</style>
