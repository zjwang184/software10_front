<template >
  <div class="main" v-loading="next_loading">
    <div class="left_tree">
      <div class="tree-top">
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
        @check-change="handleCheckChange"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span
            :style="{
              fontWeight: node.level === 1 ? 'bold' : 'normal',
              fontSize: node.level === 1 ? '20px' : 'inherit',
            }"
            >{{ node.label }}</span
          >
        </span>
      </el-tree>
    </div>

    <div class="right_table">
      <!--------------------------------- 数据集预览头部 ----------------------------------------------->
      <div class="describe_content">
        <div></div>
        <h2 style="text-align: center">
          <i class="el-icon-s-data"></i>数据集预览
        </h2>
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
        <div>
          <i class="el-icon-folder-opened"></i>所属类别:
          <span>{{ showDataForm.classPath }}</span>
        </div>
        <div>
          <i class="el-icon-date"></i>特征个数:
          <!-- <span >{{ showDataForm.classPath }}</span> -->
        </div>
        <div>
          <i class="el-icon-coin"></i>样本条数:
          <span>{{ showDataForm.dataLength }}</span>
        </div>
      </div>
      <!-- 点击左树之前显示的提示内容 -->
      <div>
        <div v-if="!selectedDataset">
          <div
            class="container"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              font-size: 24px;
              background-color: #f2f2f2;
            "
          >
            <div class="blinking-text" style="margin-top: 20px">
              请点击左边树节点选择数据集
            </div>
            <img src="@/assets/暂无数据_(1).png" class="imgStyle" />
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
  },

  data() {
    return {
      getData_loading: true,
      next_loading: false,
      selectedDataset: false,
      dataLoaded: false, //骨架屏加载
      chosenData: "",
      disease: "",
      dataset: "",
      nodeid: "",
      pageSize: 4,
      currentPage: 1,
      dataTotal: 0,

      dataTableVision: false,
      patientTable: [],
      allFeatures: [],
      list: [],
      showDataForm: {
        tableName: "",
        createUser: "",
        createTime: "",
        classPath: "",
      },
      showList: [],

      tableData: [],
      treeData: [],
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

    this.getCatgory();
    if (this.m_nodeid != "") {
      console.log("dataselect nodeid", this.m_nodeid);
      this.getTableDescribe(this.m_nodeid, this.m_dataset);
      this.getTableData(this.m_nodeid, this.m_dataset);
    } else {
      // this.getTableDescribe("1772547909817176066", "diabetes10");
      // this.getTableData("1772547909817176066", "diabetes10");
    }
    this.getData_loading = false;
  },

  methods: {
    init() {
      for (const item of this.m_dataList) {
        if (item.disease === this.m_disease) {
          this.list.push(item);
        }
      }
      if (this.list.length < 1) {
        // this.$message({
        //   message: "该病种没有数据，请上传",
        //   type: "warning",
        // });
        return false;
      }
      this.dataTotal = this.list.length;
    },

    getCatgory() {
      getCategory("/api/category").then((response) => {
        this.treeData = response.data;
      });
    },

    getTableDescribe(id, label) {
      this.showDataForm.tableName = label;
      getTableDes("/api/tableDescribe", id)
        .then((response) => {
          this.showDataForm.createUser = response.data.createUser;
          this.showDataForm.createTime = response.data.createTime;
          this.showDataForm.classPath = response.data.classPath;
          // this.tableData = [];
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
          this.dataLoaded = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeData(data) {
      if (data.isLeafs == 1) {
        //数据获取前显示骨架屏
        this.dataLoaded = false;
        //获取描述信息
        this.getTableDescribe(data.id, data.label);
        //获取数据信息
        this.getTableData(data.id, data.label);
        //显示表数据
        this.selectedDataset = true;
        console.log("this.showDataForm2222", this.showDataForm);
      }
    },

    handleCheckChange(data, checked) {
      this.getData_loading = true;
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
      this.getData_loading = false;
    },
    async next(name) {
      if (!name) {
        this.$message({
          message: '请先选择数据！',
          type: 'warning'
        });
        return;
      }

      this.next_loading = true;
      this.chosenData = name;
      // 如果选择了和缓存不一样的数据则进行重置
      this.m_reset_state_from_datasets();

      this.m_changeTaskInfo({
        dataset: this.chosenData,
        disease: this.disease,
        nodeid: this.nodeid,
      });
      console.log(
        "chosenData:",
        this.chosenData,
        " disease:",
        this.disease,
        " nodeid:",
        this.nodeid
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
        this.m_changeTaskInfo({
          all_features: this.allFeatures,
        });
        // 等待第二个异步操作完成
        const resLabels = await postRequest("runtime_bus/getLackinfos_labels", {
          tableName: this.chosenData,
          modename: "public",
        });
        this.targetFeatures = resLabels;
        this.m_changeTaskInfo({
          target_features: this.targetFeatures,
        });

        // 确保所有异步操作完成后再进行下一步
        this.next_loading = false;
        this.m_changeStep(3);
        console.log(
          "data_select—end this.targetFeatures:",
          this.m_target_features
        );
        console.log("this.m_all_features:", this.m_all_features);
      } catch (error) {
        console.error(error); // 如果异步请求出错，打印错误信息
      }
    },

    backStep() {
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
  height: 70vh;
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
  bottom: 6vh; /* 距离页面底部 10vh */
  left: 55%;
  transform: translateX(-50%); /* 水平居中 */
  width: 200px;
  z-index: 9999; /* 置于最顶层 */
  margin-left: 6%;
}

.left_tree {
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
  overflow-y: scroll; /* 或者 auto */
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
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
  font-weight: bold;
}
.describe_content {
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  color: #000000;
  border-radius: 6px;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: rgba(146, 145, 145, 0.3);
  display: sticky;
  top: 0;
}
.describe_content i {
  margin: 0 5px;
}
.describe_content span {
  margin-right: 25px;
  color: rgb(40, 39, 39);
  font-weight: 100;
}

.blinking-text {
  animation: blink-animation 1s infinite alternate; /* 定义闪烁动画 */
}
@keyframes blink-animation {
  from {
    opacity: 1; /* 起始状态为不透明 */
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

.tree-top {
  background-color: rgba(146, 145, 145, 0.3);
  width: 100%;
  border: 1px solid #fff;
  border-radius: 10px;
}

/* 隐藏浏览器滚动条 */

.scrollHidden {
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}
.imgStyle {
  width: 40%;
  border-radius: 15px;
}
</style>
