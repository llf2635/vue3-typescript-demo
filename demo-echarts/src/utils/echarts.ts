// 集中管理按需引入的 ECharts 模块
// 采用在 TypeScript 中按需引入 ECharts 图表和组件的方式，参考 ECharts 官网 https://echarts.apache.org/handbook/zh/basics/import#%E5%9C%A8-typescript-%E4%B8%AD%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
import type {ComposeOption} from 'echarts/core';

// 按需引入图表类型，图表后缀都为 Chart
import {
    LineChart,  // 折线图
    BarChart,   // 柱状图
    PieChart,   // 饼状图
    RadarChart, // 雷达图
    // 添加其他需要的图表类型...
} from 'echarts/charts'
// 如果当前文件只有一个 ECharts 则可以自己选择一个，例如： 折线图-LineSeriesOption / 饼状图-BarSeriesOption
// 系列类型的定义后缀都为 SeriesOption
import type {
    LineSeriesOption,
    BarSeriesOption,
    PieSeriesOption,
    RadarSeriesOption
    // 添加其他需要的图表类型...
} from 'echarts/charts';

// 按需引入图表功能组件
import {
    TitleComponent,     // 标题组件
    TooltipComponent,   // 提示框组件
    GridComponent,      // 网格组件
    LegendComponent,    // 图例组件
    // 数据集组件
    DatasetComponent,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent
    // 添加其他需要的组件...
} from 'echarts/components'
// 按需引入图表功能组件类型，也就是 option 中可配置项目。组件类型的定义后缀都为 ComponentOption
import type {
    TitleComponentOption,
    TooltipComponentOption,
    GridComponentOption,
    DatasetComponentOption
} from 'echarts/components';

// 按需引入特性模块。标签自动布局、全局过渡动画等特性
import {LabelLayout, UniversalTransition} from 'echarts/features';
// 引入 Canvas 渲染器（必须）注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {CanvasRenderer} from 'echarts/renderers'

// 导出组合类型（使用 ComposeOption）
export type EChartsOption = ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
    | LineSeriesOption
    | BarSeriesOption
    | PieSeriesOption
    | RadarSeriesOption
    // 添加其他组件类型...
>;

// 注册必须的模块
echarts.use([
    // 图表类型
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    // 图表功能组件
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    // 图表类外围配置
    LabelLayout,
    UniversalTransition,
    // 图表渲染器
    CanvasRenderer,
])

export default echarts