<template>
  <div class="main">
    <div class="left_tree">
      <el-tree
        ref="tree"
        :data="treeData"
        :show-checkbox="false"
        node-key="id"
        default-expand-all
        :expand-on-click-node="true"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="changeData"
      >
      </el-tree>
    </div>

    <div class="right">
      <!--===============================  头部按钮   ======================================================================-->
      <div id="top_buttons">
        <!-- <div id="model_state">
        <span>疾病名称：</span>
        <el-select
          v-model="disease_name"
          placeholder="请选择"
          @change="handleSelectionChange"
        >
          <el-option
            v-for="item in disease"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div> -->

        <div id="model_type">
          <span>危险因素：</span>
          <el-select v-model="risk" :clearable="true" filterable placeholder="请选择">
            <el-option
              v-for="item in risks"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <el-popover placement="right" trigger="hover">
          <div>根据左侧高亮病种及危险因素进行搜索</div>
          <el-button
            slot="reference"
            size="small"
            @click="searchByDisease(disease_name, risk)"
            type="primary"
            icon="el-icon-search"
            >搜索</el-button
          >
        </el-popover>
        <!-- <el-button
          size="small"
          @click="clearFilter"
          type="primary"
          icon="el-icon-delete"
          >清除</el-button
        > -->
        <el-button id="add" type="warning" size="middle" @click="add()"
          >添加知识</el-button
        >
      </div>
      <!--===============================   表格    ========================================================================-->
      <div id="table">
        <el-table
          :data="knowledges"
          style="width: 100%; text-align: center"
          stripe
          :cell-style="{ padding: '8px 0', textAlign: 'center' }"
          row-key="id"
          :header-cell-style="{
            background: '#58AAFF',
            color: '#fff',
            lineHeight: '12px',
            padding: '0px',
            height: '34px',
            textAlign: 'center',
          }"
        >
          <el-table-column label="序号" prop="id" width="80"> </el-table-column>
          <el-table-column
            label="疾病名称"
            prop="diseaseName"
            width="150"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="特征名称" prop="riskFactorsCn" width="150">
          </el-table-column>
          <!-- <el-table-column
            label="疾病描述"
            prop="disasterDesc"
            width="140"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column
            label="是否有异常范围"
            prop="isException"
            width="150"
          >
          </el-table-column>
          <el-table-column label="参考正常最低" prop="exceptionLow" width="150">
          </el-table-column>
          <el-table-column label="参考正常最高" prop="exceptionUp" width="150">
          </el-table-column>
          <!-- <el-table-column label="知识解释" prop="exceptionExplain" >  -->
          <!-- show-overflow-tooltip -->
          <!-- </el-table-column> -->
          <el-table-column label="来源" prop="resource"> </el-table-column>
          <!-- <el-table-column label="地址" prop="address" >
          </el-table-column> -->
          <!-- <el-table-column label="知识来源" prop="knowledgeResources" width="120"> </el-table-column> -->
          <!-- <el-table-column label="更新时间" prop="updateTime" width="120"> </el-table-column> -->

          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="params.pageNum"
          :page-size="params.pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>

      <!--===============================     编辑表单   ===================================================================-->
      <el-dialog title="编辑" :visible.sync="dialogFormVisible">
        <el-form
          :model="dialogForm"
          ref="dialogFormRef"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="疾病名称" prop="diseaseName">
            <el-input v-model="dialogForm.diseaseName"></el-input>
          </el-form-item>
          <el-form-item label="危险特征" prop="riskFactorsCn">
            <el-input v-model="dialogForm.riskFactorsCn"></el-input>
          </el-form-item>
          <el-form-item label="是否有异常范围" prop="isException">
            <el-input v-model.number="dialogForm.isException"></el-input>
          </el-form-item>

          <el-form-item label="低于正常值()" prop="exceptionLow">
            <el-input v-model.number="dialogForm.exceptionLow"></el-input>
          </el-form-item>

          <el-form-item label="高于正常值()" prop="exceptionUp">
            <el-input v-model.number="dialogForm.exceptionUp"></el-input>
          </el-form-item>
          <el-form-item label="知识解释" prop="exceptionExplain">
            <el-input v-model="dialogForm.exceptionExplain"></el-input>
          </el-form-item>
          <el-form-item label="知识来源" prop="resource">
            <el-input v-model="dialogForm.resource"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="dialogForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('dialogFormRef')" size="small"
            >清空</el-button
          >
          <el-button
            type="primary"
            @click="submitForm('dialogFormRef')"
            size="small"
            >保存</el-button
          >
        </div>
      </el-dialog>

      <!--===============================         添加表单     ===================================================================-->
      <el-dialog title="添加知识" :visible.sync="addVisible">
        <el-form
          :model="addForm"
          ref="addFormRef"
          :rules="rules2"
          label-width="80px"
        >
          <el-form-item label="疾病名称" prop="diseaseName">
            <el-input v-model="addForm.diseaseName"></el-input>
          </el-form-item>
          <el-form-item label="危险特征" prop="riskFactorsCn">
            <el-input v-model="addForm.riskFactorsCn"></el-input>
          </el-form-item>
          <el-form-item label="是否有异常范围" prop="isException">
            <el-input v-model.number="addForm.isException"></el-input>
          </el-form-item>

          <el-form-item label="低于正常值()" prop="exceptionLow">
            <el-input v-model.number="addForm.exceptionLow"></el-input>
          </el-form-item>
          <el-form-item label="高于正常值()" prop="exceptionUp">
            <el-input v-model.number="addForm.exceptionUp"></el-input>
          </el-form-item>
          <el-form-item label="知识解释" prop="exceptionExplain">
            <el-input v-model="addForm.exceptionExplain"></el-input>
          </el-form-item>
          <el-form-item label="知识来源" prop="resource">
            <el-input v-model="addForm.resource"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="addForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="resetaddForm('addFormRef')" size="small">清空</el-button> -->
          <el-button
            type="primary"
            @click="submitaddForm('addFormRef')"
            size="small"
            >保存</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
  
