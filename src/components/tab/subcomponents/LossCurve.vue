<template>
  <div
    id="LossCurve"
    ref="LossCurve"
    style="width: 100%; height: 400px"
  ></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "LossCurve",
  props: {
    title_text: {
      type: String,
      default: "LossCurve",
    },
    data: {
      type: Object,
      default: () => {},
    },
    lossData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.initMyChart();
  },

  methods: {
    initMyChart() {
      var chartDom = this.$refs.LossCurve;
      var myChart = echarts.init(chartDom);
      var option;

      const data = this.lossData;
      const dateList = data.map((item) => item[0]);
      const valueList = data.map((item) => item[1]);
      
      option = {
        visualMap: [
          { show: false, type: "continuous", seriesIndex: 0, min: 0, max: 400 },
          {
            show: false,
            type: "continuous",
            seriesIndex: 1,
            dimension: 0,
            min: 0,
            max: dateList.length - 1,
          },
        ],
        title: [{ left: "center", text: "Loss Curve" }],
        tooltip: { trigger: "axis" },
        xAxis: [{ data: dateList }, { data: dateList, gridIndex: 1 }],
        yAxis: [{}, { gridIndex: 1 }],
        grid: [{}, { top: "100%" }],
        series: [{ type: "line", showSymbol: false, data: valueList }],
      };
      option && myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
</style>

