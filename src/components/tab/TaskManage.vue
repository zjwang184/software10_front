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
      <!--==========================     头部搜索框     ==============================================================-->
      <div class="search-input">
        <div>
          本页面可进行历史任务的查看和删除，您可根据任务名称、负责人、所用算法、疾病名称、数据集等条件筛选任务，筛选结果由创建时间由远及近排列
        </div>
        <div>
          <span id="search-taskname">
            <i class="el-icon-edit-outline"></i> 任务名称：
            <el-autocomplete
              v-model="taskname"
              placeholder="请输入任务名称进行搜索"
              clearable
              style="width: auto"
              :fetch-suggestions="searchTasknames"
              @select="handleSelect"
            ></el-autocomplete>
          </span>
          <span id="search-leader">
            <i class="el-icon-user"></i> 任务负责人：
            <el-autocomplete
              v-model="leader"
              placeholder="请输入任务负责人进行搜索"
              clearable
              style="width: auto"
              :fetch-suggestions="searchLeaders"
              @select="handleSelect"
            ></el-autocomplete>
          </span>
          <span id="search-modelname">
            <i class="el-icon-price-tag"></i> 所用算法：
            <el-autocomplete
              v-model="modelname"
              placeholder="请输入所用算法进行搜索"
              clearable
              style="width: auto"
              :fetch-suggestions="searchmodelnames"
              @select="handleSelect"
            ></el-autocomplete>
          </span>
          <el-button @click="clearFilter">清除条件</el-button>
          <div style="float: right">
            <el-popover placement="bottom" trigger="hover">
              <div>跳转到模型训练进行新建任务</div>
              <el-button
                type="success"
                @click="navigateToModelTraining"
                slot="reference"
                >新建任务</el-button
              >
            </el-popover>
          </div>
        </div>

        <!-- <span id="search-modelname">
            <i class="el-icon-date"></i> 创建时间：
            <el-date-picker
              style="display: inline-block; width: 300px"
              v-model="createtime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </span> -->
        <div style="margin-top: 10px">
          筛选结果：
          <span style="color: red">{{ filteredTaskList.length }} </span>
          个任务
        </div>
      </div>

      <!--===============================    卡片组     ==============================================================-->
      <div class="cardGroup">
        <!-- 任务卡片循环，现在基于分页后的数据 -->
        <el-card
          v-for="item in displayedTasks"
          :key="item.id"
          class="taskCard taskCard-item"
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
              <span class="ttl">所属疾病：</span>
              <span v-html="highlightMatch(item.disease, disease)"></span>
            </div>
            <div>
              <span class="ttl">所用算法：</span>
              <span v-html="highlightMatch(item.modelname, modelname)"></span>
            </div>
            <div>
              <span class="ttl">数据表：</span
              ><span v-html="highlightMatch(item.dataset, dataset)"></span>
            </div>
            <div>
              <span class="ttl">精确率：</span
              ><span
                v-html="
                  highlightMatch(parseFloat(item.accuracy).toFixed(2), accuracy)
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
            <div><span class="ttl">创建时间：</span>{{ item.createtime }}</div>
          </div>
          <span class="buttonGroup">
            <el-popover placement="top" trigger="hover">
              <div>点击查看任务详情</div>
              <el-button
                slot="reference"
                type="primary"
                @click="handleCheck(item)"
                round
                >查看</el-button
              >
            </el-popover>
            <span style="margin: 10px"></span>

            <el-button type="danger" @click="handleDelete(item)" round
              >删除</el-button
            >
          </span>
        </el-card>
      </div>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredTaskList.length"
      />
    </div>
  </div>
</template>


<script>
import { getRequest, deleteRequest } from "@/utils/api";
import { state } from "@antv/g2plot/lib/adaptor/common";
import { getCategory } from "@/api/category";
import TaskCheck from "./subcomponents/TaskCheck";
// import { treeData } from "@/components/tab/treeData.js";
// import { taskList } from "@/components/tab/constTaskList.js";

