<template>
  <div class="main">
    <div class="left_tree">
      <div class="tipInfo">
        <h3>病种、数据集选择</h3>
        <span class="statistic"> 一级病种: {{ diseaseNum }} 个 </span>
        <span class="statistic"> 数据表: {{ datasetNum }} 个 </span>
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
      <template slot="default" slot-scope="{ node }">
          <span
            :style="{
              fontWeight: node.level === 1 ? 'bold' : 'normal',
              fontSize: node.level === 1 ? '17px' : 'inherit',
            }"
            >{{ node.label }}</span
          >
        </template>
        <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="text"
              @click="() => remove(node, data)"
            >
            </el-button>
          </span>
        </span> -->
      </el-tree>
      <el-dialog title="提示" :visible.sync="dialogDiseaseVisible" width="30%">
        <span>
          请输入新病种名称：<el-input
            placeholder="请输入内容"
            v-model="diseaseName"
            class="nameInput"
          ></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="() => append()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="right">
      <!--==========================     头部按钮     ==============================================================-->
      <div id="top_buttons">
        <div id="task_leader">
          <el-select v-model="leader" placeholder="请选择任务负责人">
            <el-option
              v-for="item in taskLeaderList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select v-model="leader" placeholder="请搜索任务名称">
            <el-option
              v-for="item in taskLeaderList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select v-model="leader" placeholder="请选择所用模型">
            <el-option
              v-for="item in taskLeaderList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select v-model="leader" placeholder="请选择创建时间">
            <el-option
              v-for="item in taskLeaderList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <el-button @click="clearFilter">清除</el-button>
        <el-popover placement="right" style="margin-left: 20px" trigger="hover">
          <div>跳转到模型训练进行新建任务</div>
          <el-button
            type="success"
            @click="navigateToModelTraining"
            slot="reference"
            >新建任务</el-button
          >
        </el-popover>
      </div>

      <!--===============================    卡片组     ==============================================================-->
      <div class="cardGroup">
        <el-card
          class="taskCard"
          v-for="item in taskList"
          :key="item.id"
          shadow="always"
          v-show="
            !(disease || leader) ||
            (disease == item.disease && !leader) ||
            (leader == item.leader && !disease) ||
            (disease == item.disease && leader == item.leader)
          "
        >
          <div class="cardInfo">
            <div><span class="ttl">任务名称：</span>{{ item.taskname }}</div>
            <div><span class="ttl">任务负责人：</span>{{ item.leader }}</div>
            <div><span class="ttl">所属疾病：</span>{{ item.disease }}</div>
            <div><span class="ttl">使用模型：</span>{{ item.modelname }}</div>
            <div><span class="ttl">数据表：</span>{{ item.dataset }}</div>
            <div><span class="ttl">创建时间：</span>{{ item.createtime }}</div>
          </div>
          <div class="editButton">
            <el-button
              size="mini"
              type="primary"
              @click="handleCheck(item)"
              style="margin-right: 20px"
              >查看</el-button
            >
            <el-popconfirm
              title="删除后无法恢复"
              icon="el-icon-warning"
              icon-color="red"
              @confirm="handleDelete(item)"
            >
              <el-button slot="reference" size="mini" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </div>
        </el-card>
      </div>

      <el-dialog
        :title="result.taskname"
        :visible.sync="resultDialogShow"
        v-if="resultDialogShow"
        width="32%"
        center
      >
        <div class="taskInfoBox principal">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">任务负责人：</span>
          <span>{{ result.leader }}</span>
        </div>
        <div
          class="taskInfoBox participants"
          v-if="result.participant !== null"
        >
          <span class="lineStyle">▍</span
          ><span class="featureTitle">参与人：</span>
          <span>{{ result.participant }}</span>
        </div>
        <div class="taskInfoBox disease">
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
        <!-- <div class="taskInfoBox algorithmValue">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">算法参数：</span>
          <span v-if="result.para[0] == ''">本算法没有参数</span>
          <div v-if="result.para[0] != ''">
            <div v-for="(item, index) in result.para" :key="index">
              <span
                >{{ result.para[index] }}：{{ result.paraValue[index] }}</span
              >
            </div>
          </div>
        </div> -->
        <div class="taskInfoBox target_features">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">目标因素：</span>
          <span>{{ result.targetcolumn.toString() }}</span>
        </div>
        <div class="taskInfoBox use_features">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用特征：</span>
          <span>{{ result.feature.toString() }}</span>
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
</template>

