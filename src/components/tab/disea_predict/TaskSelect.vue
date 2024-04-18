<template>
  <div class="main">
    <div class="left_tree">
      <!-- <el-checkbox v-model="isAllChecked" @change="handleAllCheckedChange"
        >全选</el-checkbox
      > -->
      <!-- <el-alert>叶子节点为数据集，非叶子节点为病种</el-alert> -->
      <div
        style="
          background-color: rgba(146, 145, 145, 0.3);
          width: 100%;
          border: 1px solid #fff;
          border-radius: 10px;
        "
      >
        <h2>
          病种、数据集选择<el-popover placement="top" trigger="hover">
            <div>叶子节点为数据集，非叶子节点为病种</div>
            <el-icon
              class="el-icon-warning-outline"
              slot="reference"
              style="font-size: 15px; margin-left: 20px"
            ></el-icon>
          </el-popover>
        </h2>
      </div>

      <el-tree
        ref="tree"
        :data="treeData"
        :show-checkbox="false"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="changeData"
      >
      </el-tree>
    </div>

    <div class="right">
      <div>
        <span class="lineStyle" style="display: inline-block">▍</span
        ><span class="featureTitle" style="display: inline-block"
          >请选择一个训练好的任务</span
        >
        <span style="display: inline-block"
          ><el-alert>
            可根据疾病名称、数据集、任务名称、任务负责人、所用算法对任务进行筛选,筛选结果根据创建时间由近到远进行排序
          </el-alert></span
        >
      </div>
      <div class="right_top">
        <div class="algorithmSelect_box">
          <div class="algorithmSelect_title">强化学习算法选择</div>
          <div class="algorithmSelect">
            <div>
              <el-icon
                slot="reference"
                class="el-icon-data-analysis"
                style="font-size: 20px; margin-right: 10px"
              ></el-icon>
              <el-switch
                v-model="DQN_selected"
                active-text="DQN"
                style="margin-right: 20px; font-size: 40px"
                @change="handleSwitchChange('dqn', $event)"
              >
              </el-switch>
            </div>
            <div>
              <el-icon
                slot="reference"
                class="el-icon-data-analysis"
                style="font-size: 20px; margin-right: 10px"
              ></el-icon>
              <el-switch
                v-model="DDPG_selected"
                active-text="DDPG"
                style="margin-right: 20px; font-size: 40px"
                @change="handleSwitchChange('ddpg', $event)"
                disabled
              >
              </el-switch>
            </div>
            <div>
              <el-icon
                slot="reference"
                class="el-icon-data-analysis"
                style="font-size: 20px; margin-right: 10px"
              ></el-icon>
              <el-switch
                v-model="PPO_selected"
                active-text="PPO"
                style="margin-right: 20px; font-size: 40px"
                @change="handleSwitchChange('ppo', $event)"
                disabled
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div style="margin-top: 10%"></div>

        <div class="algorithmSelect_box">
          <div class="algorithmSelect_title">非强化学习算法选择</div>
          <div class="algorithmSelect">
            <div>
              <el-icon
                slot="reference"
                class="el-icon-data-analysis"
                style="font-size: 20px; margin-right: 10px"
              ></el-icon>
              <el-switch
                v-model="KNN_selected"
                active-text="KNN"
                style="margin-right: 20px; font-size: 40px"
                @change="handleSwitchChange('knn', $event)"
              >
              </el-switch>
            </div>
            <div>
              <el-icon
                slot="reference"
                class="el-icon-data-analysis"
                style="font-size: 20px; margin-right: 10px"
              ></el-icon>
              <el-switch
                v-model="SVM_selected"
                active-text="SVM"
                style="margin-right: 20px; font-size: 40px"
                @change="handleSwitchChange('svm', $event)"
              >
              </el-switch>
            </div>
            <div>
              <el-icon
                slot="reference"
                class="el-icon-data-analysis"
                style="font-size: 20px; margin-right: 10px"
              ></el-icon>
              <el-switch
                v-model="RF_selected"
                active-text="RF"
                style="margin-right: 20px; font-size: 40px"
                @change="handleSwitchChange('rf', $event)"
                disabled
              >
              </el-switch>
            </div>
          </div>
        </div>
      </div>

      <div class="right_middle">
        <span>
          <i class="el-icon-edit-outline"></i> 任务名称：
          <el-autocomplete
            v-model="taskname"
            placeholder="请输入任务名称进行搜索"
            clearable
            :style="{ width: '300px' }"
            :fetch-suggestions="searchTasknames"
            @select="handleSelect"
          ></el-autocomplete>
        </span>
        <span>
          <i class="el-icon-user"></i> 任务负责人：
          <el-autocomplete
            v-model="leader"
            placeholder="请输入任务负责人进行搜索"
            clearable
            :style="{ width: '300px' }"
            :fetch-suggestions="searchLeaders"
            @select="handleSelect"
          ></el-autocomplete>
        </span>
        <div style="margin-top: 10px;margin-right: 20px;text-align: right;">
          共
          <span style="color: red">{{ filteredTaskList.length }} </span> 个任务
        </div>
      </div>

      <div class="right_bottom">
        <div class="cardGroup">
          <el-card
            class="taskCard"
            v-for="item in filteredTaskList"
            :key="item.id"
            shadow="always"
          >
            <div class="cardInfo">
              <div>
                <span class="ttl">任务名称：</span>
                <span v-html="highlightMatch(item.taskname, taskname)"></span>
              </div>
              <div>
                <span class="ttl">任务负责人：</span>
                <span v-html="highlightMatch(item.leader, leader)"></span>
              </div>
              <div>
                <span class="ttl">所属疾病：</span
                ><span :class="{ 'text-red': disease === item.disease }">{{
                  item.disease
                }}</span>
              </div>
              <div>
                <span class="ttl">所用算法：</span
                ><span
                  :class="{ 'text-red': modelList.includes(item.modelname) }"
                  >{{ item.modelname }}</span
                >
              </div>
              <div>
                <span class="ttl">数据表：</span
                ><span :class="{ 'text-red': dataset === item.dataset }">{{
                  item.dataset
                }}</span>
              </div>
              <div>
                <span class="ttl">创建时间：</span>{{ item.createtime }}
              </div>
              <div>
                <span class="ttl"
                  >所属类别：<span>{{ item.classpath }}</span></span
                >
              </div>
            </div>
            <span class="buttonGroup">
              <el-popover placement="top" trigger="hover">
                <div>点击查看任务详情</div>
                <el-button
                  slot="reference"
                  type="success"
                  @click="handleCheck(item)"
                  round
                  >查看</el-button
                >
              </el-popover>
              <span style="margin: 10px"></span>

              <el-button type="primary" @click="submit(item)" round
                >确认</el-button
              >
            </span>
          </el-card>
        </div>
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalTasks"
          style="margin-top: 10px; margin-left: 30%"
        >
        </el-pagination> -->
        <el-dialog
          :visible.sync="resultDialogShow"
          v-if="resultDialogShow"
          style="width: 90%; height: auto"
          center
        >
          <div class="taskInfoBox principal">
            <span class="lineStyle">▍</span
            ><span class="featureTitle">任务负责人：</span>
            <span class="text">{{ result.leader }}</span>
          </div>
          <div
            class="taskInfoBox participants"
            v-if="result.participant !== null"
          >
            <span class="lineStyle">▍</span
            ><span class="featureTitle">参与人：</span>
            <span class="text">{{ result.participant }}</span>
          </div>
          <div class="taskInfoBox disease">
            <span class="lineStyle">▍</span
            ><span class="featureTitle">研究病种：</span>
            <span class="text">{{ result.disease }}</span>
          </div>
          <div class="taskInfoBox dataset">
            <span class="lineStyle">▍</span
            ><span class="featureTitle">所用数据：</span>
            <span class="text">{{ result.dataset }}</span>
          </div>
          <div class="taskInfoBox algorithm">
            <span class="lineStyle">▍</span
            ><span class="featureTitle">所用算法：</span>
            <span class="text">{{ result.modelname }}</span>
          </div>
          <!-- <div class="taskInfoBox algorithmValue">
            <span class="lineStyle">▍</span
            ><span class="featureTitle">算法参数：</span>
            <span v-if="result.para[0] == ''">本算法没有参数</span>
            <div v-if="result.para[0] != ''">
              <div v-for="(item, index) in result.para" :key="index">
                <span class="text"
                  >{{ result.para[index] }}：{{ result.paraValue[index] }}</span
                >
              </div>
            </div>
          </div> -->
          <div class="taskInfoBox target_features">
            <span class="lineStyle">▍</span
            ><span class="featureTitle">目标因素：</span>
            <span class="text">{{ result.targetcolumn.toString() }}</span>
          </div>
          <div class="taskInfoBox use_features">
            <span class="lineStyle">▍</span
            ><span class="featureTitle">所用特征：</span>
            <span class="text">{{ result.feature.toString() }}</span>
          </div>
          <!-- <div class="taskInfoBox result">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">挖掘结果：</span>
          <div v-for="(item, index) in result.res" :key="index">
            <span
              >{{ result.targetcolumn[index] }} -> {{ item.toString() }}</span
            >
          </div>
        </div> -->
          <!-- <div class="taskInfoBox result">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">专家知识匹配度：</span>
          <span>{{ (result.ratio * 100).toFixed(2) }}%</span>
        </div> -->

          <span slot="footer" class="dialog-footer">
            <el-button @click="resultDialogShow = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { getRequest, postRequest } from "@/utils/api";
