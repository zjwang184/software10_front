<template>
  <div class="main">
    <div class="treeArea">
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
          <!-- <span>
              <el-popconfirm
                confirm-button-text="上传数据集"
                cancel-button-text="纳排数据集"
                title="请选择添加数据集方式"
                cancel-button-type="primary"
                @confirm="importData"
                @cancel="openAddDataForm(data.label)"
              >
                <el-button
                  v-if="
                    data.catLevel != 1 && data.status != 2 && data.isLeafs == 0
                  "
                  icon="el-icon-circle-plus-outline"
                  size="mini"
                  type="text"
                  slot="reference"
                  @click="markNode(data)"
                >
                </el-button>
              </el-popconfirm>

              <el-popconfirm
                title="删除后无法恢复"
                icon="el-icon-warning"
                icon-color="red"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="() => remove(node, data)"
              >
                <el-button
                  v-if="
                    (data.isLeafs == 1 && data.status == 0) ||
                    (data.uid == loginUserID && data.status != 2)
                  "
                  icon="el-icon-delete"
                  size="mini"
                  type="text"
                  slot="reference"
                >
                </el-button>
              </el-popconfirm>
            </span> -->
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

          <!-- <span>
              <el-popconfirm
                confirm-button-text="上传数据集"
                cancel-button-text="纳排数据集"
                title="请选择添加数据集方式"
                cancel-button-type="primary"
                @confirm="importData"
                @cancel="openAddDataForm(data.label)"
              >
                <el-button
                  v-if="
                    data.catLevel != 1 && data.status != 2 && data.isLeafs == 0
                  "
                  icon="el-icon-circle-plus-outline"
                  size="mini"
                  type="text"
                  slot="reference"
                  @click="markNode(data)"
                >
                </el-button>
              </el-popconfirm>

              <el-popconfirm
                title="删除后无法恢复"
                icon="el-icon-warning"
                icon-color="red"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="() => remove(node, data)"
              >
                <el-button
                  v-if="
                    (data.isLeafs == 1 && data.status == 0) ||
                    (data.uid == loginUserID && data.status != 2)
                  "
                  icon="el-icon-delete"
                  size="mini"
                  type="text"
                  slot="reference"
                >
                </el-button>
              </el-popconfirm>
            </span> -->
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
            <i class="el-icon-document tree_icon" v-if="data.isLeafs == 1"></i>
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

          <!-- <span>
              <el-popconfirm confirm-button-text="上传数据集" cancel-button-text="纳排数据集" title="请选择添加数据集方式"
                cancel-button-type="primary" @confirm="importData" @cancel="openAddDataForm(data.label)">
                <el-button v-if="data.catLevel == 3 && data.status != 2 && data.isLeafs == 0" icon="el-icon-circle-plus-outline" size="mini"
                  type="text" slot="reference" @click="markNode(data)">
                </el-button>
              </el-popconfirm>

              <el-popconfirm title="删除后无法恢复" icon="el-icon-warning" icon-color="red" confirm-button-text="确认"
                cancel-button-text="取消" @confirm="() => remove(node, data)">
                <el-button v-if="(data.isLeafs == 1 && data.status == 0) ||
                (data.uid == loginUserID && data.status != 2)
                " icon="el-icon-delete" size="mini" type="text" slot="reference">
                </el-button>
              </el-popconfirm>
            </span> -->
        </span>
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
          <el-select
            v-model="risk"
            :clearable="true"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in risks"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <el-popover placement="top" trigger="hover">
          <div>根据左侧高亮病种及危险因素进行搜索</div>
          <el-button slot="reference" size="small" @click="cancelSelect()"
            >清除</el-button
          >
          <el-button
            slot="reference"
            size="small"
            @click="searchByDisease()"
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
          v-loading="loading"
          style="width: 100%; text-align: center"
          ref="scrollTable"
          height="75vh"
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
        <!-- <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="params.pageNum"
          :page-size="params.pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination> -->
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
import { getCategory, addDisease, removeCate } from "@/api/category";

export default {
  data() {
    return {
      moduleName: "exceptionFeature",
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      datasetNum: "",
      filterText: "",
      activeName: "first",
      treeData: [],
      treeData1: [],
      treeData2: [],
      treeData3: [],

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
  mounted() {
    this.getList();
    this.getCatgory();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getList() {
      //获取病种
      // getRequest("/api/category").then((response) => {
      //   this.treeData = response.data;
      //   console.log(typeof this.treeData);
      //   console.log("this.treeData", this.treeData);
      // });
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
    getCatgory() {
      // console.log("uid", this.loginUserID)
      getCategory(
        `/api/category?uid=${sessionStorage.getItem("userid") - 0}`
      ).then((response) => {
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

    // changeData(...theArgs) {
    //   this.disease_name = theArgs[0].label; //点击的节点的名字 `?diseaseName=${disease}`
    //   this.knowledges =  this.searchByDisease(this.disease_name, this.risk)
    //   console.log("this.disease_name", this.disease_name);
    // },
    changeData(treeRef, node) {
      if (this.currentHighlightedTree === treeRef) {
        // 如果当前节点属于已高亮的树，则取消高亮
        this.$refs[treeRef].setCurrentKey(null);
        this.lastClickedNode = null;
        this.currentHighlightedTree = null;
        this.disease_name = "";
        this.searchByDisease(this.disease_name, this.risk);
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

        this.disease_name = node.label; //点击的节点的名字 `?diseaseName=${disease}`
        this.knowledges = this.searchByDisease(this.disease_name, this.risk);
        console.log("this.disease_name", this.disease_name);
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

    handleCheckChange(data, checked) {
      if (checked) {
        theArgs[0].label; //点击的节点的名字 `?diseaseName=${disease}`
        console.log("this.disease_name", this.disease_name);
      }
    },

    searchByDisease() {
      // this.risk = risks;
      console.log("search By name risk", this.disease_name, this.risk);
      getRequest("/ten/knowledge/search", {
        disease_name: this.disease_name,
        risks: this.risk,
      })
        .then((res) => {
          this.knowledges = res.data;
          this.total = res.data_length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelSelect() {
      this.disease_name = "";
      this.risk = "";
      this.searchByDisease();
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
  height: 100%;
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
  /* display: grid; */
  /* grid-template-rows: auto 15% auto auto; */
  height: 90vh;
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
