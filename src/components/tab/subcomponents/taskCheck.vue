<template>
  <div>
    <el-page-header
      @back="goBack"
      content="详情页面"
      class="custom-page-header"
    ></el-page-header>
    <div class="taskBox1">
      <span style="font-size: 40px; margin-bottom: 20px">任务信息：</span
      ><span></span><span></span><span></span>
      <div class="taskInfoBox_taskname">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务名称：</span>
        <span>{{ result.taskname }}</span>
      </div>
      <div class="taskInfoBox_principal">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务负责人：</span>
        <span>{{ result.leader }}</span>
      </div>
      <div class="taskInfoBox_participants">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">参与人：</span>
        <span>{{ result.participant }}</span>
      </div>
      <div class="taskInfoBox_comment">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务备注：</span>
        <!-- <span>{{ result.taskname }}</span> -->
      </div>
      <div class="taskInfoBox_disease">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">研究病种：</span>
        <span>{{ result.disease }}</span>
      </div>
      <div class="taskInfoBox dataset">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">所用数据：</span>
        <span>{{ result.dataset }}</span>
      </div>
      <div class="taskInfoBox algorithm">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">所用算法：</span>
        <span>{{ result.modelname }}</span>
      </div>
      <div class="taskInfoBox use_features">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">所用特征：</span>
        <span>{{result.feature.toString()}}</span>
      </div>
    </div>

    <div class="taskBox2"></div>

    <!-- <div class="taskBox3" v-for="(item, index) in dqnModel" :key="index">
      <span style="font-size: 40px; margin-bottom: 20px"
        >{{ item.name }}模型信息：</span
      ><span></span><span></span><span></span>
      <div class="algorithm_info">
        <div class="taskInfoBox_disease">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">精确率acc：</span>
          <span>{{ transTOPercent(item.res.accuracy) }}</span>
        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">准确率precision：</span>
          <span>{{ transTOPercent(item.res.precision) }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">召回率recall：</span>
          <span>{{ transTOPercent(item.res.recall) }}</span>
        </div>
        <div class="taskInfoBox use_features">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">f1-score：</span>
          <span>{{ transTOPercent(item.res.f1) }}</span>
        </div>
      </div>
      <div class="taskInfoBox result">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务结果：</span>
      </div>
      <div class="graphBox">
        <div
          :id="'LossCurve_' + index"
          ref="LossCurve"
          style="width: 100%; height: 400px"
        ></div>
        <div
          :id="'RewardCurve_' + index"
          ref="RewardCurve"
          style="width: 100%; height: 400px"
        ></div>
      </div>
      <div class="graphBox">
        <featuresPie :data="transToPie(item.res.avg_shapvalue)"></featuresPie>
        <treeMap
          :TP="transTONumber(item.res.TP)"
          :FN="transTONumber(item.res.FN)"
          :FP="transTONumber(item.res.FP)"
          :TN="transTONumber(item.res.TN)"
        ></treeMap>
      </div>
    </div> -->
  </div>
</template>

<script>
import featuresPie from "@/components/tab/subcomponents/featuresPie.vue";
import GraphVue from "./Graph.vue";
import LossCurve from "@/components/tab/subcomponents/LossCurve.vue";
import RewardCurve from "@/components/tab/subcomponents/RewardCurve.vue";
import treeMap from "./treeMap.vue";
import PredictLineChart from "./PredictLineChart.vue";
export default {
  name: "taskCheck",
  components: {
    GraphVue,
    RewardCurve,
    LossCurve,
    featuresPie,
    treeMap,
    PredictLineChart,
  },
  props: {
    result: Object // 声明 result 属性为对象类型
  },
  // created() {
  //   this.init();
  // },
  mounted() {
    // 从路由参数中获取 result 数据
    this.result=this.$route.query.result;
    // this.result = JSON.parse(this.$route.query.result);
    console.log("Received result data:", this.result);
  },
  data() {
    return {
      
    };
  },

  methods: {
    init() {
      console.log("this.result", this.result);
    },
    goBack() {
      this.$router.push("/sideBar/TaskManage");
    },
  },
};
</script>

<style scoped>
.custom-page-header {
  padding: 20px;
}

.taskBox1 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 20px;
  width: 95%;
  height: auto;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4); /* 修正阴影的颜色和透明度 */
  background: rgba(118, 118, 118, 0.1);
}

.taskBox2 {
  margin-bottom: 20px;
  width: 95%;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4); /* 修正阴影的颜色和透明度 */
  background: rgba(118, 118, 118, 0.1);
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.featureTitle {
  font-size: 25px;
  margin-right: 30px;
  margin-bottom: 20px;
}
</style>
