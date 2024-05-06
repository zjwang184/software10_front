<template>
  <div class="main">
    <div class="left_tree">
      <div class="tree-top">
        <div class="tipInfo">
          <h3>病种、数据集选择</h3>
          <span class="statistic"> 一级病种: {{ diseaseNum }} 个 </span>
          <span class="statistic"> 数据表: {{ datasetNum }} 个 </span>
        </div>
        <hr class="hr-dashed" />
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
      </div>

      <div class="treeArea">
        <!-- =========================================私有数据集树 --------------------------->
        <el-tree
          ref="tree1"
          :data="treeData1"
          :show-checkbox="false"
          node-key="id"
          :default-expanded-keys="['1']"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="changeData1"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid != loginUserID"
              ></i>
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid == loginUserID"
                style="color: rgb(40, 207, 18)"
              ></i>
              <span
                v-if="data.catLevel == 1"
                style="font-weight: bold; font-size: 16px; color: #252525"
                >{{ node.label }}</span
              >
              <span
                v-else
                :class="{
                  nodeLabel: node.label.length <= 12,
                  'scrolling-nodeLabel': node.label.length > 12,
                }"
                >{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID">
                  （我）</span
                >
              </span>
            </span>
          </span>
        </el-tree>

        <!-- =========================================共享数据集树 -->
        <el-tree
          ref="tree2"
          :data="treeData2"
          :show-checkbox="false"
          node-key="id"
          :default-expanded-keys="['1']"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="changeData2"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid != loginUserID"
              ></i>
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid == loginUserID"
                style="color: rgb(40, 207, 18)"
              ></i>
              <span
                v-if="data.catLevel == 1"
                style="font-weight: bold; font-size: 16px; color: #252525"
                >{{ node.label }}</span
              >
              <span
                v-else
                :class="{
                  nodeLabel: node.label.length <= 12,
                  'scrolling-nodeLabel': node.label.length > 12,
                }"
                >{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID">
                  （我）</span
                >
              </span>
            </span>
          </span>
        </el-tree>

        <!-- =========================================公共数据集树 -->
        <el-tree
          ref="tree3"
          :data="treeData3"
          :show-checkbox="false"
          node-key="id"
          :default-expanded-keys="['1']"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="changeData3"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1"
              ></i>
              <span
                v-if="data.catLevel == 1"
                style="font-weight: bold; font-size: 16px; color: #252525"
                >{{ node.label }}</span
              >
              <span
                v-else
                :class="{
                  nodeLabel: node.label.length <= 12,
                  'scrolling-nodeLabel': node.label.length > 12,
                }"
                >{{ node.label }}</span
              >
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <div class="right">
      <div>
        <span class="lineStyle" style="display: inline-block">▍</span
        ><span class="featureTitle" style="display: inline-block"
          >根据条件选择已训练好的模型</span
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
        <div style="margin-top: 10px; margin-right: 20px; text-align: right">
          共
          <span style="color: red">{{ filteredTaskList.length }} </span> 个任务
        </div>
      </div>

      <div class="right_bottom">
        <div class="cardGroup">
          <el-card
            class="taskCard taskCard-item"
            v-for="item in displayedTasks"
            :key="item.id"
            shadow="always"
          >
            <div class="cardInfo">
              <div>
                <span class="ttl">任务（模型）名称：</span>
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
                <span class="ttl">精确率：</span
                ><span
                  v-html="
                    highlightMatch(
                      parseFloat(item.accuracy).toFixed(2),
                      accuracy
                    )
                  "
                ></span>
              </div>
              <div>
                <span class="ttl">准确率：</span
                ><span
                  v-html="
                    highlightMatch(
                      parseFloat(item.precision).toFixed(2),
                      precision
                    )
                  "
                ></span>
              </div>
              <div>
                <span class="ttl">召回率：</span
                ><span
                  v-html="
                    highlightMatch(parseFloat(item.recall).toFixed(2), recall)
                  "
                ></span>
              </div>
              <div>
                <span class="ttl">创建时间：</span>{{ item.createtime }}
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
        <!-- 分页组件 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 60, 120]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredTaskList.length"
        />

        <el-dialog
          :visible.sync="resultDialogShow"
          v-if="resultDialogShow"
          style="width: 90%; height: auto; margin: 0 auto"
        >
          <div class="taskInfoBox taskname">
            <el-icon class="el-icon-edit-outline el-icon"></el-icon>
            <span>任务（模型）名称：</span>
            <span>{{ result.taskname }}</span>
          </div>
          <div class="taskInfoBox principal">
            <el-icon class="el-icon-user el-icon"></el-icon
            ><span>任务负责人：</span>
            <span>{{ result.leader }}</span>
          </div>
          <div
            class="taskInfoBox participants"
            v-if="result.participant !== null"
          >
            <el-icon class="el-icon-user-solid el-icon"></el-icon
            ><span>参与人：</span>
            <span>{{ result.participant }}</span>
          </div>
          <div class="taskInfoBox disease">
            <el-icon class="el-icon-price-tag el-icon"></el-icon
            ><span>研究病种：</span>
            <span>{{ result.disease }}</span>
          </div>
          <div class="taskInfoBox dataset">
            <el-icon class="el-icon-coin el-icon"></el-icon
            ><span>所用数据：</span>
            <span>{{ result.dataset }}</span>
          </div>
          <div class="taskInfoBox algorithm">
            <el-icon class="el-icon-cpu el-icon"></el-icon
            ><span>所用算法：</span>
            <span>{{ result.modelname }}</span>
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
            <el-icon class="el-icon-s-flag"></el-icon><span>目标因素：</span>
            <span>{{ result.targetcolumn.toString() }}</span>
          </div>
          <div class="taskInfoBox use_features">
            <el-icon class="el-icon-notebook-2 el-icon"></el-icon
            ><span>所用特征：</span>
            <span>{{ result.feature.toString() }}</span>
          </div>

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
import { treeData } from "@/components/tab/treeData.js";
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
    displayedTasks() {
      // 筛选和排序逻辑合并一处
      let filteredAndSortedList = this.taskList
        .filter((task) => {
          let diseaseMatch =
            this.disease === "" || task.disease === this.disease;
          let modelMatch =
            this.modelList.length === 0 ||
            this.modelList.includes(task.modelname);
          let datasetMatch =
            this.dataset === "" || task.dataset === this.dataset;
          let leaderMatch =
            this.leader === "" ||
            new RegExp(this.leader, "i").test(task.leader);
          let taskMatch =
            this.taskname === "" ||
            new RegExp(this.taskname, "i").test(task.taskname);
          return (
            diseaseMatch &&
            modelMatch &&
            datasetMatch &&
            leaderMatch &&
            taskMatch
          );
        })
        .sort((a, b) => new Date(b.createtime) - new Date(a.createtime));

      // 分页
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return filteredAndSortedList.slice(startIndex, endIndex);
    },
  },

  watch: {
    length(val) {
      this.$refs.listWrap.style.height = "720px";
      // // 超过10行数据，就按照最大40*10 400px高度的列表就行
      // if (val >= 10) {
      //   this.$refs.listWrap.style.height = '800px';
      // } else {
      // // 不足10行数据，这边 加57是因为表头的高度，具体情况
      //   this.$refs.listWrap.style.height = this.itemHeight * val + 80 + 'px'
      // }
    },
    filterText(val) {
      this.$refs.tree1?.filter(val);
      this.$refs.tree2?.filter(val);
      this.$refs.tree3?.filter(val);
    },
  },

  data() {
    return {
      isAllChecked: false, // 全选按钮的状态
      resultDialogShow: false,
      result: {},
      // treeData: [],
      diseaseNum: "",
      datasetNum: "",
      // treeData: JSON.parse(JSON.stringify(treeData)),
      treeData1: "",
      treeData2: "",
      treeData3: "",
      disease: "",
      leader: "",
      taskname: "",
      accuracy: "",
      precision: "",
      recall: "",
      tasknames: [],
      leaders: [],
      modelList: [],
      dataset: "",
      // taskList: JSON.parse(JSON.stringify(taskList)),
      taskList: [],
      filterText: "",
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
      currentPage: 1, // 当前页码
      pageSize: 15, // 默认每页显示的数量
    };
  },

  created() {
    this.init();
  },

  methods: {
    //和vuex内数据同步
    init() {
      this.$notify({
        title: "提示",
        message: "请选择一个训练好的任务进行下一步操作",
        type: "success",
      });
      this.predict_features = this.m_predict_features;
      this.predict_model_name = this.m_predict_model_name;
      this.predict_task_name = this.m_predict_task_name;
      this.DQN_selected = this.isModelListContainsDQN;
      this.DDPG_selected = this.isModelListContainsDDPG;
      this.PPO_selected = this.isModelListContainsPPO;
      this.KNN_selected = this.isModelListContainsKNN;
      this.SVM_selected = this.isModelListContainsSVM;
      this.RF_selected = this.isModelListContainsRF;

      this.getCatgory();
      this.getTaskList();

      console.log("当前模块名👉", this.moduleName);
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
      // 用于记录已经出现过的负责人名称
      var uniqueLeaders = {};
      // 遍历 this.taskList 对象的属性
      for (var key in this.taskList) {
        // 检查属性是否是对象自身的属性，而不是继承的属性
        if (this.taskList.hasOwnProperty(key)) {
          // 获取当前属性对应的对象
          var task = this.taskList[key];
          // 检查对象是否具有 leader 属性
          if (task.hasOwnProperty("leader")) {
            // 将负责人名称添加到临时对象中进行记录
            uniqueLeaders[task.leader] = true;
          }
        }
      }
      // 将记录的负责人名称转为数组形式
      this.leaders = Object.keys(uniqueLeaders).map(function (leader) {
        return { value: leader };
      });
      console.log("this.leaders", this.leaders);
    },

    getCatgory() {
      getCategory(`/api/category?uid=${this.loginUserID}`).then((response) => {
        this.treeData1 = response.data.slice(0, 1);
        this.treeData2 = response.data.slice(1, 2);
        this.treeData3 = response.data.slice(2, 3);
        console.log("this.treeData1", this.treeData1);
        console.log("this.treeData2", this.treeData2);
        console.log("this.treeData3", this.treeData3);
        // 获取病种和数据集总数
        this.diseaseNum = response.data[0].children.length;
        // response.data[0].children.length + response.data[1].children.length;
        getRequest("/api/getTableNumber").then((res) => {
          if (res.code == 200) this.datasetNum = res.data;
        });
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

    changeData(treeRef, node) {
      if (this.lastClickedNode && this.lastClickedNode === node) {
        // 如果当前节点已经被高亮，则取消高亮
        this.$refs[treeRef].setCurrentKey(null);
        this.lastClickedNode = null;
        this.disease = "";
        this.dataset = "";
      } else {
        // 高亮当前节点
        this.$refs[treeRef].setCurrentKey(node.id);
        this.lastClickedNode = node;
        if (node.isLeafs == 0) {
          this.disease = node.label;
          this.dataset = "";
        } else {
          this.dataset = node.label;
          this.disease = "";
        }
      }
    },
    changeData1(node) {
      this.changeData("tree1", node);
    },

    changeData2(node) {
      this.changeData("tree2", node);
    },

    changeData3(node) {
      this.changeData("tree3", node);
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

    // 处理页码改变
    handlePageChange(val) {
      this.currentPage = val;
    },
    // 处理每页显示数量改变
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1; // 页码重置为1，因为换了每页显示数量
    },

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
          this.predict_dataset = row.dataset;
          this.m_changeTaskInfo({
            predict_features: this.predict_features,
            predict_task_name: this.predict_task_name,
            predict_model_name: this.predict_model_name,
            predict_dataset: this.predict_dataset,
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
.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 50px;
  text-align: center;
}

.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
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
  height: auto;
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
  font-size: 25px;
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
  padding-top: 10px;
  width: 100%; /* 调整宽度 */
  height: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  margin-left: 10px;
  width: 95%;
  overflow-y: scroll; /* 或者 auto */
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
  position: relative;
  top: 0;
}

.taskCard:hover {
  top: -5px;
}

.el-card {
  border: 1px solid #fff !important;
  border-radius: 10px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  gap: 10px;
  margin-left: 10%;
}

.cardInfo > div:nth-child(9),
.cardInfo > div:nth-child(10) {
  grid-column: 1 / span 2;
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

.taskInfoBox {
  font-size: 20px;
}
.taskInfoBox .el-icon {
  margin-right: 5px;
}

.ttl {
  font-weight: 600;
  /* font-size: 20px; */
  color: #071135;
}

.text-red {
  color: red;
}
.taskCard-item {
  opacity: 0;
  transform: translateY(100%); /* 初始位置设为屏幕之外 */
  animation: fadeInUp 1s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.el-pagination {
  display: flex;
  justify-content: right;
}
</style>