<template>
  <div>
    <div id="pdf_1">
      <div class="taskBox1">
        <span style="font-size: 40px; margin-bottom: 20px">任务信息：</span
        ><span></span><span></span><span></span>
        <div class="taskInfoBox_taskname">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">任务名称：</span>
          <span>{{ m_taskName }}</span>
        </div>
        <div class="taskInfoBox_principal">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">任务负责人：</span>
          <span>{{ m_principal }}</span>
        </div>
        <div class="taskInfoBox_participants">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">参与人：</span>
          <span>{{ m_participants }}</span>
        </div>
        <div class="taskInfoBox_comment">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">任务备注：</span>
          <span>{{ m_comment }}</span>
        </div>
       
        <div class="taskInfoBox_disease">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">研究病种：</span>
          <span>{{ m_disease }}</span>
        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用数据：</span>
          <span>{{ m_dataset }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用算法：</span>
          <span>{{ m_algorithm }}</span>
        </div>
        <div class="taskInfoBox use_features">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用特征：</span>
          <span>{{ m_use_features.toString() }}</span>
        </div>
        

        
      </div>
      
    </div>

    <div id="pdf_2" v-if="dqnModel.length > 0">
      <div class="taskBox3" 
      v-for="(item, index) in dqnModel"
      :key="index">
        <span style="font-size: 40px; margin-bottom: 20px">{{item.name}}模型信息：</span
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
      </div>
    </div>

    <div id="pdf_3" v-if="svmModel.length > 0">
      <div id="pdf_3"
        v-for="(item, index) in svmModel"
        :key="index"
        >
          <div class="taskBox3">
            <span style="font-size: 40px; margin-bottom: 20px">{{item.name}}模型信息：</span
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
              <featuresPie :data="transToPie(item.res.avg_shapvalue)"></featuresPie>
              <treeMap 
              :TP="transTONumber(item.res.TP)"
              :FN="transTONumber(item.res.FN)"
              :FP="transTONumber(item.res.FP)"
              :TN="transTONumber(item.res.TN)"
              ></treeMap>
            </div>
          </div>
      </div>
    </div>

    <div id="pdf_4" v-if="knnModel.length > 0">
      <div id="pdf_4"
      v-for="(item, index) in knnModel"
      :key="index"
      >
        <div class="taskBox3">
          <span style="font-size: 40px; margin-bottom: 20px">{{ item.name }}模型信息：</span
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
            <featuresPie :data="transToPie(item.res.avg_shapvalue)"></featuresPie>
            <treeMap 
            :TP="transTONumber(item.res.TP)"
            :FN="transTONumber(item.res.FN)"
            :FP="transTONumber(item.res.FP)"
            :TN="transTONumber(item.res.TN)"
            ></treeMap>
          </div>
        </div>
      </div>
    </div>

    <div class="buttonGroup">
      <el-button @click="backStep()" round>上一步</el-button>
      <!-- <el-button type="success" @click="exportRes()" round>导出结果</el-button> -->
      <el-button type="primary" @click="next()" round>保存任务</el-button>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import GraphVue from "./Graph.vue";
import LossCurve from "@/components/tab/subcomponents/LossCurve.vue";
import RewardCurve from "@/components/tab/subcomponents/RewardCurve.vue";
import Tree from "./Tree.vue";
import treeMap from "./treeMap.vue"

import { postRequest } from "@/api/user";
import { mapMutations } from "vuex";
import { time } from "echarts";

import featuresPie from "@/components/tab/subcomponents/featuresPie.vue";
import * as echarts from "echarts";
import PredictLineChart from './PredictLineChart.vue';

export default {
  name: "Result",
  mixins: [vuex_mixin],
  components: {
    GraphVue,
    RewardCurve,
    LossCurve,
    featuresPie,
    treeMap,
    PredictLineChart
  },
  props: {
    moduleName: {
      type: String,
      default: "modelTraining",
    },
  },
  computed: {
    
    dqnModel(){
      console.log("dqn result", this.m_models);
      // 根据条件筛选 editableTabs 数组
      const filteredModels = this.m_models.filter(item => ((item.name === 'dqn')&&(item.is_select === true)));
      console.log("dqnModel length:", filteredModels.length, filteredModels);
      if (filteredModels.length > 0) {
        return filteredModels;
      } else {
        // 如果数组为空，则返回一个空数组或者执行其他操作
        return [];
      }
    },
    svmModel(){
      
      // 根据条件筛选 editableTabs 数组
      const filteredModels = this.m_models.filter(item => ((item.name === 'svm')&&(item.is_select === true)));
      console.log("svmModel length:", filteredModels.length, filteredModels);
      if (filteredModels.length > 0) {
        return filteredModels;
      } else {
        // 如果数组为空，则返回一个空数组或者执行其他操作
        return [];
      }
    },
    knnModel(){
      // 根据条件筛选 editableTabs 数组
      const filteredModels = this.m_models.filter(item => ((item.name === 'knn')&&(item.is_select === true)));
      console.log("knnModel length:", filteredModels.length, filteredModels);
      if (filteredModels.length > 0) {
        return filteredModels;
      } else {
        // 如果数组为空，则返回一个空数组或者执行其他操作
        return [];
      }
    },

    filteredModels(){
      // 根据条件筛选 editableTabs 数组
      return this.m_models.filter(item => item.is_select);
    },

    ratio() {
      let num = (this.m_result.ratio * 100).toFixed(2);
      return num + "%";
    },
  },
  mounted(){
    console.log("this.m_models", this.m_models);

    this.init_reward_loss("reward");
    this.init_reward_loss("loss");
  },

  data() {
    return {
      initFlag: false,
      graphTitile: "",
      node: [],
      links: [],
      data: {},
      type: "",      
    };
  },

  created() {
    console.log("typeof XLSX",typeof XLSX);
    if (typeof XLSX === "undefined") {
      console.error("XLSX is not available.");
    } else {
      console.log("XLSX is available.");
    };
    console.log("console.log(this.m_models);", this.m_models);
    console.log("console.log(this.m_target_featuress);", this.m_target_features);
    console.log("this.m_result" + JSON.stringify(this.m_result.res));
    console.log("this.tree" + JSON.stringify(this.m_result.treeRes));
    // var treeData = {
    //   name: "结果统计",
    //   children: [],
    // };
    // let tempNode = {
    //   name: this.m_target_features[0],
    //   x: 300,
    //   y: 300,
    //   color: "#7B68EE",
    //   symbolSize: 65,
    // };
    // let tempLink = {
    //   source: "",
    //   target: "",
    //   value: 1,
    //   label: {
    //     show: true,
    //   },
    //   lineStyle: {
    //     width: 5,
    //     curveness: 0.2,
    //   },
    // };
    // let top_y = 200;
    // let bottom_y = 300;
    // switch (this.moduleName) {
    //   case "modelTraining": {
    //     tempNode.name = this.m_target_features[0];
    //     tempNode.x = 500;
    //     tempNode.y = bottom_y;
    //     tempNode.color = "#7B68EE";
    //     if (this.m_result.res.length < 1) {
    //       this.$message("未挖掘出相关关系");
    //       tempNode.x = 500;
    //       tempNode.y = 500;
    //       tempNode.color = "#c2b8fae1";
    //       break;
    //     }
    //     this.graphTitile = `${this.m_disease}相关危险因素`;
    //     this.node.push(JSON.parse(JSON.stringify(tempNode)));
    //     let ref_x = 1000 / (this.m_result.res[0].length + 1);
    //     for (let i = 0; i < this.m_result.res[0].length; i++) {
    //       tempNode.name = this.m_result.res[0][i];
    //       tempNode.x = ref_x * (i + 1);
    //       tempNode.y = top_y;
    //       tempNode.color = "#FFDEAD";
    //       this.node.push(JSON.parse(JSON.stringify(tempNode)));
    //       tempLink.source = this.m_target_features[0];
    //       tempLink.target = this.m_result.res[0][i];
    //       // 权重是随机数
    //       tempLink.value = Number(Math.random().toFixed(3));
    //       tempLink.lineStyle.width += tempLink.value * 2;
    //       this.links.push(JSON.parse(JSON.stringify(tempLink)));
    //     }

    //     var firstChildren = {
    //       name: String(Object.keys(this.m_result.treeRes)),
    //       children: [],
    //     };
    //     treeData.children.push(firstChildren);
    //     var secondChildrenList = Array.from(
    //       this.m_result.treeRes[firstChildren.name]
    //     );
    //     secondChildrenList.forEach((element) => {
    //       var secondChildren = { name: String(element), children: [] };
    //       treeData.children[0].children.push(secondChildren);
    //     });
    //     this.data = treeData;
    //     break;
    //   }

    //   case "f_Factor": {
    //     // 不能有重复的name，用map存储已有name进行去重
    //     let existedName = new Map();
    //     let ref_x_t = 1000 / (this.m_target_features.length + 1);
    //     for (let i = 0; i < this.m_target_features.length; i++) {
    //       tempNode.name = this.m_target_features[i];
    //       tempNode.x = ref_x_t * i;
    //       tempNode.y = bottom_y;
    //       if (
    //         this.m_result.res[i].length > 0 &&
    //         this.m_result.res[i].length <= 2
    //       ) {
    //         tempNode.color = "#7B68EE";
    //       } else if (this.m_result.res[i].length >= 3) {
    //         tempNode.color = "#000080";
    //       } else {
    //         tempNode.color = "#c2b8fae1";
    //       }
    //       this.node.push(JSON.parse(JSON.stringify(tempNode)));
    //       existedName.set(tempNode.name, 1);
    //     }
    //     // 检查结果二维数组中是否有值并统计总长度
    //     let resLength = 0;
    //     let ref_x_r = [];
    //     for (const item of this.m_result.res) {
    //       let tempLen = Number((ref_x_t / (item.length + 1)).toFixed(2));
    //       ref_x_r.push(tempLen);
    //       if (item.length > 0) {
    //         resLength += item.length;
    //       }
    //     }
    //     if (resLength == 0) {
    //       {
    //         this.$message("未挖掘出相关关系");
    //         break;
    //       }
    //     }

    //     this.graphTitile = `${this.m_disease}中部分危险因素间关联关系`;

    //     for (let i = 0; i < this.m_result.res.length; i++) {
    //       for (let j = 0; j < this.m_result.res[i].length; j++) {
    //         console.log(this.m_result.res[i][j], ref_x_r[i]);
    //         if (!existedName.has(this.m_result.res[i][j])) {
    //           tempNode.name = this.m_result.res[i][j];
    //           tempNode.x = ref_x_t * i + (ref_x_r[i] + 1) * j;
    //           tempNode.y = top_y;
    //           tempNode.color = "#FFDEAD";
    //           this.node.push(JSON.parse(JSON.stringify(tempNode)));
    //           existedName.set(tempNode.name, 1);
    //         }
    //         tempLink.source = this.m_target_features[i];
    //         tempLink.target = this.m_result.res[i][j];
    //         // 权重是随机数
    //         tempLink.value = Number(Math.random().toFixed(3));
    //         tempLink.lineStyle.width = 3 + tempLink.value * 8;
    //         this.links.push(JSON.parse(JSON.stringify(tempLink)));
    //       }
    //     }
    //     var resTreedata = this.m_result.treeRes;
    //     Object.entries(resTreedata).forEach(function ([key, value], index) {
    //       var firstChildren = { name: String(key), children: [] };
    //       treeData.children.push(firstChildren);
    //       var secondChildrenList = Array.from(value);
    //       secondChildrenList.forEach((element) => {
    //         var secondChildren = { name: String(element), children: [] };
    //         treeData.children[index].children.push(secondChildren);
    //       });
    //     });
    //     this.data = treeData;
    //     break;
    //   }
    //   case "factorDis": {
    //     // 不能有重复的name，用map存储已有name进行去重
    //     let existedName = new Map();
    //     let ref_x_t = 1000 / (this.m_target_features.length + 1);
    //     for (let i = 0; i < this.m_target_features.length; i++) {
    //       tempNode.name = this.m_target_features[i];
    //       tempNode.x = ref_x_t * i;
    //       tempNode.y = bottom_y;
    //       if (
    //         this.m_result.res[i].length > 0 &&
    //         this.m_result.res[i].length <= 2
    //       ) {
    //         tempNode.color = "#7B68EE";
    //       } else if (this.m_result.res[i].length >= 3) {
    //         tempNode.color = "#000080";
    //       } else {
    //         tempNode.color = "#c2b8fae1";
    //       }
    //       this.node.push(JSON.parse(JSON.stringify(tempNode)));
    //       existedName.set(tempNode.name, 1);
    //     }
    //     // 检查结果二维数组中是否有值并统计总长度
    //     let resLength = 0;
    //     let ref_x_r = [];
    //     for (const item of this.m_result.res) {
    //       let tempLen = Number((ref_x_t / (item.length + 1)).toFixed(2));
    //       ref_x_r.push(tempLen);
    //       if (item.length > 0) {
    //         resLength += item.length;
    //       }
    //     }
    //     if (resLength == 0) {
    //       {
    //         this.$message("未挖掘出相关关系");
    //         break;
    //       }
    //     }

    //     this.graphTitile = `${this.m_target_features[0]}因素相关疾病`;

    //     for (let i = 0; i < this.m_result.res.length; i++) {
    //       for (let j = 0; j < this.m_result.res[i].length; j++) {
    //         console.log(this.m_result.res[i][j], ref_x_r[i]);
    //         if (!existedName.has(this.m_result.res[i][j])) {
    //           tempNode.name = this.m_result.res[i][j];
    //           tempNode.x = ref_x_t * i + (ref_x_r[i] + 1) * j;
    //           tempNode.y = top_y;
    //           tempNode.color = "#FFDEAD";
    //           this.node.push(JSON.parse(JSON.stringify(tempNode)));
    //           existedName.set(tempNode.name, 1);
    //         }
    //         tempLink.source = this.m_target_features[i];
    //         tempLink.target = this.m_result.res[i][j];
    //         // 权重是随机数
    //         tempLink.value = Number(Math.random().toFixed(3));
    //         tempLink.lineStyle.width = 3 + tempLink.value * 8;
    //         this.links.push(JSON.parse(JSON.stringify(tempLink)));
    //       }
    //     }
    //     var resTreedata = this.m_result.treeRes;
    //     Object.entries(resTreedata).forEach(function ([key, value], index) {
    //       var firstChildren = { name: String(key), children: [] };
    //       treeData.children.push(firstChildren);
    //       var secondChildrenList = Array.from(value);
    //       secondChildrenList.forEach((element) => {
    //         var secondChildren = { name: String(element), children: [] };
    //         treeData.children[index].children.push(secondChildren);
    //       });
    //     });
    //     this.data = treeData;
    //     break;
    //   }
    //   default:
    //     break;
    // }
    this.initFlag = true;
  },

  methods: {
    ...mapMutations(["SetTaskList"]),
    transTONumber(confusion){
      return parseInt(confusion);
    },

    transTOPercent(rate){
      return (parseFloat(rate) * 100).toFixed(2) + "%";
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

    init_reward_loss(curve) {
      let model = {};
      for (var i = 0; i < this.m_models.length; i++) {
        if (this.m_models[i]["name"] === "dqn") {
          model = this.m_models[i];
          break;
        }
      }
      // 假设您的数据存储在 dqnModel 中，并且您希望遍历它们来初始化每个图表
      this.dqnModel.forEach((item, index) => {
        let str = "";
        let text = "Reward curve";
        let chartDom = this.$refs.RewardCurve[index];

        if (curve === "reward") {
          str = model.res.total_rewards;
          text = "Reward curve";
        } else if (curve === "loss") {
          str = model.res.total_losses;
          text = "Losses curve";
          chartDom = this.$refs.LossCurve[index];
        }

        console.log("当前curve:", curve, text, str);

        // 使用正则表达式匹配每个子数组中的数字和字符串，并构建二维数组
        const regex = /\['([^']*)',(-?\d+\.?\d+)\]/g;
        const result = [];
        let match;

        while ((match = regex.exec(str)) !== null) {
          result.push([match[1], parseFloat(match[2])]);
        }

        console.log("result:", result);
        const data = result;
        console.log("data", data);
        const dateList = data.map((item) => item[0]);
        const valueList = data.map((item) => item[1]);

        var myChart = echarts.init(chartDom);
        var option;

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
          title: [{ left: "center", text: text }],
          tooltip: { trigger: "axis" },
          xAxis: [{ data: dateList }, { data: dateList, gridIndex: 1 }],
          yAxis: [{}, { gridIndex: 1 }],
          grid: [{}, { top: "100%" }],
          series: [{ type: "line", showSymbol: false, data: valueList }],
        };
        option && myChart.setOption(option);
      });
    },

    next() {
      //上传任务
      let payload = {
        taskName: this.m_taskName,
        leader: this.m_principal,
        participant: this.m_participants,

        disease: this.m_disease,
        dataset: this.m_dataset,
        feature: this.m_use_features,
        targetcolumn: this.m_target_features[0].riskFactor,
        models: this.filteredModels,

        time: this.m_result?.time,
        uid: sessionStorage.getItem("userid") - 0,
      };

      console.log("上传：",payload);

      let alghName = "m_" + this.m_algorithm;
      let para = [];
      let paraValue = [];
      for (const key in this[alghName]) {
        if (Object.hasOwnProperty.call(this[alghName], key)) {
          console.log(this[alghName]);
          para.push(key);
          console.log(key);
          console.log(this[alghName][key]);
          paraValue.push(this[alghName][key]);
        }
      }
  
      postRequest("Task/save", payload)
        .then((res) => {
          // this.SetTaskList(res.reverse());
          this.$message({
            showClose: true,
            type: "success",
            message: "任务保存成功",
          });
          this.m_changeStep(1);
          this.m_reset_state();
          // let defaultValue = {
          //   step: 1,
          //   taskName: "",
          //   nodeid: "",
          //   principal: "",
          //   participants: "",
          //   disease: "",
          //   dataset: "",
          //   all_features: [],
          //   use_features: [],
          //   known_features: [],
          //   target_features: [],
          //   algorithm:'',
          //   SF_DRMB: {
          //     K_OR: 0.15,
          //     K_and_PC: 0.3,
          //     K_and_SP: 0.75,
          //   },

          //   models:[
          //     {
          //       name: "dqn",
          //       model_type: "dl",
          //       is_select: false,
          //       params:{
          //         reward: 1,
          //         epoch: 100,
          //         gamma: 0.8,
          //         learning_rate: 0.01,
          //       },
          //       res:{}
          //     },
          //     {
          //       name: "svm",
          //       model_type: "ml",
          //       is_select: false,
          //       params:{
          //         kernel: "linear",
          //         random_state: 42,     
          //         cv: 5,
          //       },
          //       res:{}
          //     },
          //     {
          //       name: "knn",
          //       model_type: "ml",
          //       is_select: false,
          //       params:{
          //         random_state: 42,     
          //         cv: 10,
          //         K: 3
          //       },
          //       res:{}
          //     }
          //   ],
          //   DQN: {
          //     reward: 1,
          //     epoch: 100,
          //     gamma: 0.8,
          //     learning_rate: 0.01,
          //   },
          //   SVM: {
          //     kernel: "linear",
          //     random_state: 42,     
          //     cv: 5,
          //   },
          //   KNN: {  
          //     random_state: 42,     
          //     cv: 10,
          //     K: 3
          //   },

          //   result: [],

          //   // 风险预测
          //   predict_features: [],
          //   patient_form:[],
          //   predict_task_name: [],
          //   predict_model_name: [],
          // };
          // // TODO:这个改不了深层参数，需要写一个深拷贝通用方法
          // this.m_changeTaskInfo(defaultValue);
        })
        .catch((err) => {
          console.log("+ err", err)
          this.$message({
            type: "error",
            message: "新建任务失败" ,
          });
          this.m_changeStep(this.m_step - 1);
          return false;
        });
    },
    
    exportExcel() {
      /* 从表生成工作簿对象 */
      this.type = "";
      setTimeout(() => {
        var wb = XLSX?.utils.table_to_book(
          document.querySelector("#out-table")
        );
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX?.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            `${this.m_taskName}-特征分布表格.xlsx`
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }, 1000);
    },

    async exportRes() {
      // this.exportExcel();
      const divsToExport = ["pdf_1", "pdf_2", "pdf_3", "pdf_4"];
      const pdf_positions = [
        { x: 5, y: 5 },
        { x: 5, y: 35 },
        { x: 5, y: 160 },
        { x: 5, y: 210 },
      ];
      const pdf = new jsPDF();

      const renderPromises = divsToExport.map((divId, index) => {
        const div = document.getElementById(divId);
        return html2canvas(div).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          const position = pdf_positions[index] || { x: 0, y: 0 };
          pdf.addImage(
            imgData,
            "PNG",
            position.x,
            position.y,
            pdfWidth,
            pdfHeight
          );
        });
      });

      await Promise.all(renderPromises);
      pdf.save(`${this.m_taskName}.pdf`);
    },

    backStep() {
      this.m_changeStep(4);
    },
  },
};
</script>

<style scoped>
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
  /* height: auto; */
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4); /* 修正阴影的颜色和透明度 */
  background: rgba(118, 118, 118, 0.1);
}

.taskBox2 div:last-child {
  grid-column: span 4; /* 合并4列 */
}

.taskBox3 {
  margin-bottom: 20px;
  width: 95%;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4); /* 修正阴影的颜色和透明度 */
  background: rgba(118, 118, 118, 0.1);
}


.taskBox3 .algorithm_info{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* margin-bottom: 20px;
  width: 95%;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

.taskInfoBox {
  
  margin-bottom: 20px;
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

h3 {
  display: inline;
  margin-right: 15%;
}

.graphBox {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列，每列宽度相等 */
  width: 90%; /* 设置宽度 */
  height: 400px; /* 设置高度 */
  padding: 20px; /* 设置内边距 */
  background-color: #ffffff; /* 设置背景颜色为白色 */
  border-radius: 10px; /* 设置圆角半径 */
  border: 1px solid #ccc; /* 设置边框 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 设置阴影效果 */
  margin-bottom: 30px;
  margin-left: 60px;
}

.treeBox {
  width: 100%;
  height: 50vh;

  margin-top: 20px;
}

.buttonGroup {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

span {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
