<template>
  <div class="echarts-container">
    <line-chart></line-chart>
    <bar-chart></bar-chart>
  </div>
</template>

<script setup lang="ts">

import LineChart from "./components/LineChart.vue";
import BarChart from "./components/BarChart.vue";
</script>

<style scoped>
.echarts-container{
  width: 100%;
  height: 100%;
}
</style>