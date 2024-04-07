<template>
  <div id="pie" ref="pie"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Pie",
  props: {
    title_text: {
      type: String,
      default: "饼图",
    },
    data: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {

    };
  },
  created() {


  },
  mounted() {
    this.initMyChart();
  },

  methods: {
    initMyChart() {
      var chartDom = this.$refs.pie;
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: '各疾病的数据集个数占比',
          // subtext: 'Fake Data',
          left: 'right'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '数据集个数',
            type: 'pie',
            radius: '50%',
            data: [
              
              { value: 1, name: '肺病' },
              { value: 1, name: '糖尿病' },
              { value: 5, name: '公共数据集' },
              { value: 1, name: '胃病' },
              // { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      option && myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
#pie {
  width: 100%;
  height: 100%;
}
</style>
