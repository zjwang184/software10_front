<template>
  <div>
    <div class="topStatistic">
      <el-card class="quickAccess-card">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>快捷入口</span>
        </div>
        <div class="quickAccess">
          <div
            v-for="item in quickAccessItems"
            :key="item.route"
            @click="goToPage(item.route)"
            style="cursor: pointer; text-align: center; justify-content: center"
            slot="refrence"
          >
            <el-popover placement="top" trigger="hover">
              <div>点击跳转到{{ item.text }}</div>
              <div slot="reference">
                <img
                  :src="item.imageSrc"
                  :alt="item.altText"
                  class="imgStyle"
                />
                <div>{{ item.text }}</div>
              </div>
            </el-popover>
          </div>
        </div>
      </el-card>
      <el-card class="statisticalInformation-card">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span> <span>统计信息</span>
        </div>
        <div class="statisticalInformation">
          <div class="datasetsNuber">
            <el-icon
              class="el-icon-s-grid"
              style="font-size: 15px; margin-right: 5px"
            ></el-icon
            >专病集个数: <span>{{ disease_num }}</span
            >个
          </div>
          <div class="tasksNumber">
            <el-icon
              class="el-icon-s-order"
              style="font-size: 15px; margin-right: 5px"
            ></el-icon
            >任务总数:<span>{{ task_num }}</span> 个
          </div>
          <div class="featuresNumber">
            <el-icon
              class="el-icon-s-data"
              style="font-size: 15px; margin-right: 5px"
            ></el-icon
            >知识条数:<span> {{ knowledge_num }}</span
            >个
          </div>
          <!-- <div class="predictDiseaseAccess"></div> -->
        </div>
      </el-card>
    </div>

    <div class="midStatistic">
      <el-card class="mid_statistic_card">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>近期新建训练任务数</span>
            <!-- <el-select class="chartSelect" v-model="charttype" placeholder="请选择" size="mini" @change="changeChart">
              <el-option v-for="item in chartOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->

            <!-- <el-date-picker
              class="chartDateSelect"
              v-model="value"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              size="mini"
            >
            </el-date-picker> -->
          </div>

          <div id="chartBox" style="height: 40vh; width: 39vw; margin: 0 auto">
            <LineChartVue
              :x="LineChartVue_x"
              :y="LineChartVue_y"
              v-if="LineChartVue_x.length && LineChartVue_y.length"
            >
            </LineChartVue>
          </div>
        </el-card>

        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>疾病占比</span>
          </div>
          <div id="chartBox" style="height: 40vh; width: 37vw; margin: 0 auto">
            <Pie :pie_data="pie_data" v-if="pie_data.length"> </Pie>
          </div>
        </el-card>
      </el-card>
    </div>

    <div class="bottomStatistic">
      <el-card class="bottom_statistic_card">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>缺失占比</span>
            <el-select
              class="BarchartSelect"
              v-model="table_value"
              placeholder="请选择数据集"
              size="mini"
              @change="table_val_change"
            >
              <el-option
                v-for="item in table_value_options"
                :key="item"
                :label="item"
                :value="item"
                size="mini"
              >
              </el-option>
            </el-select>
          </div>
          <div
            id="chartBox"
            style="height: 35vh; width: 39vw; margin-left: 3vh"
            v-loading="fill_rate_loading"
            element-loading-text="后台加载中"
          >
            <Sprit
              v-if="this.sprit_names.length !== 0"
              :sprit_names="sprit_names"
              :sprit_values="sprit_values"
              :height="400"
              :width="950"
              :title="table_value"
            >
            </Sprit>
          </div>
        </el-card>

        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>算法使用频次</span>
          </div>
          <div id="chartBox">
            <Bar
              style="height: 40vh; width: 38vw"
              :data="Bar_data"
              :date="Bar_date"
              :modelnames="modelnames"
              v-if="Bar_data.length"
            >
            </Bar>
          </div>
        </el-card>
      </el-card>
    </div>

    <!-- <div class="topBigDiv">
      <div class="left">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>快捷入口</span>
          </div>
          <div class="quickEntryBox">
            <div v-for="(item, index) in quickEntry" :key="index">
              <div class="singleBox" @click="quickLink(index)">
                <img :src="item.img" class="imgStyle" style="border-radius: 15px" />
                <div style="text-align: center">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="right">
        <el-card class="card" :body-style="{
          padding: '0px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>系统模型信息</span>
          </div>
          <el-table :data="modelList" stripe style="width: 100%" height="22.5vh">
            <el-table-column prop="id" label="模型id" width="140"></el-table-column>
            <el-table-column prop="modelName" label="模型名称" width="200"></el-table-column>
            <el-table-column prop="publisher" label="发布人"> </el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

    <div class="bottomBigDiv">
      <div class="left">
        <el-card :body-style="{
          padding: '0px',
          paddingLeft: '20px',
          paddingRight: '20px',
          height: '48vh',
        }">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>数据表概览</span>
          </div>
          <el-table :data="dataList" stripe style="width: 100%" max-height="400">
            <el-table-column prop="table_name" label="表名" width="130px"></el-table-column>
            <el-table-column prop="disease" label="涉及疾病" width="150px"></el-table-column>
            <el-table-column prop="featurenumber" label="特征数"></el-table-column>
            <el-table-column prop="creator" label="创建者"> </el-table-column>
          </el-table>
        </el-card>
      </div>

      <div class="mid">
        <el-card :body-style="{
          padding: '0px',
          paddingLeft: '20px',
          paddingRight: '20px',
          height: '48vh',
        }">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>任务信息概览 </span>
          </div>
          <el-table :data="taskList" stripe style="width: 100%" max-height="400">
            <el-table-column prop="taskName" label="任务名"></el-table-column>
            <el-table-column prop="leader" label="负责人"></el-table-column>
            <el-table-column prop="model" label="算法"></el-table-column>
            <el-table-column prop="dataset" label="数据集"></el-table-column>
          </el-table>
        </el-card>
      </div>

      <div class="right">
        <el-card :body-style="{
          padding: '0',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '20px',
          height: '45.9vh',
          overflow: 'hidden',
        }">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>近期新建任务数</span>
            <el-select class="chartSelect" v-model="charttype" placeholder="请选择" size="mini" @change="changeChart">
              <el-option v-for="item in chartOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div id="chartBox">
            <!-不加v-if判断x轴长度他就可能无法渲染 -->
    <!-- <LineChartVue v-if="sevendays.length > 0" :legend="chartLegend" :statistic="chartData" :x="sevendays">
            </LineChartVue>
          </div>
        </el-card>
      </div>
    </div> -->
  </div>
