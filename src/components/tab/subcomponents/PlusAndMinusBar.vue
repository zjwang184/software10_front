<template>
    <div ref="barChart" style="width: 100%; height: 100%;"></div>
  </template>
  
  <script>
  // 引入 ECharts
  import * as echarts from 'echarts';
  
  export default {
    mounted() {
      // 在 mounted 钩子函数中初始化图表
      this.initChart();
    },
    methods: {
      initChart() {
        // 获取柱状图容器
        const chartContainer = this.$refs.barChart;
        // 初始化 ECharts 实例
        const myChart = echarts.init(chartContainer);
  
        // 柱状图配置项
        const option = {
          title: {
            text: '各特征对结果的影响',
            textStyle: { // 标题文本样式
              fontSize: 30, // 字体大小为 24 像素
              fontWeight: 'bold' // 字体加粗
            }
          },
          yAxis: {
            type: 'category',
            data: ['A', 'B', 'C', 'D', 'E'] // Y 轴数据
          },
          xAxis: {
            type: 'value', // X 轴类型为数值轴
            axisLine: { // 设置 X 轴颜色
              lineStyle: {
                color: 'red' // 正轴颜色为红色
              }
            }
          },
          series: [{
            name: '数据',
            type: 'bar', // 设置为横向柱状图
            data: [
              { value: 10, itemStyle: { color: 'red' } }, // 正值为红色
              { value: -20, itemStyle: { color: 'blue' } }, // 负值为蓝色
              { value: 30, itemStyle: { color: 'red' } },
              { value: -40, itemStyle: { color: 'blue' } },
              { value: 50, itemStyle: { color: 'red' } }
            ]
          }]
        };
  
        // 使用配置项绘制图表
        myChart.setOption(option);
      }
    }
  };
  </script>
  
  <style>
  /* 可选的样式 */
  </style>
  
  
  