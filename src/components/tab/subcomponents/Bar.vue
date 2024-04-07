<template>
  <div id="bar" ref="bar"></div>
</template>

<script>
import * as echarts from "echarts";
import $ from 'jquery';
export default {
  name: "Bar",
  props: {
    title_text: {
      type: String,
      default: "柱状图",
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
      var chartDom = document.getElementById('bar');
      var myChart = echarts.init(chartDom);
      var option;

      myChart.showLoading();


      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['DQN', 'SVM', 'KNN']
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次数',
            min: 0,
            max: 15,
            interval: 1,
            axisLabel: {
              formatter: '{value}'
            }
          }
          ,
          {
            type: 'value',
            name: '次数',
            min: 0,
            max: 15,
            interval: 5,
            axisLabel: {
              formatter: '{value} 次'
            }
          }
        ],
        series: [
          {
            name: 'DQN',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 次';
              }
            },
            data: [
              2, 3, 7, 2, 5, 6, 3, 12
            ]
          },
          {
            name: 'SVM',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 次';
              }
            },
            data: [
              1, 3, 4, 2, 1, 3, 12, 1
            ]
          },
          {
            name: 'KNN',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 次';
              }
            },
            data: [2, 2, 3, 5, 3, 12, 2, 4]
          }
        ]
      };
      option && myChart.setOption(option);
      myChart.hideLoading();
    },
  },
};
</script>

<style scoped>
#sprit {
  width: 100%;
  height: 100%;
}
</style>