<script>
import { getRequest, deleteRequest } from "@/utils/api";
import { state } from "@antv/g2plot/lib/adaptor/common";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { getCategory } from "@/api/category";
import TaskCheck from "./subcomponents/TaskCheck";
import { treeData } from "@/components/tab/treeData.js";
// import { taskList } from "@/components/tab/constTaskList.js";



export default {
  components: {
    TaskCheck,
  },
  computed: {
    ...mapState(["taskList", , "treeData"]),
    ...mapGetters(["taskLeaderList", "taskDiseaseList"]),
    filteredTaskListByModel() {
      return this.taskList.filter((item) => item.modelname);
    },
  },
  mounted() {
    // this.getCatgory();
  },
  created() {
    this.getTaskList();

    // this.getTreeData();
  },
  data() {
    return {
      moduluName: "TaskManage",
      treeData: [],
      disease: "",
      leader: "",
      resultDialogShow: false,
      result: {},

      dialogDiseaseVisible: false,
      diseaseName: "",
      treeData: JSON.parse(JSON.stringify(treeData)),
      // taskList: JSON.parse(JSON.stringify(taskList)),

    };
  },

  methods: {
    ...mapActions(["getTaskList", , "getTreeData"]),
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
      // 发送删除请求到服务器
      deleteRequest(`Task/${row.id}`, row)
        .then((res) => {
          console.log("res:", res);
          if (res.code === 200) {
            // 删除成功，更新界面或者提示用户
            this.$message.success("删除成功");
            // 在界面上移除被删除的任务（可选）
            const index = this.tasks.indexOf(row);
            if (index !== -1) {
              this.tasks.splice(index, 1);
            }
          } else {
            // 删除失败，提示用户
            this.$message.error("删除任务失败");
          }
        })
        .catch((error) => {
          // 请求失败，提示用户
          this.$message.error("删除任务失败：" + error.message);
        });
    },

    getCatgory() {
      getCategory("/api/category").then((response) => {
        console.log(this.treeData);
        this.treeData = response.data;
      });
    },

    clearFilter() {
      this.disease = "";
      this.leader = "";
    },

    // changeData(node) {
    //   this.disease = node.label;
    // },
    changeData(node) {
      console.log("node: ", node);
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
  },
};
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 15% 85%;
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
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

.right {
  width: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

#top_buttons {
  margin-left: 3%;
  margin-bottom: 20px;
}

#top_buttons > * {
  display: inline-block;
}
#task_disease {
  margin-right: 40px;
}
#task_leader {
  margin-right: 20px;
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
  width: 100%;
  margin-left: 3%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-row-gap: 40px;
  grid-column-gap: 60px;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto; /* 定义四行，高度根据内容自适应 */
  gap: 10px; /* 定义网格行和列之间的间隙 */
}

.cardInfo > div:nth-child(5), /* 第五个子元素（数据表） */
.cardInfo > div:nth-child(6) /* 第六个子元素（创建时间） */ {
  grid-column: 1 / span 2; /* 这两个元素跨越两列 */
}

.ttl {
  font-weight: 600;
  color: #071135;
}

.editButton {
  margin-left: 30%;
  margin-top: 5%;
}

.icon {
  justify-self: end;
}
.taskCard {
  /* width: 110%; */
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
</style>