<script>
import { getRequest, postRequest } from "@/api/user";

export default {
  data() {
    return {
      moduleName: "exceptionFeature",
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      activeName: "first",
      treeData: [],

      // 异常指标知识
      knowledges: [],
      disease: [],
      disease_name: "",
      risk: "",
      risks: [],
      id: 0,
      /* 添加知识的表单 */
      addVisible: false,
      addForm: {
        diseaseName: "",
        riskFactorsCn: "",
        isException: 0,
        exceptionLow: 0,
        exceptionUp: 0,
        exceptionExplain: "",
        resource: "",
        address: "",
      },
      dialogForm: {
        diseaseName: "",
        riskFactorsCn: "",
        isException: 0,
        exceptionLow: 0,
        exceptionUp: 0,
        exceptionExplain: "",
        resource: "",
        address: "",
      },

      tableData: [],
      total: 0,
      search: "",
      dialogFormVisible: false,

      editIndex: -1,
      rules: {
        riskFactorsCn: [
          {
            required: true,
            message: "请选择危险因素",
            trigger: "blur",
          },
        ],
        diseaseName: [
          {
            required: true,
            message: "请输入疾病名称",
            trigger: "blur",
          },
        ],
        isException: [
          {
            required: true,
            message: "必须为数字值, 请输入1/0表示有无异常",
            type: "number",
            trigger: "blur",
          },
        ],
        exceptionLow: [
          {
            required: true,
            message: "必须为数字值, 请输入正常最低值",
            type: "number",
            trigger: "blur",
          },
        ],
        exceptionUp: [
          {
            required: true,
            message: "必须为数字值, 请输入正常最高值",
            type: "number",
            trigger: "blur",
          },
        ],
        exceptionExplain: [
          {
            required: true,
            message: "请输入疾病异常特征解释",
            trigger: "blur",
          },
        ],
        resource: [
          {
            required: true,
            message: "请输入疾病特征知识来源",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入疾病来源地址",
            trigger: "blur",
          },
        ],
      },
      rules2: {
        riskFactorsCn: [
          {
            required: true,
            message: "请选择危险因素",
            trigger: "blur",
          },
        ],
        diseaseName: [
          {
            required: true,
            message: "请输入疾病名称",
            trigger: "blur",
          },
        ],
        isException: [
          {
            required: true,
            message: "必须为数字值, 请输入1/0表示有无异常",
            type: "number",
            trigger: "blur",
          },
        ],
        exceptionLow: [
          {
            required: true,
            message: "必须为数字值, 请输入正常最低值",
            type: "number",
            trigger: "blur",
          },
        ],
        exceptionUp: [
          {
            required: true,
            message: "必须为数字值, 请输入正常最高值",
            type: "number",
            trigger: "blur",
          },
        ],
        exceptionExplain: [
          {
            required: true,
            message: "请输入疾病异常特征解释",
            trigger: "blur",
          },
        ],
        resource: [
          {
            required: true,
            message: "请输入疾病特征知识来源",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入疾病来源地址",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      //获取病种
      getRequest("/api/category2").then((response) => {
        this.treeData = response.data;
        console.log(typeof this.treeData);
        console.log("this.treeData", this.treeData);
      });
      // 获取知识信息
      getRequest("/ten/knowledge/e_features")
        .then((res) => {
          this.knowledges = res.data;
          this.total = res.data_length;
        })
        .catch((error) => {
          console.log(error);
        });

      // 获取知识库所有疾病
      getRequest("/ten/knowledge/disease")
        .then((res) => {
          this.disease = res.data;
        })
        .catch((error) => {
          console.log(error);
        });

      // 获取知识库所有危险因素
      getRequest("/ten/knowledge/risks")
        .then((res) => {
          this.risks = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    changeData(...theArgs) {
      this.disease_name = theArgs[0].label; //点击的节点的名字 `?diseaseName=${disease}`
      console.log("this.disease_name", this.disease_name);
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.disease_name = theArgs[0].label; //点击的节点的名字 `?diseaseName=${disease}`
        console.log("this.disease_name", this.disease_name);
      }
    },

    searchByDisease(disease_name, risks) {
      console.log("search By name risk", disease_name, risks);
      getRequest("/ten/knowledge/search", {
        disease_name: disease_name,
        risks: risks,
      })
        .then((res) => {
          this.knowledges = res.data;
          this.total = res.data_length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleEdit(index, row) {
      this.dialogForm = Object.assign({}, row);
      this.editIndex = index;
      this.dialogFormVisible = true;
      this.id = row.id;
      console.log(this.id);
    },

    /* 指定位置，删除指定数组的一个元素 */
    handleDelete(index, id) {
      console.log("delete", index, id);
      this.knowledges.splice(index, 1);

      getRequest("/ten/knowledge/delete/" + id)
        .then((res) => {
          console.log("删除成功");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleSelectionChange() {
      console.log("选中的值为：", this.disease_name);
    },
    // clearFilter() {
    //   this.disease_name = "";
    //   this.risk = "";
    // },
    resetForm() {
      this.dialogForm.diseaseName = "";
      this.dialogForm.riskFactorsCn = "";
      this.dialogForm.isException = "";
      this.dialogForm.exceptionLow = "";
      this.dialogForm.exceptionUp = "";
      this.dialogForm.exceptionExplain = "";
      this.dialogForm.resource = "";
      this.dialogForm.address = "";
    },
    submitForm() {
      console.log("editIndex:", this.editIndex);
      console.log("tableData:", this.tableData);

      this.$refs.dialogFormRef.validate((valid) => {
        if (valid) {
          if (this.editIndex !== -1) {
            this.knowledges[this.editIndex].diseaseName =
              this.dialogForm.diseaseName;
            this.knowledges[this.editIndex].riskFactorsCn =
              this.dialogForm.riskFactorsCn;
            this.knowledges[this.editIndex].isException =
              this.dialogForm.isException;
            this.knowledges[this.editIndex].exceptionLow =
              this.dialogForm.exceptionLow;
            this.knowledges[this.editIndex].exceptionUp =
              this.dialogForm.exceptionUp;
            this.knowledges[this.editIndex].exceptionExplain =
              this.dialogForm.exceptionExplain;
            this.knowledges[this.editIndex].resource = this.dialogForm.resource;
            this.knowledges[this.editIndex].address = this.dialogForm.address;

            getRequest("/ten/knowledge/update", {
              id: this.id,
              diseaseName: this.dialogForm.diseaseName,
              riskFactorsCn: this.dialogForm.riskFactorsCn,
              isException: this.dialogForm.isException,
              exceptionLow: this.dialogForm.exceptionLow,
              exceptionUp: this.dialogForm.exceptionUp,
              exceptionExplain: this.dialogForm.exceptionLow,
              resource: this.dialogForm.resource,
              address: this.dialogForm.address,
            })
              .then((res) => {
                console.log("submitForm", this.knowledges);
                this.knowledges = res.data;
                this.total = res.data_length;
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            this.tableData.push({
              danger: this.dialogForm.danger,
              illnessName: this.dialogForm.illnessName,
            });
          }
          this.dialogFormVisible = false;
          this.editIndex = -1;
          this.resetForm();
        } else {
          console.log("submit failed");
        }
      });
    },
    submitaddForm() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          getRequest("/ten/knowledge/add", {
            // "id": this.id,
            diseaseName: this.addForm.diseaseName,
            riskFactorsCn: this.addForm.riskFactorsCn,
            isException: this.addForm.isException,
            exceptionLow: this.addForm.exceptionLow,
            exceptionUp: this.addForm.exceptionUp,
            exceptionExplain: this.addForm.exceptionLow,
            resource: this.addForm.resource,
            address: this.addForm.address,
          })
            .then((res) => {
              console.log("submitaddForm", this.knowledges);
              this.knowledges = res.data;
              this.total = res.data_length;
            })
            .catch((error) => {
              console.log(error);
            });

          this.addVisible = false;
          this.resetForm();
        } else {
          console.log("submit failed");
        }
      });
    },
    handleSizeChange(size) {
      this.params.pageNum = 1;
      this.params.pageSize = size;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.getList();
    },
    add() {
      this.addVisible = true;
      this.resetForm();
    },
  },
};
</script>
  
<style scoped>
.main {
  display: grid;
  grid-template-columns: 15% 85%;
  height: auto;
  overflow-y: hidden; /* 隐藏垂直滚动条 */
  overflow-x: hidden;
}

.left_tree {
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
  overflow-y: scroll; /* 或者 auto */
  scrollbar-width: none; /* 隐藏 Firefox 的滚动条 */
  -ms-overflow-style: none; /* 隐藏 IE/Edge 的滚动条 */
}

.right {
  /* display: grid; */
  /* grid-template-rows: auto 15% auto auto; */
  margin-left: 30px;
}

/* 修改树形控件高亮颜色 */
::v-deep.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #ffffff;
  background: #62a2e7 !important;
}

#top_buttons > * {
  display: inline-block;
}

#model_state {
  margin-right: 40px;
}

#model_type {
  margin-right: 20px;
}

#top_right_buttons {
  float: right;
  margin-right: 100px;
}

#table {
  margin-top: 10px;
}
#add {
  float: right;
  margin-right: 1vw;
}
</style>
  