export default {
  name: "TaskManage",
  components: {
    TaskCheck,
  },
  computed: {
    filteredTaskList() {
      // 进行筛选
      let filteredList = this.taskList.filter((task) => {
        let diseaseMatch = this.disease === "" || task.disease === this.disease;
        let modelMatch =
          this.modelname === "" || this.modelname === task.modelname;
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
            this.modelname === "" || task.modelname === this.modelname;
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

  created() {
    this.init();
    // this.getTreeData();
  },
  data() {
    return {
      moduluName: "TaskManage",
      treeData: [],
      treeData1: [],
      treeData2: [],
      treeData3: [],
      taskList: [],
      modelname: "",
      disease: "",
      dataset: "",
      leader: "",
      taskname: "",
      accuracy: "",
      precision: "",
      recall: "",
      diseaseNum: "",
      datasetNum: "",
      filterText: "",
      resultDialogShow: false,
      result: {},

      dialogDiseaseVisible: false,
      diseaseName: "",
      // treeData: JSON.parse(JSON.stringify(treeData)),
      // taskList: JSON.parse(JSON.stringify(taskList)),
      currentPage: 1, // 当前页码
      pageSize: 20, // 默认每页显示的数量
    };
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

  methods: {
    init() {
      console.log("进入到历史任务查看界面");
      this.$notify({
        title: "提示",
        message: "您可在此页面查看和删除历史任务",
        type: "success",
      });
      this.getCatgory();
      this.getTaskList();
    },
    // ...mapActions(["getTaskList", , "getTreeData"]),
    // ...mapMutations(["SetTaskList"]),
    // getTreeData()
    // {
    //   getRequest("nodes/all").then((res) => {
    //     if(res.code == 200)
    //     {
    //       this.treeData = res.data;
    //     }
    //     else{
    //       this.$message.error("获取树形结构数据失败");
    //     }
    //   });
    // },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    navigateToModelTraining() {
      // 使用 $router.push() 方法导航到目标路由路径
      this.$router.push("/sideBar/ModelTraining");
    },
    handleCheck(row) {
      // 显示 loading
      this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      // 发送请求
      getRequest(`Task/result/${row.id}`)
        .then((res) => {
          if (res.code === 200) {
            // 更新数据
            this.result = res.data;
            // console.log("result", this.result);
            if (this.result.feature !== null) {
              this.result.feature = this.result.feature.split(",");
            }
            // this.resultDialogShow = true;

            // 构造目标路由
            const routeData = {
              path: "/tab/subcomponents/TaskCheck",
              query: { result: this.result },
            };

            // 隐藏 loading
            this.$loading().close();

            // 跳转页面
            this.$router.push(routeData);
          } else {
            // 请求失败
            this.$loading().close();
            this.$message.error("查看任务失败");
          }
        })
        .catch((error) => {
          // 请求异常
          this.$loading().close();
          console.error("请求出错:", error);
          this.$message.error("查看任务失败");
        });
    },

    handleDelete(row) {
      console.log("row", row);
      console.log("token:", sessionStorage.getItem("token"));
      // 发送删除请求到服务器
      getRequest(`Task/delete/${row.id}`, row)
        .then((res) => {
          console.log("res:", res);
          if (res.code === 200) {
            // 删除成功，更新界面或者提示用户
            this.$message.success("删除成功");
            this.getTaskList();
          } else {
            // 删除失败，提示用户
            this.$message.error("删除任务失败");
          }
        })
        .catch((error) => {
          // 请求失败，提示用户
          // this.$message.error("删除任务失败：" + error.message);
        });
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

    getTaskList() {
      getRequest("/Task/all")
        .then((res) => {
          this.taskList = res.data;
          this.getTasknames();
          this.getLeaders();
          this.getmodelnames();
          console.log("this.taskList", this.taskList);
          console.log("displayedTasks", this.displayedTasks);
        })
        .catch((err) => {
          console.log("任务列表获取错误，请联系管理员。");
          console.log(err);
        });
    },
    getUniqueValues(propertyName) {
      // 用于记录已经出现过的属性值
      var uniqueValues = {};
      // 遍历 this.taskList 对象的属性
      for (var key in this.taskList) {
        // 检查属性是否是对象自身的属性，而不是继承的属性
        if (this.taskList.hasOwnProperty(key)) {
          // 获取当前属性对应的对象
          var task = this.taskList[key];
          // 检查对象是否具有指定属性
          if (task.hasOwnProperty(propertyName)) {
            // 将属性值添加到临时对象中进行记录
            uniqueValues[task[propertyName]] = true;
          }
        }
      }
      // 将记录的属性值转为数组形式
      return Object.keys(uniqueValues).map(function (value) {
        return { value: value };
      });
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

    getTasknames() {
      this.tasknames = this.getUniqueValues("taskname");
    },

    getLeaders() {
      this.leaders = this.getUniqueValues("leader");
    },

    getmodelnames() {
      this.modelnames = this.getUniqueValues("modelname");
    },

    clearFilter() {
      this.disease = "";
      this.leader = "";
      this.taskname = "";
      this.modelname = "";
      this.$refs.tree1.setCurrentKey(null);
      this.$refs.tree2.setCurrentKey(null);
      this.$refs.tree3.setCurrentKey(null);
    },

    searchData(queryString, data, cb) {
      var results = queryString
        ? data.filter(this.createFilter(queryString))
        : data;
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
    searchTasknames(queryString, cb) {
      this.searchData(queryString, this.tasknames, cb);
    },
    searchLeaders(queryString, cb) {
      this.searchData(queryString, this.leaders, cb);
    },
    searchmodelnames(queryString, cb) {
      this.searchData(queryString, this.modelnames, cb);
    },

    highlightMatch(text, query) {
      if (!query) return text; // 如果查询字符串为空，则返回原始文本
      const regex = new RegExp(query, "gi");
      return text.replace(
        regex,
        (match) => `<span style="color:red;">${match}</span>`
      );
    },
    handleSelect(item) {
      // 处理选中联想项的逻辑
      console.log("选中的任务项:", item);
    },
  },
};
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 15% 82%;
  height: 100%;
  width: 90vw;
  overflow-y: auto;
}
.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 50px;
  text-align: center;
  border-radius: 5px;
}

.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
}
.left_tree {
  border-radius: 5px;
  border: 1px solid #fff;
  box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.3); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
  overflow-y: scroll; /* 或者 auto */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.right {
  margin-left: 3%;
  width: 95%;
  height: auto;
}
.right .el-select {
  margin-right: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
  overflow: hidden;
}

.custom-tree-node .left_span {
  width: 12em;
  overflow: hidden;
}

.nodeLabel,
.scrolling-nodeLabel {
  display: inline-block;
  white-space: nowrap; /* 禁止文本换行 */
  box-sizing: border-box; /* 边框和内填充的宽度也包含在width内 */
}

/* 文本滚动 */
.scrolling-nodeLabel:hover {
  position: relative;
  overflow: hidden;
  vertical-align: text-bottom;
  animation: scrollText 3s linear infinite; /* 动画持续时间和循环方式 */
}

@keyframes scrollText {
  0% {
    transform: translateX(0px);
  }
  12% {
    transform: translateX(0px);
  }
  75% {
    transform: translateX(calc(-100% + 12em));
  }
  100% {
    transform: translateX(calc(-100% + 12em));
  }
}

.search-input {
  margin-bottom: 20px;
}

.search-input div:first-child {
  background-color: rgba(99, 97, 97, 0.1);
  margin-bottom: 10px;
  padding: 10px;
  height: 40px;
  text-align: center;
}

.search-input div:nth-child(2) span,
.search-input div:nth-child(2) .el-button {
  margin-right: 15px;
  margin-bottom: 10px;
}

#top_buttons > * {
  display: inline-block;
}
#task_disease {
  margin-right: 40px;
}

#table {
  margin-top: 10px;
}
.lineStyle {
  color: rgb(100, 172, 231);
}
.featureTitle {
  font-weight: 800;
}
.cardGroup {
  padding-top: 10px;
  width: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  overflow-y: scroll; /* 或者 auto */
  /* scrollbar-width: none; 
  -ms-overflow-style: none; */
}
.cardGroup .card {
  max-height: 400px; /* 新增这一行来限制卡片的高度 */
  overflow-y: auto; /* 可选，为卡片内容添加滚动条如果内容超出300px */
}

.cardGroup::-webkit-scrollbar {
  display: none;
}

.cardGroup .el-pagination {
  margin-top: 10px;
  margin-left: 10px;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto; /* 定义四行，高度根据内容自适应 */
  gap: 10px; /* 定义网格行和列之间的间隙 */
}

.cardInfo > div:nth-child(9),
.cardInfo > div:nth-child(10) {
  grid-column: 1 / span 2; /* 这两个元素跨越两列 */
}
.buttonGroup {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
  margin-bottom: 0;
}

.el-pagination {
  margin-top: 10px;
  float: right;
}

.ttl {
  font-weight: 600;
  color: #071135;
}

.icon {
  justify-self: end;
}
.taskCard {
  margin-bottom: 10px;
  margin-left: 10px;
  width: 95%;
  height: auto;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  top: 0;
}

.taskCard:hover {
  top: -5px;
}

.el-card {
  border: 1px solid #fff !important;
  border-radius: 10px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4) !important; /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1) !important;
}

/* 修改树形控件高亮颜色 */
::v-deep.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #ffffff;
  background: #62a2e7 !important;
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
</style>
