<template>
  <div
    class="main"
    v-loading="next_loading"
    element-loading-text="正在加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="left_tree">
      <div class="tree-top">
        <div class="tipInfo">
          <h3>可选数据</h3>
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
          :default-expanded-keys="expandedKeys"
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

    <div class="right_table">
      <!--------------------------------- 数据集预览头部 ----------------------------------------------->
      <div class="describe_content">
        <div></div>
        <h3 style="text-align: center">
          <i class="el-icon-s-data"></i>数据集预览
        </h3>
        <div></div>
        <div>
          <i class="el-icon-folder"></i>数据集名称:
          <span>{{ showDataForm.tableName }}</span>
        </div>
        <div>
          <i class="el-icon-user"></i>创建人:
          <span>{{ showDataForm.createUser }}</span>
        </div>
        <div>
          <i class="el-icon-time"></i>创建时间:
          <span>{{ showDataForm.createTime }}</span>
        </div>
        <!-- <div>
          <i class="el-icon-folder-opened"></i>所属类别:
          <span>{{ showDataForm.classPath }}</span>
        </div> -->
        <div>
          <i class="el-icon-date"></i>特征个数:
          <span>{{ showDataForm.columnCount }}</span>
        </div>
        <div>
          <i class="el-icon-coin"></i>样本条数:
          <span>{{ showDataForm.rowCount }}</span>
        </div>
      </div>
      <!-- 点击左树之前显示的提示内容 -->
      <div>
        <div v-if="!selectedDataset">
          <div class="table-container-before">
            <div class="blinking-text" style="margin-top: 20px">
              请点击左边树节点选择数据集
            </div>
            <br />
            <img src="@/assets/暂无数据.png" class="imgStyle" />
          </div>
        </div>
        <!----------- 显示表数据 -------------->
        <div v-else>
          <div class="table-container">
            <!---------------------------------- 骨架屏 --------------------------------->
            <el-skeleton
              v-if="!dataLoaded"
              style="width: 100%"
              :rows="30"
              animated
            />

            <el-table
              v-else
              :data="tableData"
              stripe
              class="custom-table"
              :header-cell-style="headerCellStyle"
              ref="scrollTable"
              height="700vh"
            >
              <el-table-column
                v-for="(value, key) in tableData[0]"
                :key="key"
                :prop="key"
                :label="key"
                width="auto"
                :show-overflow-tooltip="true"
                :sortable="true"
              >
                <template slot-scope="{ row }">
                  <div class="truncate-text">{{ row[key] }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="buttonGroup">
        <el-button @click="backStep()" round>上一步</el-button>
        <el-button type="primary" @click="next(showDataForm.tableName)" round
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// TODO:大数据预览卡顿， 需要做虚拟列表，动态渲染
import { getRequest, postRequest, getRequestWithRestful } from "@/api/user";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { getCategory } from "@/api/category";
import { getTableDes, getTableData } from "@/api/tableDescribe.js";
import { resetForm, debounce } from "@/components/mixins/mixin.js";
// import { treeData } from "@/components/tab/treeData.js";
// import { tableData, tableData2 } from "@/components/tab/TableData.js";

export default {
  name: "DataSelect",
  mixins: [resetForm, debounce, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "modelTraining",
    },
  },
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    headerCellStyle() {
      return {
        color: "black", // 设置表头文字颜色为白色
      };
    },

    loginUserID() {
      return sessionStorage.getItem("userid");
    },
  },

  data() {
    return {
      datasetNum: 0,
      diseaseNum: 0,

      treeData1: [],
      treeData2: [],
      treeData3: [],

      next_loading: false,

      selectedDataset: false,
      dataLoaded: false, //骨架屏加载
      chosenData: "",
      disease: "",
      dataset: "",
      nodeId: "",
      pageSize: 4,
      currentPage: 1,
      dataTotal: 0,
      filterText: "",

      dataTableVision: false,
      patientTable: [],
      allFeatures: [],
      list: [],
      showDataForm: {
        tableName: "",
        createUser: "",
        createTime: "",
        classPath: "",
        columnCount: "",
        rowCount: "",
      },
      showList: [],

      tableData: [],
      expandedKeys: ["1"], // 初始化展开的节点key
      // treeData: JSON.parse(JSON.stringify(treeData)),
    };
  },

  created() {
    this.init();
    // 检查重名的防抖函数
    this.checkTableName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
        newname: this.dialogForm.tableName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
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
      this.getCategory();
      this.synchronous();
      this.getTableData();
    },

    //显示表数据
    getTableData() {
      if (this.nodeId != "") {
        this.getTableDescribe(this.nodeId, this.chosenData);
        //显示表数据
        this.selectedDataset = true;
        this.dataLoaded = false;
        this.getTableData(this.nodeId, this.chosenData);
      }
      for (const item of this.m_dataList) {
        if (item.disease === this.disease) {
          this.list.push(item);
        }
      }
      if (this.list.length < 1) {
        return false;
      }
      this.dataTotal = this.list.length;
    },

    // 同步保存的信息
    synchronous() {
      this.chosenData = this.m_train_model.dataset;
      this.disease = this.m_train_model.disease;
      this.nodeId = this.m_train_model.nodeId;
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    getCategory() {
      getCategory(`/api/category?uid=${this.loginUserID}`).then((response) => {
        this.treeData1 = response.data.slice(0, 1);
        this.treeData2 = response.data.slice(1, 2);
        this.treeData3 = response.data.slice(2, 3);
        console.log("this.treeData1", this.treeData1);
        console.log("this.treeData2", this.treeData2);
        console.log("this.treeData3", this.treeData3);
        if (this.nodeId) {
          // 高亮tree1中的节点
          this.highlightNodeById(this.nodeId, "tree1", this.treeData1);

          // 高亮tree2中的节点
          this.highlightNodeById(this.nodeId, "tree2", this.treeData2);

          // 高亮tree3中的节点
          this.highlightNodeById(this.nodeId, "tree3", this.treeData3);
        }
        // 获取病种和数据集总数
        this.diseaseNum = response.data[0].children.length;
        // response.data[0].children.length + response.data[1].children.length;
        getRequest("/api/getTableNumber").then((res) => {
          if (res.code == 200) this.datasetNum = res.data;
        });
      });
    },
    getTableDescribe(id, label) {
      getTableDes("/api/tableDescribe", id)
        .then((response) => {
          // 将 JSON 字符串解析为对象
          var res = JSON.parse(response.data);
          console.log("res", res);
          this.showDataForm.tableName = res.tableName;
          this.showDataForm.createUser = res.createUser;
          this.showDataForm.createTime = res.createTime;
          this.showDataForm.classPath = res.classPath;
          this.showDataForm.columnCount = res.columnCount;
          this.showDataForm.rowCount = res.rowCount;
        })
        .catch((error) => {
          console.log("错误", error);
        });
    },
    getTableData(tableId, tableName) {
      getTableData("/api/getTableData", tableId, tableName)
        .then((response) => {
          // 获取表数据
          this.tableData = response.data;
          this.showDataForm.dataLength = response.data.length;
          this.selectedDataset = true;
          this.dataLoaded = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getParentLabel(parentId) {
      console.log();
      // 获取数据的上一级结点作为研究疾病
      getRequest("/api/sysManage/selectCategoryEntityById", {
        id: parentId,
      })
        .then((response) => {
          this.disease = response.data.label;
        })
        .catch((error) => {
          console.log(error, "getLabelBypid");
        });
    },

    changeData(treeRef, node) {
      if (this.currentHighlightedTree === treeRef) {
        // 如果当前节点属于已高亮的树，则取消高亮
        this.$refs[treeRef].setCurrentKey(null);
        this.lastClickedNode = null;
        this.currentHighlightedTree = null;
      } else if (
        !this.currentHighlightedTree ||
        this.currentHighlightedTree !== treeRef
      ) {
        // 如果不在限制内或者切换到新的树
        if (this.currentHighlightedTree) {
          // 取消之前高亮的树
          this.$refs[this.currentHighlightedTree].setCurrentKey(null);
        }
        // 高亮当前节点
        this.$refs[treeRef].setCurrentKey(node.id);
        this.lastClickedNode = node;
        this.currentHighlightedTree = treeRef;
      }
      if (node.isLeafs == 1) {
        //数据获取前显示骨架屏
        this.dataLoaded = false;
        //获取描述信息
        console.log("选择的结点数据", node);
        this.getParentLabel(node.parentId);
        this.getTableDescribe(node.id, node.label);
        //获取数据信息
        this.getTableData(node.id, node.label);
        //显示表数据
        this.selectedDataset = true;
        this.nodeId = node.id;
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
    // changeData(data) {
    //   if (data.isLeafs == 1) {
    //     //数据获取前显示骨架屏
    //     this.dataLoaded = false;
    //     //获取描述信息
    //     console.log("选择的结点数据", data);
    //     this.getParentLabel(data.parentId);
    //     this.getTableDescribe(data.id, data.label);
    //     //获取数据信息
    //     this.getTableData(data.id, data.label);
    //     //显示表数据
    //     this.selectedDataset = true;
    //     this.nodeId = data.id;
    //   }
    // },

    async next(name) {
      if (!name) {
        this.$message({
          message: "请先选择数据！",
          type: "warning",
        });
        return;
      }
      this.next_loading = true;
      this.chosenData = name;
      // 如果选择了和缓存不一样的数据则进行重置
      this.m_reset_train_select_data();

      this.m_changeModelTrain({
        dataset: this.chosenData,
        disease: this.disease,
        nodeId: this.nodeId,
      });
      console.log(
        "chosenData:",
        this.chosenData,
        " disease:",
        this.disease,
        " nodeId:",
        this.nodeId
      );

      try {
        // 等待第一个异步操作完成
        const resFeatures = await postRequest(
          "runtime_bus/getLackinfos_features",
          {
            tableName: this.chosenData,
            modename: "public",
          }
        );
        this.allFeatures = resFeatures;
        this.m_changeModelTrain({
          all_features: this.allFeatures,
        });
        // 等待第二个异步操作完成
        const resLabels = await postRequest("runtime_bus/getLackinfos_labels", {
          tableName: this.chosenData,
          modename: "public",
        });
        this.targetFeatures = resLabels;
        this.m_changeModelTrain({
          target_features: this.targetFeatures,
        });

        // 确保所有异步操作完成后再进行下一步
        this.next_loading = false;
        this.m_changeStep(3);
        this.$notify({
          title: "数据选择成功",
          message: "请选择特征进行下一步",
          type: "success",
        });
        console.log(
          "data_select—end this.targetFeatures:",
          this.m_train_model.target_features
        );
        console.log("this.m_all_features:", this.m_all_features);
      } catch (error) {
        console.error(error); // 如果异步请求出错，打印错误信息
      }
    },

    async highlightNodeById(nodeId, treeRef, treeData) {
      // 深度优先遍历树数据
      const findNodeAndHighlight = (nodeList) => {
        for (const node of nodeList) {
          this.$nextTick(() => {
            if (node.id === nodeId) {
              this.$refs[treeRef].setCurrentKey(node.id);
              return true; // 匹配到节点
            }
          });

          if (node.children) {
            // 继续遍历子节点
            if (findNodeAndHighlight(node.children)) {
              return true; // 在子树中找到，结束本次循环
            }
          }
        }
        return false; // 当前层级未找到
      };

      // 在组件挂载或需要时调用此方法
      findNodeAndHighlight(treeData);

      // 在找到节点并高亮后，确保节点被展开
      if (nodeId) {
        // 使用 $nextTick 确保 DOM 更新后再操作
        await this.$nextTick();
        const node = this.$refs[treeRef].store.nodesMap[nodeId];
        if (node && !this.expandedKeys.includes(nodeId)) {
          this.expandedKeys = [...new Set([...this.expandedKeys, nodeId])]; // 避免重复添加
        }
      }
    },

    backStep() {
      this.m_changeModelTrain({
        dataset: "",
        disease: "",
        nodeId: "",
      });
      console.log("this.m_dataset", this.m_train_model.dataset);
      console.log("this.m_disease", this.m_train_model.disease);
      console.log("this.m_nodeId", this.m_train_model.nodeId);
      this.m_changeStep(this.m_step - 1);
    },
  },
};
</script>

<style scoped>
#dataList {
  width: 80%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  margin-left: 100px;
}

.main {
  display: grid;
  grid-template-columns: 15% 85%;
  height: 85vh;
}

.bottom {
  margin-top: 13px;
  padding-bottom: 10px;
  line-height: 15px;
}
#dataList .button {
  padding: 0;
  float: right;
}

.buttonGroup {
  position: fixed;
  bottom: 2%;
  left: 55%;
  transform: translateX(-50%); /* 水平居中 */
  width: 200px;
  z-index: 9999; /* 置于最顶层 */
  margin-left: 6%;
}

.left_tree {
  display: inline-block;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.1);
  overflow-y: scroll; /* 或者 auto */
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
.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}

.treeArea {
  height: calc(820px - 93px); /* 93px是头部信息和按钮的高度 */
  overflow-y: scroll;
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
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
.right_table {
  display: grid;
  grid-template-rows: auto auto;
  height: auto;
  width: 98%;
  margin-left: 30px;
  overflow-y: hidden;
  border-radius: 3px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
  padding: 0 10px 10px 0;
  font-size: 20px;
}
.describe_content {
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  height: 15vh;
  color: #585858;
  background-color: rgba(124, 124, 124, 0.1);
}
.describe_content i {
  margin: 0 5px;
}
.describe_content span {
  margin-right: 13px;
}
.table-container-before {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 24px;
}
.blinking-text {
  color: #585858;
  animation: blink-animation 1s infinite alternate; /* 定义闪烁动画 */
}

@keyframes blink-animation {
  from {
    opacity: 0.9; /* 起始状态为不透明 */
  }
  to {
    opacity: 0.3; /* 终止状态为完全透明 */
  }
}

/* 修改树形控件高亮颜色 */
::v-deep.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #ffffff;
  background: #62a2e7 !important;
}

/* 隐藏浏览器滚动条 */

.scrollHidden {
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}
.imgStyle {
  width: 25%;
  margin-left: 50px;
}
</style>
