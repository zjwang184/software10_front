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
      default: "Reward Curve",
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
        legend: {
          data: ["Reward"], // 添加图例
          align: "right", // 图例的位置
          top: 20, // 图例距离容器顶部的距离
        },
        title: [{ left: "center", text: this.title_text }], // 使用组件的标题属性作为图表的标题
        tooltip: { trigger: "axis" },
        xAxis: [
          {
            type: "category", // 横坐标类型为类目轴
            data: dateList, // 设置横坐标数据
            name: "迭代次数", // 设置横坐标名称
            nameTextStyle: {
              // 设置横坐标名称的样式
              fontSize: 14,
              fontWeight: "bold",
            },
          },
        ],
        yAxis: [
          {
            type: "value", // 纵坐标类型为数值轴
            name: "奖励值", // 设置纵坐标名称
            nameTextStyle: {
              // 设置纵坐标名称的样式
              fontSize: 14,
              fontWeight: "bold",
            },
          },
        ],
        series: [
          {
            name: "Reward", // 设置系列的名称，用于图例显示
            type: "line",
            showSymbol: false,
            data: valueList,
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
</style>