</template>

<script>
import { getRequest } from "@/api/user";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import LineChartVue from "@/components/tab/subcomponents/LineChart.vue";
import Pie from "@/components/tab/subcomponents/Pie.vue";
import Sprit from "@/components/tab/subcomponents/Sprit.vue";
import Bar from "@/components/tab/subcomponents/Bar.vue";
import { log } from "@antv/g2plot/lib/utils";
export default {
  name: "index",
  components: { LineChartVue, Pie, Sprit, Bar },
  computed: {
    ...mapState(["modelList", "dataList", "taskList"]),
  },
  data() {
    return {
      quickAccessItems: [
        {
          route: "/sideBar/DataManage",
          imageSrc: require("../../assets/数据管理（快捷入口）.png"),
          altText: "数据管理（快捷入口)",
          text: "数据管理",
        },
        {
          route: "/sideBar/exceptionFeature",
          imageSrc: require("../../assets/知识管理（快捷入口）.png"),
          altText: "数据管理（快捷入口)",
          text: "知识管理",
        },
        {
          route: "/sideBar/ModelTraining",
          imageSrc: require("../../assets/模型训练（快捷入口）.png"),
          altText: "数据管理（快捷入口)",
          text: "模型训练",
        },
        {
          route: "/sideBar/DiseaPredict",
          imageSrc: require("../../assets/疾病风险预测（快捷入口）.png"),
          altText: "数据管理（快捷入口)",
          text: "疾病风险预测",
        },
      ],
      disease_num: 0,
      task_num: 0,
      knowledge_num: 0,
      LineChartVue_x: [],
      LineChartVue_y: [],

      pie_data: [],

      fill_rate_loading: false,
      table_value: "",
      table_value_options: [],
      sprit_names: [],
      sprit_values: [],

      Bar_date: [],
      Bar_data: [],
      modelnames: [],

      chartLegend: [],
      modelName: [],
      chartData: [],
      taskTotal: [],
      taskModel: [],
      sevendays: [],
      charttype: 1,
      chartOptions: [
        {
          value: 1,
          label: "总数",
        },
        {
          value: 2,
          label: "分任务",
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },

  created() {
    this.init();
    this.getTaskList(sessionStorage.getItem("userid") - 0);
  },

  methods: {
    ...mapActions(["getTaskList"]),
    async init() {
      getRequest("/api/getDiseaseNum").then((res) => {
        this.disease_num = res.data;
        console.log("nums", this.disease_num);
      });
      getRequest("/Task/taskNumb").then((res) => {
        this.task_num = res.data;
        console.log("nums", this.task_num);
      });
      getRequest("/ten/knowledge/knowledgeNum").then((res) => {
        this.knowledge_num = res.data;
        console.log("nums", this.knowledge_num);
      });

      getRequest("/Task/GetTaskNearlySevenDays").then((res) => {
        this.LineChartVue_x = res.date;
        this.LineChartVue_y = res.number;
      });
      getRequest("/Task/GetEveryTaskNearlySevenDays").then((res) => {
        Object.keys(res).forEach((key) => {
          if (key == "date") {
            this.Bar_date = res.date;
          } else {
            this.modelnames.push(key);
            this.Bar_data.push({
              name: key,
              type: "bar",
              tooltip: {
                valueFormatter: function (value) {
                  return value + " 次";
                },
              },
              data: res[key],
            });
          }
        });

        console.log("Bar_data res", this.Bar_data, res);
      });
      getRequest("/api/category/static").then((res) => {
        //实现思路：通过 Object.keys()对象方法将对象的key转化为一个数组，再通过forEach遍历出数组的值，再通过[key]去获取对象的value值。
        Object.keys(res).forEach((key) => {
          this.pie_data.push({ name: key, value: res[key] });
        });

        console.log("pie data", this.pie_data, this.pie_data.length);
      });

      getRequest("/api/getAllTableNames").then((res) => {
        if (res.code == 200) {
          this.table_value_options = res.data;
          this.table_value = this.table_value_options[0];
          this.table_val_change();
        } else {
          this.$message.error("获取数据失败");
        }
      });
      // getRequest("/ten/knowledge/knowledgeNum").then((res) => {
      //     this.knowledge_num=res.data;
      //     console.log("nums", this.knowledge_num)
      // });

      // getRequest("Task/totals").then((res) => {
      //   console.log(res);
      //   this.chartLegend = ["当天任务数"];
      //   this.taskTotal.push({
      //     name: "当天任务数",
      //     type: "line",
      //     smooth: true,
      //     data: [],
      //   });
      //   for (const item of this.modelList) {
      //     this.modelName.push(item.modelName);
      //     this.taskModel.push({
      //       name: item.modelName,
      //       type: "line",
      //       smooth: true,
      //       data: new Array(7).fill(0),
      //     });
      //   }
      //   console.log(this.taskModel);
      //   for (let i = 0; i < 7; i++) {
      //     this.sevendays.push(res[i].formattedDate);
      //     this.taskTotal[0].data.push(res[i].total);
      //     for (const model of res[i].usages) {
      //       let index = this.taskModel.findIndex((element) => {
      //         return element.name.trim() == model.model.trim();
      //       });
      //       console.log(index);
      //       this.taskModel[index].data[i] = model.usageCount;
      //     }
      //   }
      //   console.log(this.taskModel);
      //   console.log(this.sevendays);
      //   this.chartData = this.taskTotal;
      //   console.log(this.chartData[0].data);
      // });
    },

    table_val_change() {
      this.fill_rate_loading = true;
      this.sprit_names = [];
      this.sprit_values = [];
      getRequest(`scripts/get_fill_rate?tablename=${this.table_value}`).then(
        (res) => {
          this.sprit_names = res.column_name;
          console.log("res.column_name", res.column_name);
          console.log("res.column_name", res);

          this.sprit_values = res.miss_rate;
          this.fill_rate_loading = false;
        }
      );
    },
    goToPage(route) {
      this.$router.push(route); // 使用 Vue Router 的 push 方法进行页面跳转
    },

    changeChart() {
      switch (this.charttype) {
        case 1: {
          this.chartLegend = ["当天任务数"];
          this.chartData = this.taskTotal;
          break;
        }
        case 2: {
          this.chartLegend = this.modelName;
          this.chartData = this.taskModel;
          break;
        }
      }
    },
  },
};
</script>

<style scoped>
.topStatistic {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  width: 100%;
}

.quickAccess {
  margin-top: 10px;
}

.quickAccess,
.statisticalInformation {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.quickAccess img {
  position: relative;
  top: 0;
}
.quickAccess img:hover {
  top: -2px;
  box-shadow: 0 0 20px rgb(122, 122, 122, 0.7);
  background-color: rgba(102, 102, 102, 0.2);
}

.datasetsNuber,
.tasksNumber,
.featuresNumber {
  flex: 1;
  text-align: center;
  justify-content: center;
}

.datasetsNuber span,
.tasksNumber span,
.featuresNumber span {
  font-size: 30px;
  color: rgba(51, 109, 185, 0.9);
  margin: 0 1rem;
  font-weight: bold;
}

.imgStyle {
  width: 15%;
}

.datasetsNuber,
.tasksNumber,
.featuresNumber {
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.1);
  margin: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 40;
}

.card {
  padding: 0;
  height: 100%;
}

#chartBox {
  width: 100%;
  height: 100%;
}

.chartSelect {
  width: 100px;
  margin-left: 25px;
}

.chartDateSelect {
  width: 100px;
  margin-left: 25px;
}

.top_statistic_card {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 95%;
  height: 33%;
}

.top_statistic_card .el-card {
  display: inline-block;
  width: 21%;
  height: 100px;
  margin: 1%;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
}

.midStatistic,
.bottomStatistic {
  width: 100%;
}

.mid_statistic_card,
.bottom_statistic_card {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 50vh;
}

.mid_statistic_card .el-card,
.bottom_statistic_card .el-card {
  display: inline-block;
  width: 47%;
  height: 45vh;
  /* margin: 0.5% 1.3% 0.5% 1.3%; */
  margin: 0 1%;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.1);
}
</style>
