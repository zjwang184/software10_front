<template>
  <div>
    <el-page-header
      @back="goBack"
      content="任务详情页面"
      class="custom-page-header"
    ></el-page-header>
    <div class="taskBox1">
      <span style="font-size: 40px; margin-bottom: 20px">任务信息：</span
      ><span></span><span></span><span></span>
      <div class="taskInfoBox_taskname">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务名称：</span>
        <span>{{ this.taskData.taskname }}</span>
      </div>
      <div class="taskInfoBox_principal">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务负责人：</span>
        <span>{{ this.taskData.leader }}</span>
      </div>
      <div class="taskInfoBox_participants">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">参与人：</span>
        <span>{{ this.taskData.participant }}</span>
      </div>
      <div class="taskInfoBox_comment">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务备注：</span>
      </div>
      <div class="taskInfoBox_disease">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">研究病种：</span>
        <span>{{ this.taskData.disease }}</span>
      </div>
      <div class="taskInfoBox dataset">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">所用数据：</span>
        <span>{{ this.taskData.dataset }}</span>
      </div>
      <div class="taskInfoBox algorithm">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">所用算法：</span>
        <span>{{ this.taskData.modelname }}</span>
      </div>
      <div class="taskInfoBox use_features">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">所用特征：</span>
        <span>{{ featureString }}</span>
      </div>
    </div>

    <div class="taskBox2">
      <div style="font-size: 40px; margin-bottom: 20px"
        >{{ this.taskData.modelname }}模型信息：</div
      ><div></div><div></div><div></div>

      <div>
        <span class="lineStyle">▍</span
        ><span class="featureTitle">精确率acc：</span>
        <span>{{ transTOPercent(this.taskData.accuracy) }}</span>
      </div>
      <div>
        <span class="lineStyle">▍</span
        ><span class="featureTitle">准确率precision：</span>
        <span>{{ transTOPercent(this.taskData.precision) }}</span>
      </div>
      <div class="taskInfoBox algorithm">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">召回率recall：</span>
        <span>{{ transTOPercent(this.taskData.recall) }}</span>
      </div>
      <div class="taskInfoBox use_features">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">f1-score：</span>
        <span>{{ transTOPercent(this.taskData.f1) }}</span>
      </div>
      <div class="taskInfoBox result">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务结果：</span>
      </div>
      <div></div>
      <div></div>
      <div></div>

      <!-------------------------- loss曲线图和reward曲线图 ----------------------------->
      <div class="graphBox" v-if="this.taskData.totalrewards && this.taskData.totallosses">
        <div>
          <RewardCurve :rewardData="rewardData" />
        </div>
        <div>
          <LossCurve :lossData="lossData" />
        </div>
      </div>

      <!--------------------------- 特征饼图和混淆矩阵 ------------------------------------>
      <div class="graphBox">
        <featuresPie :data="transToPie(this.taskData.avgshapvalue)"></featuresPie>
        <treeMap
          :TP="transTONumber(this.taskData.tp)"
          :FN="transTONumber(this.taskData.fn)"
          :FP="transTONumber(this.taskData.fp)"
          :TN="transTONumber(this.taskData.tn)"
        ></treeMap> 
      </div>
    </div>
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
    result: Object, // 声明 result 属性为对象类型
  },
  computed: {
    featureString() {
      if (this.taskData && this.taskData.feature) {
        return this.taskData.feature.toString();
      } else {
        return "";
      }
    },
  },

  created() {
    this.init();
  },
  data() {
    return {
      taskData: Object,
      rewardData: [],
      lossData: [],
    };
  },

  methods: {
    init() {
      // 从路由参数中获取 result 数据
      this.result = this.$route.query.result;
      this.taskData = this.result;
      console.log("this.taskData",this.taskData);
      this.init_reward_and_loss();
    },
    goBack() {
      this.$router.push("/sideBar/TaskManage");
    },
    transTOPercent(rate) {
      return (parseFloat(rate) * 100).toFixed(2) + "%";
    },
    init_reward_and_loss() {
      // 使用正则表达式匹配每个子数组中的数字和字符串，并构建二维数组
      const regex = /\['([^']*)',(-?\d+\.?\d+)\]/g;
      let reward_match;
      let loss_match;
      while ((reward_match = regex.exec(this.taskData.totalrewards)) !== null) {
        this.rewardData.push([reward_match[1], parseFloat(reward_match[2])]);
      }
      while ((loss_match = regex.exec(this.taskData.totallosses)) !== null) {
        this.lossData.push([loss_match[1], parseFloat(loss_match[2])]);
      }
      // console.log("this.rewardData", this.rewardData);
      // console.log("this.lossData", this.lossData);
    },
    transTONumber(confusion){
      return parseInt(confusion);
    },
    transToPie(shapeValueStr){
      console.log("shapeValueStr", shapeValueStr);
      // 将字符串按逗号分割成对象数组
      const objectArray = shapeValueStr.split('},{').map(item => {
        // 去除大括号，然后按照键值对分割
        const keyValuePairs = item.replace(/[{}]/g, '').split(',');
        // console.log()
        // 构建对象
        const obj = {};
        keyValuePairs.forEach(pair => {
          const [key, value] = pair.split(':');
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === "value"){
            obj[trimmedKey] = parseFloat(trimmedValue)
          }else{
            obj[trimmedKey] = trimmedValue;
          }

          // // 如果值是数值，则转换为浮点数，否则保持为字符串
          // obj[trimmedKey] = !isNaN(parseFloat(trimmedValue)) ? parseFloat(trimmedValue) : trimmedValue;
        });
        return obj;
      });

    // 构建期望的 data 数组
    const dataArray = objectArray.map(obj => {
      return { value: obj.value, name: obj.name };
    });

      // 返回转换后的数据
      console.log("dataArray", dataArray)
      return dataArray;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 20px;
  width: 95%;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
  background: rgba(118, 118, 118, 0.1);
}

.taskBox2 div:nth-child(n+13):nth-child(-n+16) {
  grid-column: span 4; /* 合并第 13 到第 16 个 div 为 4 列 */
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

.graphBox {
  display: flex; /* 使用 flex 布局 */
  width: 90%; /* 设置宽度 */
  height: 400px; /* 设置高度 */
  padding: 20px; /* 设置内边距 */
  background-color: #ffffff; /* 设置背景颜色为白色 */
  border-radius: 10px; /* 设置圆角半径 */
  border: 1px solid #ccc; /* 设置边框 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 设置阴影效果 */
  margin-bottom: 30px;
  margin-left: 60px;
  margin-top: 10px;
}

.graphBox > div {
  flex: 1; /* 子元素平均占据可用空间 */
}
</style>