import { getCategory } from "@/api/category";
import { getTableData } from "@/api/tableDescribe.js";
// import { taskList } from "@/components/tab/constTaskList.js";

export default {
  name: "TaskSelect",
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "diseaPredict",
    },
  },
  computed: {
    totalTasks() {
      return this.taskList.filter((item) => this.displayedCard(item)).length;
    },
    filteredTaskListByModel() {
      return this.taskList.filter((item) => item.modelname);
    },
    isModelListContainsDQN() {
      return this.modelList.includes("dqn");
    },
    isModelListContainsDDPG() {
      return this.modelList.includes("ddpg");
    },
    isModelListContainsPPO() {
      return this.modelList.includes("ppo");
    },
    isModelListContainsKNN() {
      return this.modelList.includes("knn");
    },
    isModelListContainsSVM() {
      return this.modelList.includes("svm");
    },
    isModelListContainsRF() {
      return this.modelList.includes("rf");
    },
    filteredTaskList() {
      // 进行筛选
      let filteredList = this.taskList.filter((task) => {
        let diseaseMatch = this.disease === "" || task.disease === this.disease;
        let modelMatch =
          this.modelList.length === 0 ||
          this.modelList.includes(task.modelname);
        let datasetMatch = this.dataset === "" || task.dataset === this.dataset;
        let leaderMatch =
          this.leader === "" || new RegExp(this.leader, "i").test(task.leader);
        let taskMatch =
          this.taskname === "" ||
          new RegExp(this.taskname, "i").test(task.taskname);
        return (
          diseaseMatch && modelMatch && datasetMatch && leaderMatch && taskMatch
        );
      });

      // 进行排序
      return filteredList.sort((a, b) => {
        return new Date(b.createtime) - new Date(a.createtime);
      });
    },
  },

  data() {
    return {
      isAllChecked: false, // 全选按钮的状态
      resultDialogShow: false,
      result: {},
      treeData: [],
      disease: "",
      leader: "",
      taskname: "",
      tasknames: [],
      leaders: [],
      modelList: [],
      dataset: "",
      // diseaseList: [],
      // datasetList: [],
      // taskList: JSON.parse(JSON.stringify(taskList)),
      taskList: [],
      DQN_selected: false,
      DDPG_selected: false,
      PPO_selected: false,
      KNN_selected: false,
      SVM_selected: false,
      RF_selected: false,
      predict_features: [],
      predict_task_name: "",
      predict_model_name: "",

      //分页数据
      pageSize: 20,
      pageSizes: [20, 30, 40, 50],
      currentPage: 1,
    };
  },

  created() {
    this.init();
  },

  methods: {
    //和vuex内数据同步
    init() {
      //初始化
      // const uniqueModels = new Set();
      // for (const item of this.filteredTaskListByModel) {
      //   uniqueModels.add(item.modelname);
      // }
      // this.modelList = Array.from(uniqueModels);
      this.predict_features = this.m_predict_features;
      this.predict_model_name = this.m_predict_model_name;
      this.predict_task_name = this.m_predict_task_name;
      this.DQN_selected = this.isModelListContainsDQN;
      this.DDPG_selected = this.isModelListContainsDDPG;
      this.PPO_selected = this.isModelListContainsPPO;
      this.KNN_selected = this.isModelListContainsKNN;
      this.SVM_selected = this.isModelListContainsSVM;
      this.RF_selected = this.isModelListContainsRF;

      // this.getCatgory();
      this.getTaskList();

      console.log("当前模块名👉", this.moduleName);
      console.log("this.m_predict_features111   ", this.m_predict_features);
    },

    getTaskList() {
      getRequest("/Task/all")
        .then((res) => {
          this.taskList = res.data;
          this.getTasknames();
          this.getLeaders();
          console.log("this.taskList", this.taskList);
        })
        .catch((err) => {
          console.log("任务列表获取错误，请联系管理员。");
          console.log(err);
        });
    },

    // getTasknames() {
    //   // 遍历 this.taskList 对象的属性
    //   for (var key in this.taskList) {
    //     // 检查属性是否是对象自身的属性，而不是继承的属性
    //     if (this.taskList.hasOwnProperty(key)) {
    //       // 获取当前属性对应的对象
    //       var task = this.taskList[key];
    //       // 检查对象是否具有 taskname 属性
    //       if (task.hasOwnProperty("taskname")) {
    //         // 将 taskname 属性的值推送到 tasknames 数组中的 value 属性中
    //         this.tasknames.push({ value: task.taskname });
    //       }
    //     }
    //   }
    //   console.log("this.tasknames", this.tasknames);
    // },
    getTasknames() {
      // 用于记录已经出现过的任务名称
      var uniqueTasknames = {};
      // 遍历 this.taskList 对象的属性
      for (var key in this.taskList) {
        // 检查属性是否是对象自身的属性，而不是继承的属性
        if (this.taskList.hasOwnProperty(key)) {
          // 获取当前属性对应的对象
          var task = this.taskList[key];
          // 检查对象是否具有 taskname 属性
          if (task.hasOwnProperty("taskname")) {
            // 将任务名称添加到临时对象中进行记录
            uniqueTasknames[task.taskname] = true;
          }
        }
      }
      // 将记录的任务名称转为数组形式
      this.tasknames = Object.keys(uniqueTasknames).map(function (taskname) {
        return { value: taskname };
      });
    },

    getLeaders() {
      // 用于记录已经出现过的领导者名称
      var uniqueLeaders = {};
      // 遍历 this.taskList 对象的属性
      for (var key in this.taskList) {
        // 检查属性是否是对象自身的属性，而不是继承的属性
        if (this.taskList.hasOwnProperty(key)) {
          // 获取当前属性对应的对象
          var task = this.taskList[key];
          // 检查对象是否具有 leader 属性
          if (task.hasOwnProperty("leader")) {
            // 将领导者名称添加到临时对象中进行记录
            uniqueLeaders[task.leader] = true;
          }
        }
      }
      // 将记录的领导者名称转为数组形式
      this.leaders = Object.keys(uniqueLeaders).map(function (leader) {
        return { value: leader };
      });
      console.log("this.leaders",this.leaders);
    },

    getCatgory() {
      getCategory("/api/category").then((response) => {
        this.treeData = response.data;
        console.log("222222");
      });
    },

    getTableData(tableId, tableName) {
      getTableData("/api/getTableData", tableId, tableName)
        .then((response) => {
          // 获取表数据
          this.tableData = response.data;
          console.log("数据长度" + response.data.length);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    clearFilter() {
      this.disease = "";
      this.leader = "";
    },

    handleAllCheckedChange(value) {
      // 全选按钮状态变化时的处理逻辑
      // 将所有节点的选中状态设置为与全选按钮状态相同
      this.$refs.tree.setCheckedKeys(value ? this.getAllNodeKeys() : []);
    },
    getAllNodeKeys() {
      // 获取所有节点的 key 值
      const keys = [];
      const traverse = (node) => {
        keys.push(node.data.id);
        if (node.children) {
          node.children.forEach((child) => traverse(child));
        }
      };
      this.$refs.tree.store.root.childNodes.forEach((node) => traverse(node));
      return keys;
    },

    handleCheck(row) {
      getRequest(`Task/result/${row.id}`).then((res) => {
        if (res.code == 200) {
          this.result = res.data;
          console.log("this.result", this.result);
          if (this.result.feature != null) {
            this.result.feature = this.result.feature.split(",");
          }
          this.resultDialogShow = true;
        } else {
          this.$message.error("查看任务失败");
        }
      });
    },

    highlightMatch(text, query) {
      if (!query) return text; // 如果查询字符串为空，则返回原始文本
      const regex = new RegExp(query, "gi");
      return text.replace(
        regex,
        (match) => `<span style="color:red;">${match}</span>`
      ); // 对匹配到的部分应用红色样式
    },

    searchTasknames(queryString, cb) {
      var tasknames = this.tasknames;
      var results = queryString
        ? tasknames.filter(this.createFilter(queryString))
        : tasknames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    searchLeaders(queryString, cb) {
      var leaders = this.leaders;
      var results = queryString
        ? leaders.filter(this.createFilter(queryString))
        : leaders;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (data) => {
        return (
          data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    handleSelect(item) {
      // 处理选中联想项的逻辑
      console.log("选中的任务项:", item);
    },

    // handleCheckChange(data, checked) {
    //   if (checked) {
    //     if (data.isLeafs == 0) {
    //       this.diseaseList.push(data.label);
    //     } else {
    //       this.datasetList.push(data.label);
    //     }
    //   } else {
    //     const index1 = this.datasetList.indexOf(data.label);
    //     const index2 = this.diseaseList.indexOf(data.label);
    //     if (index1 !== -1) {
    //       this.datasetList.splice(index1, 1);
    //     }
    //     if (index2 !== -1) {
    //       this.diseaseList.splice(index2, 1);
    //     }
    //   }
    //   console.log("diseaseList: ",this.diseaseList);
    //   console.log("datasetList: ",this.datasetList);
    // },

    changeData(node) {
      if (this.lastClickedNode && this.lastClickedNode === node) {
        // 如果当前节点已经被高亮，则取消高亮
        this.$refs.tree.setCurrentKey(null);
        this.lastClickedNode = null;
        this.disease = "";
        this.dataset = "";
      } else {
        // 高亮当前节点
        this.$refs.tree.setCurrentKey(node.id);
        this.lastClickedNode = node;
        if (node.isLeafs == 0) {
          this.disease = node.label;
          this.dataset = "";
        } else {
          this.dataset = node.label;
          this.disease = "";
        }
      }
      console.log("this.disease: ", this.disease);
      console.log("this.dataset: ", this.dataset);
      console.log("this.taskname: ", this.taskname);
      console.log("this.leader: ", this.leader);
    },

    handleSwitchChange(modelName, value) {
      if (value) {
        // 如果开关打开，则向modelList数组中添加模型名称
        this.modelList.push(modelName);
        console.log(this.modelList);
      } else {
        // 如果开关关闭，则从modelList数组中删除模型名称
        const index = this.modelList.indexOf(modelName);
        if (index !== -1) {
          this.modelList.splice(index, 1);
          console.log(this.modelList);
        }
      }
    },

    // 处理每页数量变化
    // handleSizeChange(size) {
    //   this.pageSize = size;
    //   this.loadData();
    // },
    // 处理当前页变化
    // handleCurrentChange(page) {
    //   this.currentPage = page;
    //   this.loadData();
    // },

    isMatch(query, text) {
      if (!query) return false; // 如果查询字符串为空，则不需要匹配
      return text.toLowerCase().includes(query.toLowerCase()); // 使用toLowerCase()将查询字符串和文本都转换为小写，然后检查文本是否包含查询字符串
    },

    submit(row) {
      // this.m_changeStep(2);
      getRequest(`Task/result/pred/${row.id}`).then((res) => {
        if (res.code == 200) {
          this.predict_features = res.data;
          this.predict_task_name = row.taskname;
          this.predict_model_name = row.modelname;
          this.m_changeTaskInfo({
            predict_features: this.predict_features,
            predict_task_name: this.predict_task_name,
            predict_model_name: this.predict_model_name,
          });
          this.m_changeStep(2);
        }
      });
    },
  },
};
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 15% 85%;
  height: 100%;
  overflow-y: hidden; /* 隐藏垂直滚动条 */
  overflow-x: hidden;
}

.left_tree {
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
  overflow-y: scroll; /* 或者 auto */
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}

/* 修改树形控件高亮颜色 */
::v-deep.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #ffffff;
  background: #62a2e7 !important;
}

.right {
  display: grid;
  grid-template-rows: 60px 100px 80px 800px;
  margin-left: 30px;
  height: auto;
}

.right_top {
  display: flex; /* 将容器设置为弹性布局 */
  width: auto;
}

.right_top > div {
  display: inline-block;
  margin-right: 10px;
}

.right_middle {
  display: grid;
  grid-template-columns: auto auto auto;
  margin-top: 20px;
}

.right_bottom {
  /* margin-top:20px; */
  height: 800px;
  overflow-y: auto;
  width: 100%;
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
  margin-left: auto;
}

.featureTitle {
  font-size: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
}

.buttonGroup {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.algorithmSelect_box {
  width: 50%;
  height: auto;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
  margin-top: 10px;
}

.cardGroup {
  width: 100%; /* 调整宽度 */
  height: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px; /* 间距 */
  overflow-y: scroll; /* 或者 auto */
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}

.cardGroup::-webkit-scrollbar {
  display: none; /* 隐藏 Chrome/Safari 的滚动条 */
}

.taskCard {
  margin-bottom: 10px;
  width: 95%;
  border: 1px solid #c0bebe; /* 边框颜色设置为黑色 */
  box-shadow: 0 2px 4px rgba(88, 88, 88, 0.1);
  border-radius: 10px;
  overflow-y: scroll; /* 或者 auto */
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}

.taskCard::-webkit-scrollbar {
  display: none; /* 隐藏 Chrome/Safari 的滚动条 */
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto; /* 定义四行，高度根据内容自适应 */
  gap: 10px; /* 定义网格行和列之间的间隙 */
  margin-left: 10%;
}

.cardInfo > div:nth-child(5), /* 第五个子元素（数据表） */
.cardInfo > div:nth-child(6) /* 第六个子元素（创建时间） */ {
  grid-column: 1 / span 2; /* 这两个元素跨越两列 */
}

.algorithmSelect {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto;
  gap: 10px;
  height: auto;
  margin: 5px;
}

.algorithmSelect > div:nth-child(5),
.algorithmSelect > div:nth-child(6) {
  grid-column: 1 / span 2;
}

.algorithmSelect_title {
  font-weight: 600;
  justify-content: center;
  padding: 10px;
  width: 50%;
  border-radius: 8px;
  background-color: #eaf2f8;
  margin-bottom: 10px;
  text-align: center; /* 将文字居中 */
}

.text {
  font-size: 30px;
}

.ttl {
  font-weight: 600;
  /* font-size: 20px; */
  color: #071135;
}

.text-red {
  color: red;
}
</style>