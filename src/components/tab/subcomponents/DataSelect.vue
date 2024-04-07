<template >
  <div class="main" v-loading="next_loading">
    <div class="left_tree">
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
      </el-tree>
    </div>

    <div class="right_table">
      <el-card class="right_table_topCard">
        <div class="describe_content">
          <h3>{{ showDataForm.tableName }}</h3>
          <p style="margin-top: 0.5%">
            <i class="el-icon-user"></i>创建人:
            <span>{{ showDataForm.createUser }}</span>
            <i class="el-icon-time"></i>创建时间:
            <span>{{ showDataForm.createTime }}</span>
            <i class="el-icon-folder-opened"></i>所属类别:
            <span>{{ showDataForm.classPath }}</span>
          </p>
        </div>
        <!-- 显示表数据 -->
        <div class="tableData">
          <el-table
            :data="tableData"
            stripe
            v-loading="loading"
            style="width: 100%"
            class="custom-table"
            :header-cell-style="headerCellStyle"
          >
            <el-table-column
              v-for="(value, key) in tableData[0]"
              :key="key"
              :prop="key"
              :label="key"
              width="80"
              :show-overflow-tooltip="true"
              :sortable="true"
            >
              <template slot-scope="{ row }">
                <div class="truncate-text">{{ row[key] }}</div>
              </template>
              <template slot="header">
                <el-tooltip effect="dark" :content="getCount(key)" placement="top">
                  <div>{{ key }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <div class="buttonGroup">
        <el-button @click="backStep()" round>上一步</el-button>
        <el-button type="primary" @click="next(showDataForm.tableName)" round
          >确认</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// TODO:大数据预览卡顿， 需要做虚拟列表，动态渲染
import { getRequest, postRequest, saveParentDisease } from "@/api/user";
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
      loading:true,
      next_loading:false,

      chosenData: "",
      pageSize: 4,
      currentPage: 1,
      dataTotal: 0,
      getData_loading: false,
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
    this.getTableDescribe("1005", "copd");
    this.getTableData("1005", "copd");
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
          this.loading=false;
          // console.log("数据长度" + response.data.length);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCount(key) {
      // 在这里根据 key 计算对应属性的条数，并返回显示在 tooltip 中的内容
      return `条数: ${this.tableData.length}`;
    },

    // getData(tablename) {
    //   this.getData_loading = true;
    //   getRequest("/DataTable/getInfoByTableName", {
    //     tableName: tablename,
    //   }).then((res) => {
    //     this.patientTable = res.data;
    //     console.log("1111111",this.patientTable);
    //     this.getData_loading = false;
    //     this.dataTableVision = true;
    //   });
    // },

    changeData(data) {
      if (data.isLeafs == 1) {
        this.loading=true;
        this.tableData = [];
        //获取描述信息
        this.getTableDescribe(data.id, data.label);
        //获取数据信息
        this.getTableData(data.id, data.label);
        this.loading=false;
      }
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },

    // async next(name) {
    //   this.chosenData = name;
    //   // this.m_changeStep(3);
    //   this.m_changeTaskInfo({ dataset: this.chosenData,disease: this.m_disease });
    //   console.log("chosenData:", this.chosenData);
    //   postRequest("runtime_bus/getLackinfos_features", {
    //     tableName: this.chosenData,
    //     modename: "public",
    //   })
    //     .then((res) => {
    //       this.allFeatures = res;
    //       // console.log("this.allFeatures:", this.allFeatures);
    //       // console.log("data_select this.targetFeatures:", this.m_target_features);
    //     console.log("this.m_all_features:", this.m_all_features);
    //       this.m_changeTaskInfo({
    //         all_features: this.allFeatures,
    //       });
    //     })
    //     .catch((error) => {
    //       console.error(error); // 打印错误信息
    //     });

    //   postRequest("runtime_bus/getLackinfos_labels", {
    //     tableName: this.chosenData,
    //     modename: "public",
    //   })
    //     .then((res) => {
    //       this.targetFeatures = res;
    //       // console.log("this.targetFeatures:", this.targetFeatures);
    //       console.log("data_select this.targetFeatures:", this.m_target_features);
    //     // console.log("this.m_all_features:", this.m_all_features);
    //       this.m_changeTaskInfo({
    //         target_features: this.targetFeatures,
    //       });
    //     })
    //     .catch((error) => {
    //       console.error(error); // 打印错误信息
    //     });

    //     console.log("data_select—end this.targetFeatures:", this.m_target_features);
    //     console.log("this.m_all_features:", this.m_all_features);

    //     this.m_changeStep(3);

        
    // },
    async next(name) {
      this.next_loading=true;
    this.chosenData = name;
    this.m_changeTaskInfo({ dataset: this.chosenData, disease: this.m_disease });
    console.log("chosenData:", this.chosenData);
    
    try {
      // 等待第一个异步操作完成
      const resFeatures = await postRequest("runtime_bus/getLackinfos_features", {
        tableName: this.chosenData,
        modename: "public",
      });
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
      this.next_loading=false;
      this.m_changeStep(3);
      console.log("data_select—end this.targetFeatures:", this.m_target_features);
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
  grid-template-columns: 12% 85%;
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
  width: 200px;
  margin-top: 5vh;
  margin-left: auto;
  margin-right: auto;
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
  display: inline-block;
  height: auto;
  width: 100%;
}

.right_table_topCard {
  padding: 0;
  height: auto;
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  left: 1%;
}

.describe_content {
  display: inline-block;
  width: 70%;
}

.describe_content span {
  margin: 10px;
}
</style>
