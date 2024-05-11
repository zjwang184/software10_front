<template>
    <div ref="PredictLineChart" style="width: 100%; height: 400px"></div>
  </template>
  
  <script>
  import * as echarts from "echarts";
  
  export default {
    name: "PredictLineChart",
    props: {
      dataUrl: {
        type: String,
        required: true,
        default:
          "https://echarts.apache.org/examples/data/asset/data/life-expectancy-table.json",
      },
      titleText: {
        type: String,
        default: "Income of Germany and France since 1950",
      },
    },
    data() {
      return {
        rawData: null, // Define rawData variable
      };
    },
    mounted() {
      this.initChart();
    },
    methods: {
      initChart() {
        const chartDom = this.$refs.PredictLineChart;
        const myChart = echarts.init(chartDom);
  
        // Use axios or fetch to get data asynchronously
        // For simplicity, using jQuery $.get here
        $.get(this.dataUrl, (_rawData) => {
          this.rawData = _rawData; // Assign _rawData to rawData variable
          this.runChart(myChart);
        });
      },
      runChart(myChart) {
        const option = {
          dataset: [
            {
              id: "dataset_raw",
              source: this.rawData, // Use rawData variable
            },
            {
              id: "dataset_since_1950_of_germany",
              fromDatasetId: "dataset_raw",
              transform: {
                type: "filter",
                config: {
                  and: [
                    { dimension: "Year", gte: 1950 },
                    { dimension: "Country", "=": "Germany" },
                  ],
                },
              },
            },
            {
              id: "dataset_since_1950_of_france",
              fromDatasetId: "dataset_raw",
              transform: {
                type: "filter",
                config: {
                  and: [
                    { dimension: "Year", gte: 1950 },
                    { dimension: "Country", "=": "France" },
                  ],
                },
              },
            },
          ],
          title: {
            text: this.titleText,
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            nameLocation: "middle",
          },
          yAxis: {
            name: "Income",
          },
          series: [
            {
              type: "line",
              datasetId: "dataset_since_1950_of_germany",
              showSymbol: false,
              encode: {
                x: "Year",
                y: "Income",
                itemName: "Year",
                tooltip: ["Income"],
              },
            },
            {
              type: "line",
              datasetId: "dataset_since_1950_of_france",
              showSymbol: false,
              encode: {
                x: "Year",
                y: "Income",
                itemName: "Year",
                tooltip: ["Income"],
              },
            },
          ],
        };
  
        myChart.setOption(option); // Set the option to the chart
      },
    },
  };
  </script>
  
  <style scoped>
  /* Your component's styles */
  </style>
  
  