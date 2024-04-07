<template>
  <div id="lineChart" ref="lineChart" ></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    legend:{
      type: Array,
      default: () => {},
    },
    statistic: {
      type: Array,
      default: () => {},
    },
    x: {
      type: Array,
      default: () => {},
    },
  },
  watch:{
    statistic(){
      this.initMyChart();
    }
  },
  data() {
    return {
      myChart:''
    };
  },

  mounted() {
    this.initMyChart();
  },

  methods: {
    initMyChart() {
      var chartDom = this.$refs.lineChart;
      if(!this.myChart){
        this.myChart = echarts.init(chartDom);
      }
      var option;

      option = {
        legend: {
          data: this.legend,
        },
        // grid: {
        //   left: "2%",
        //   right: "4%",
        //   bottom: "10%",
        //   top: "10%",
        //   containLabel: true,
        // },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          // data: this.x,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: "value",
        },
        // series: this.statistic,
        series: [
            {
              data: [1, 2, 0, 7, 8, 12, 3],
              type: 'line',
              smooth: true
            }
          ]
      };

      option && this.myChart.setOption(option,true);
    },
  },
};
</script>

<style scoped>
#lineChart {
  width: 100%;
  height: 100%;
}
</style>
