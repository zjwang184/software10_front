<template>
  <div>
    <div id="pdf_1">
      <div class="taskBox1">
        <div>
          <span class="lineStyle">▍</span
          ><span class="featureTitle">任务信息：</span>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div class="taskInfoBox taskname">
          <el-icon class="el-icon-edit-outline el-icon"></el-icon>
          <span>任务名称：</span>
          <span>{{ m_train_model.taskName }}</span>
        </div>
        <div class="taskInfoBox principal">
          <el-icon class="el-icon-user el-icon"></el-icon
          ><span>任务负责人：</span>
          <span>{{ m_train_model.responsiber }}</span>
        </div>
        <div class="taskInfoBox participants">
          <el-icon class="el-icon-user-solid el-icon"></el-icon
          ><span>参与人：</span>
          <span>{{ m_train_model.participant }}</span>
        </div>
        <div class="taskInfoBox comment">
          <el-icon class="el-icon-edit el-icon"></el-icon
          ><span>任务备注：</span>
          <span>{{ m_train_model.remark }}</span>
        </div>

        <div class="taskInfoBox disease">
          <el-icon class="el-icon-price-tag el-icon"></el-icon
          ><span>研究病种：</span>
          <span>{{ m_train_model.disease }}</span>
        </div>
        <div class="taskInfoBox dataset">
          <el-icon class="el-icon-coin el-icon"></el-icon
          ><span>所用数据：</span>
          <span>{{ m_train_model.dataset }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <el-icon class="el-icon-cpu el-icon"></el-icon><span>所用算法：</span>
          <span>{{ this.processedSelectedAlgorithms }}</span>
        </div>
        <div class="taskInfoBox use_features">
          <el-icon class="el-icon-notebook-2 el-icon"></el-icon
          ><span>所用特征：</span>
          <span>{{ m_train_model.use_features.toString() }}</span>
        </div>
      </div>
    </div>

    <div id="pdf_2" v-if="rlModel.length > 0">
      <div class="taskBox2" v-for="(item, index) in rlModel" :key="index">
        <div>
          <span class="lineStyle">▍</span
          ><span class="featureTitle">{{ item.modelname }}模型信息：</span>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div class="algorithm_info">
          <div class="taskInfoBox disease">
            <el-icon class="el-icon-s-data el-icon"></el-icon
            ><span>精确率acc：</span>
            <span>{{ transTOPercent(item.res.accuracy) }}</span>
          </div>
          <div class="taskInfoBox dataset">
            <el-icon class="el-icon-s-claim el-icon"></el-icon
            ><span>准确率precision：</span>
            <span>{{ transTOPercent(item.res.precision) }}</span>
          </div>
          <div class="taskInfoBox algorithm">
            <el-icon class="el-icon-s-order el-icon"></el-icon
            ><span>召回率recall：</span>
            <span>{{ transTOPercent(item.res.recall) }}</span>
          </div>
          <div class="taskInfoBox use_features">
            <el-icon class="el-icon-s-grid el-icon"></el-icon
            ><span>f1-score：</span>
            <span>{{ transTOPercent(item.res.f1) }}</span>
          </div>
        </div>

        <div class="taskInfoBox result">
          <el-icon class="el-icon-s-promotion el-icon"></el-icon
          ><span>任务结果可视化：</span>
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

    <div id="pdf_3" v-if="mlModel.length > 0">
      <div class="taskBox2" v-for="(item, index) in mlModel" :key="index">
        <div>
          <span class="lineStyle">▍</span
          ><span class="featureTitle">{{ item.modelname }}模型信息：</span>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div class="algorithm_info">
          <div class="taskInfoBox disease">
            <el-icon class="el-icon-s-data el-icon"></el-icon
            ><span>精确率acc：</span>
            <span>{{ transTOPercent(item.res.accuracy) }}</span>
          </div>
          <div class="taskInfoBox dataset">
            <el-icon class="el-icon-s-claim el-icon"></el-icon
            ><span>准确率precision：</span>
            <span>{{ transTOPercent(item.res.precision) }}</span>
          </div>
          <div class="taskInfoBox algorithm">
            <el-icon class="el-icon-s-order el-icon"></el-icon
            ><span>召回率recall：</span>
            <span>{{ transTOPercent(item.res.recall) }}</span>
          </div>
          <div class="taskInfoBox use_features">
            <el-icon class="el-icon-s-grid el-icon"></el-icon
            ><span>f1-score：</span>
            <span>{{ transTOPercent(item.res.f1) }}</span>
          </div>
        </div>

        <div class="taskInfoBox result">
          <el-icon class="el-icon-s-promotion el-icon"></el-icon
          ><span>任务结果可视化：</span>
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

    <!-- <div id="pdf_3" v-if="mlModel.length > 0">
      <div id="pdf_3" v-for="(item, index) in mlModel" :key="index">
        <div class="taskBox2">
          <div>
            <span class="lineStyle">▍</span
            ><span class="featureTitle">{{ item.name }}模型信息：</span>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div class="algorithm_info">
            <div class="taskInfoBox disease">
              <el-icon class="el-icon-s-data el-icon"></el-icon
              ><span>精确率acc：</span>
              <span>{{ transTOPercent(item.res.accuracy) }}</span>
            </div>
            <div class="taskInfoBox dataset">
              <el-icon class="el-icon-s-claim el-icon"></el-icon
              ><span>准确率precision：</span>
              <span>{{ transTOPercent(item.res.precision) }}</span>
            </div>
            <div class="taskInfoBox algorithm">
              <el-icon class="el-icon-s-order el-icon"></el-icon
              ><span>召回率recall：</span>
              <span>{{ transTOPercent(item.res.recall) }}</span>
            </div>
            <div class="taskInfoBox use_features">
              <el-icon class="el-icon-s-grid el-icon"></el-icon
              ><span>f1-score：</span>
              <span>{{ transTOPercent(item.res.f1) }}</span>
            </div>
          </div>

          <div class="taskInfoBox result">
            <el-icon class="el-icon-s-promotion el-icon"></el-icon
            ><span>任务结果可视化：</span>
          </div>

          <div class="graphBox">
            <featuresPie
              :data="transToPie(item.res.avg_shapvalue)"
            ></featuresPie>
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
      <div id="pdf_4" v-for="(item, index) in knnModel" :key="index">
        <div class="taskBox2">
          <div>
            <span class="lineStyle">▍</span
            ><span class="featureTitle">{{ item.name }}模型信息：</span>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div class="algorithm_info">
            <div class="taskInfoBox disease">
              <el-icon class="el-icon-s-data el-icon"></el-icon
              ><span>精确率acc：</span>
              <span>{{ transTOPercent(item.res.accuracy) }}</span>
            </div>
            <div class="taskInfoBox dataset">
              <el-icon class="el-icon-s-claim el-icon"></el-icon
              ><span>准确率precision：</span>
              <span>{{ transTOPercent(item.res.precision) }}</span>
            </div>
            <div class="taskInfoBox algorithm">
              <el-icon class="el-icon-s-order el-icon"></el-icon
              ><span>召回率recall：</span>
              <span>{{ transTOPercent(item.res.recall) }}</span>
            </div>
            <div class="taskInfoBox use_features">
              <el-icon class="el-icon-s-grid el-icon"></el-icon
              ><span>f1-score：</span>
              <span>{{ transTOPercent(item.res.f1) }}</span>
            </div>
          </div>

          <div class="taskInfoBox result">
            <el-icon class="el-icon-s-promotion el-icon"></el-icon
            ><span>任务结果可视化：</span>
          </div>

          <div class="graphBox">
            <featuresPie
              :data="transToPie(item.res.avg_shapvalue)"
            ></featuresPie>
            <treeMap
              :TP="transTONumber(item.res.TP)"
              :FN="transTONumber(item.res.FN)"
              :FP="transTONumber(item.res.FP)"
              :TN="transTONumber(item.res.TN)"
            ></treeMap>
          </div>
        </div>
      </div>
    </div> -->

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
import GraphVue from "../model_eCharts/Graph.vue";
import LossCurve from "../model_eCharts/LossCurve.vue";
import RewardCurve from "../model_eCharts/RewardCurve.vue";
import treeMap from "../model_eCharts/treeMap.vue";
import PredictLineChart from "../model_eCharts/PredictLineChart.vue";
import featuresPie from "../model_eCharts/featuresPie.vue";

import { postRequest } from "@/api/user";
import { mapMutations } from "vuex";

import * as echarts from "echarts";

export default {
  name: "Result",
  mixins: [vuex_mixin],
  components: {
    GraphVue,
    RewardCurve,
    LossCurve,
    featuresPie,
    treeMap,
    PredictLineChart,
  },
  props: {
    moduleName: {
      type: String,
      default: "modelTraining",
    },
  },
  computed: {
    rlModel() {
      console.log("rl result", this.m_train_model);
      // 根据条件筛选 editableTabs 数组
      const filteredModels =
        this.m_train_model.algorithm_select.algorithm_infos.filter(
          (item) => item.modelType === "rl" && item.isSelect === true
        );
      console.log("rl length:", filteredModels.length, filteredModels);
      if (filteredModels.length > 0) {
        return filteredModels;
      } else {
        // 如果数组为空，则返回一个空数组或者执行其他操作
        return [];
      }
    },
    mlModel() {
      // 根据条件筛选 editableTabs 数组
      const filteredModels =
        this.m_train_model.algorithm_select.algorithm_infos.filter(
          (item) => item.modelType === "ml" && item.isSelect === true
        );
      console.log("mlModel length:", filteredModels.length, filteredModels);
      if (filteredModels.length > 0) {
        return filteredModels;
      } else {
        // 如果数组为空，则返回一个空数组或者执行其他操作
        return [];
      }
    },
    processedSelectedAlgorithms() {
      const reg = /[\[\"\]]+/g;
      return JSON.stringify(
        this.m_train_model.algorithm_select.selected_algorithms
      )
        .replace(reg, "")
        .replace(/,/g, ", ");
    },
    // knnModel() {
    //   // 根据条件筛选 editableTabs 数组
    //   const filteredModels = this.m_models.filter(
    //     (item) => item.name === "knn" && item.is_select === true
    //   );
    //   console.log("knnModel length:", filteredModels.length, filteredModels);
    //   if (filteredModels.length > 0) {
    //     return filteredModels;
    //   } else {
    //     // 如果数组为空，则返回一个空数组或者执行其他操作
    //     return [];
    //   }
    // },

    filteredModels() {
      // 根据条件筛选 editableTabs 数组
      return this.m_train_model.algorithm_select.algorithm_infos.filter(
        (item) => item.isSelect
      );
    },
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

  mounted() {
    this.printInfos();
    this.init_reward_loss("reward");
    this.init_reward_loss("loss");
    this.initFlag = true;
  },

  methods: {
    ...mapMutations(["SetTaskList"]),

    printInfos() {
      this.$notify({
        title: "运算成功",
        message: "您可根据需要保存任务或导出结果",
        type: "success",
      });

      console.log("this.m_train_model", this.m_train_model);
      console.log(
        "this.m_train_model.algorithm_select.selected_algorithms",
        this.m_train_model.algorithm_select.selected_algorithms
      );
      console.log(
        "console.log(this.m_target_featuress);",
        this.m_train_model.target_features
      );
      console.log("this.m_train_model.res" + this.m_train_model.res);
    },

    transTONumber(confusion) {
      return parseInt(confusion);
    },

    transTOPercent(rate) {
      return (parseFloat(rate) * 100).toFixed(2) + "%";
    },
    transToPie(shapeValueStr) {
      console.log("shapeValueStr", shapeValueStr);
      // 将字符串按逗号分割成对象数组
      const objectArray = shapeValueStr.split("},{").map((item) => {
        // 去除大括号，然后按照键值对分割
        const keyValuePairs = item.replace(/[{}]/g, "").split(",");
        // console.log()
        // 构建对象
        const obj = {};
        keyValuePairs.forEach((pair) => {
          const [key, value] = pair.split(":");
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === "value") {
            obj[trimmedKey] = parseFloat(trimmedValue);
          } else {
            obj[trimmedKey] = trimmedValue;
          }

          // // 如果值是数值，则转换为浮点数，否则保持为字符串
          // obj[trimmedKey] = !isNaN(parseFloat(trimmedValue)) ? parseFloat(trimmedValue) : trimmedValue;
        });
        return obj;
      });

      // 构建期望的 data 数组
      const dataArray = objectArray.map((obj) => {
        return { value: obj.value, name: obj.name };
      });

      // 返回转换后的数据
      console.log("dataArray", dataArray);
      return dataArray;
    },

    init_reward_loss(curve) {
      let models = [];
      console.log(
        "initrewardloss",
        this.m_train_model.algorithm_select.algorithm_infos
      );
      for (
        var i = 0;
        i < this.m_train_model.algorithm_select.algorithm_infos.length;
        i++
      ) {
        if (
          this.m_train_model.algorithm_select.algorithm_infos[i][
            "modelType"
          ] === "rl"
        ) {
          models.push(this.m_train_model.algorithm_select.algorithm_infos[i]);
          break;
        }
      }
      console.log("models:", models);
      console.log("rlModel:", this.rlModel);
      // 假设您的数据存储在 dqnModel 中，并且您希望遍历它们来初始化每个图表
      this.rlModel.forEach((item, index) => {
        console.log("rl item", item);
        let str = "";
        let text = "Reward curve";
        console.log("asdfasdfadsfsdafasdfasdfsadf", this.$refs);
        console.log("asdfasdfadsfsdafasdfasdfsadf", this.$refs.RewardCurve);
        let chartDom = this.$refs.RewardCurve[index];
        if (curve === "reward") {
          str = item.res.total_rewards;
          text = "Reward curve";
        } else if (curve === "loss") {
          str = item.res.total_losses;
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
            {
              show: false,
              type: "continuous",
              seriesIndex: 0,
              min: 0,
              max: 400,
            },
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
        console.log("option", option);
        option && myChart.setOption(option);
      });
    },

    next() {
      //上传任务
      let payload = {
        taskName: this.m_train_model.taskName,
        leader: this.m_train_model.responsiber,
        participant: this.m_train_model.participants,

        disease: this.m_train_model.disease,
        dataset: this.m_train_model.dataset,
        feature: this.m_train_model.use_features,
        targetcolumn: this.m_train_model.target_features[0].riskFactor,
        models: this.filteredModels,

        time: this.m_train_model.res?.time,
        uid: sessionStorage.getItem("userid") - 0,
      };

      console.log("上传：", payload);

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
          this.$router.push("/sideBar/TaskManage");
          // this.m_changeStep(1);
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
          console.log("+ err", err);
          this.$message({
            type: "error",
            message: "新建任务失败",
          });
          this.m_changeStep(this.m_step - 1);
          return false;
        });
    },

    async exportRes() {
      const divsToExport = ["pdf_1", "pdf_2", "pdf_3"];
      const pdf_positions = [
        { x: 5, y: 5 },
        { x: 5, y: 35 },
        { x: 5, y: 160 },
        // { x: 5, y: 210 },
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
  grid-template-columns: repeat(4, minmax(0, 500px));
  margin-bottom: 20px;
  width: 100%;
  height: auto;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
  background: rgba(118, 118, 118, 0.1);
}

.taskBox2 {
  margin-bottom: 20px;
  width: 100%;
  padding: 20px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4); /* 修正阴影的颜色和透明度 */
  background: rgba(118, 118, 118, 0.1);
}

.taskBox2 .algorithm_info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.taskInfoBox {
  font-size: 20px;
  margin-top: 8px;
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
