<template>
  <div
    id="RewardCurve"
    ref="RewardCurve"
    style="width: 100%; height: 400px"
  ></div>
</template>
  
  <script>
import * as echarts from "echarts";

export default {
  name: "RewardCurve",
  props: {
    title_text: {
      type: String,
      default: "Result",
    },
    data: {
      type: Object,
      default: () => {},
    },
    rewardData: {
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
      var chartDom = this.$refs.RewardCurve;
      var myChart = echarts.init(chartDom);
      var option;

      const data = this.rewardData;
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
        title: [{ left: "center", text: "Reward Curve" }],
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