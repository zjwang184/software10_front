<template>
  <div class="main">
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
          :default-expanded-keys="['1']"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="changeData"
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
            <span>
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
          @node-click="changeData"
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

            <span>
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
          @node-click="changeData"
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
      <el-dialog title="提示" :visible.sync="dialogDiseaseVisible" width="30%">
        <span>
          请输入新病种名称（a）：<el-input
            placeholder="请输入内容"
            v-model="diseaseName"
            class="nameInput"
          ></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="() => append(0)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="新增数据集" :visible.sync="dialogDataVisible" width="60%">
      <div class="addDataClass">
        <i style="margin-left: 10px" class="el-icon-s-data"></i
        >&nbsp;&nbsp;&nbsp;数据集：<el-input
          v-model="addDataForm.dataName"
          placeholder="请输入数据集名称"
        ></el-input>
        <span class="addDataBaseInfo">
          <i class="el-icon-user-solid"></i>&nbsp;&nbsp;&nbsp;创建人：<el-input
            v-model="addDataForm.createUser"
            placeholder="请输入创建人姓名"
          ></el-input>
        </span>
        <span class="addDataBaseInfo">
          <i class="el-icon-time"></i>&nbsp;&nbsp;&nbsp;创建时间：<span>{{
            showDataForm.createTime
          }}</span>
        </span>
        <span class="addDataBaseInfo">
          <i class="el-icon-pie-chart"></i>&nbsp;&nbsp;&nbsp;所属类别：<span>{{
            showDataForm.classPath
          }}</span>
        </span>
      </div>
      <div class="addDataClass" style="margin-top: 20px">
        <div class="addDataTitle">
          <i class="el-icon-connection"></i>&nbsp;&nbsp;特征选择
        </div>
        <div style="margin-top: 20px">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            style="margin-right: 8px"
            @click="putToAddDataForm"
            >添加新条件</el-button
          >
          <el-button
            @click="chooseCharacter(addDataForm.characterList[0])"
            style="width: 130px; margin-right: 8px; margin-left: 0px"
            >{{ addDataForm.characterList[0].button }}</el-button
          >
          <span v-if="addDataForm.characterList[0].type === 'discrete'">
            <el-select
              :value="'='"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
              disabled
            >
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-select
              v-model="addDataForm.characterList[0].value"
              placeholder="请选择特征取值"
              style="width: 300px"
            >
              <el-option
                v-for="item in addDataForm.characterList[0].range"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </span>
          <span v-else>
            <el-select
              v-model="addDataForm.characterList[0].computeOpt"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
            >
              <el-option label=">" value=">"></el-option>
              <el-option label="<" value="<"></el-option>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-input
              v-model="addDataForm.characterList[0].value"
              placeholder="请输入特征取值"
              style="width: 300px"
            ></el-input>
            <el-button disabled style="width: 200px; background-color: #f5f7fa"
              >单位：{{ addDataForm.characterList[0].unit }}</el-button
            >
          </span>
        </div>
        <div
          style="margin-top: 20px"
          v-for="(characterItem, index) in addDataForm.characterList.slice(1)"
          :key="index"
        >
          <el-select
            v-model="characterItem.opt"
            slot="prepend"
            placeholder="条件选择"
            style="width: 130px; margin-right: 8px"
          >
            <el-option label="AND" value="0"></el-option>
            <el-option label="OR" value="1"></el-option>
            <el-option label="NOT" value="2"></el-option>
          </el-select>
          <el-button
            @click="chooseCharacter(characterItem)"
            style="width: 130px; margin-right: 8px"
            >{{ characterItem.button }}</el-button
          >
          <span v-if="characterItem.type === 'discrete'">
            <el-select
              :value="'='"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
              disabled
            >
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-select
              v-model="characterItem.value"
              placeholder="请选择特征取值"
              style="width: 300px"
            >
              <el-option
                v-for="item in characterItem.range"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </span>
          <span v-else>
            <el-select
              v-model="characterItem.computeOpt"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
            >
              <el-option label=">" value=">"></el-option>
              <el-option label="<" value="<"></el-option>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-input
              v-model="characterItem.value"
              placeholder="请输入特征取值"
              style="width: 300px"
            ></el-input>
            <el-button disabled style="width: 115px; background-color: #f5f7fa"
              >单位：{{ characterItem.unit }}</el-button
            >
          </span>
          <el-button
            type="primary"
            plain
            icon="el-icon-delete"
            style="margin-left: 10px"
            @click="deleteToAddDataForm(characterItem)"
            >删除</el-button
          >
        </div>
        <div
          style="
            margin-top: 20px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
          "
        >
          <button class="cool-button" @click="submitCharacterCondition">
            筛选病例
          </button>
        </div>
        <!-- 显示筛选出来的表数据 -->
        <el-table
          :data="addTableData"
          stripe
          style="width: 100%"
          height="450"
          v-show="showAddTableData"
        >
          <el-table-column
            v-for="(value, key) in addTableData[0]"
            :key="key"
            :prop="key"
            :label="key"
            width="80"
          >
            <template slot-scope="{ row }">
              <div class="truncate-text">{{ row[key] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cleanDataInput()">取 消</el-button>
        <el-button type="primary" @click="addTable()">新建表</el-button>
      </span>
      <el-dialog
        title="特征选择"
        :visible.sync="characterVisible"
        width="50%"
        append-to-body
      >
        <el-container>
          <el-aside width="180px">
            <el-menu default-active="1" class="el-menu-vertical-demo">
              <el-menu-item index="1" @click="exchangeCharacterList(0)">
                <span slot="title">人口学</span>
              </el-menu-item>
              <el-menu-item index="3" @click="exchangeCharacterList(2)">
                <span slot="title">生理指标</span>
              </el-menu-item>
              <el-menu-item index="4" @click="exchangeCharacterList(3)">
                <span slot="title">行为学</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
            <el-radio-group v-model="characterId">
              <el-radio
                v-for="optItem in characterOptList"
                :key="optItem.characterId"
                :label="optItem.characterId"
                border
                style="margin-bottom: 10px"
                >{{ optItem.chName }}</el-radio
              >
            </el-radio-group>
          </el-main>
        </el-container>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmCharacter()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-dialog>
    <!--===============================     导入数据表单   ===================================================================-->
    <el-dialog
      v-loading="loading"
      :element-loading-text="loadText"
      id="importDataTable"
      title="导入数据表"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="dialogForm.rules"
        label-width="110px"
      >
        <el-form-item label="选择数据表" prop="filesInfo">
          <el-upload
            action=""
            class="upload"
            ref="uploadRef"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="changeFile"
            :auto-upload="false"
            accept=".csv"
            :limit="1"
            :multiple="false"
            :file-list="dialogForm.filesInfo"
            :http-request="
              (data) => {
                upRequest(data);
              }
            "
          >
            <el-button slot="trigger" size="small" type="success"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="数据表名称" prop="tableName">
          <el-input
            v-model="dialogForm.tableName"
            placeholder="请输入数据表名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="涉及疾病" prop="dataDisease">
          <el-input
            v-model="dialogForm.dataDisease"
            :disabled="true"
            style="width: 150px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogFormVisible = false;
            resetForm('dialogFormRef');
          "
          >取消</el-button
        >
        <el-button @click="resetForm('dialogFormRef')">重置</el-button>
        <el-button type="primary" @click="uploadFile">确定</el-button>
      </div>

      <!-- 解析表后字段分类弹窗 -->
      <el-dialog
        v-loading="loading2"
        :element-loading-text="loadText2"
        append-to-body
        title="请选择多个疾病标签字段"
        :visible.sync="featuresVision"
      >
        <!-- <el-form class="featureLabel" label-width="auto"> -->
        <el-checkbox-group v-model="labelList">
          <el-checkbox
            style="width: 250px"
            border
            v-for="(name, index) in Object.keys(featuresMap)"
            :key="index"
            :label="name"
          ></el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="compelete">完成上传</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!------------------------------------ 数据表展示 -------------------------------------------------->
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
        <div>
          <i class="el-icon-folder-opened"></i>所属类别:
          <span>{{ showDataForm.classPath }}</span>
        </div>
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
          <div class="table-container-after">
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
        <div
          style="
            position: fixed;
            bottom: 50px;
            left: 70%;
            transform: translateX(-50%);
            width: 800px;
            z-index: 9999;
            margin-left: 6%;
          "
        >
          <el-button
            type="primary"
            @click="applyDownload()"
            round
            v-if="tableData.length && downloadStatus=='0'"
            >申请下载</el-button
          >
          <el-button
            type="warning"
            @click="waitingCheck()"
            round
            v-if="tableData.length && downloadStatus=='1'"
            >等待审核</el-button
          >
          <el-button
            type="success"
            @click="allowDownload();exportCSV()"
            round
            v-if="tableData.length && downloadStatus=='2' "
            >允许下载</el-button
          >

          <!-- <el-button
            type="primary"
            @click="exportCSV()"
            round
            v-if="tableData.length"
            >导出CSV文件</el-button
          >
          <el-button
            type="primary"
            @click="exportXLSX()"
            round
            v-if="tableData.length"
            >导出XLSX文件</el-button
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequest, postRequest, saveParentDisease } from "@/api/user";
import { getFetures } from "@/api/feature.js";
import { getCategory, addDisease, removeCate } from "@/api/category";
import { getTableDes, getTableData } from "@/api/tableDescribe.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { disOptions } from "@/components/tab/constData.js";
import { resetForm, debounce } from "@/components/mixins/mixin.js";
import FileSaver from "file-saver";
import XLSX from "xlsx";
// import { taskList } from "./constTaskList";
// import { treeData } from "@/components/tab/treeData.js";

let id = 1000;

export default {
  mixins: [resetForm, debounce],
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    loginUserID() {
      return sessionStorage.getItem("userid");
    },
    headerCellStyle() {
      return {
        color: "black",
      };
    },
  },

  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
    "addDataForm.dataName"() {
      this.checkAddTaleName();
    },
    // diseaseName() {
    //   this.checkDiseasename();
    // },
    selectedFields(newValue) {
      // 如果一键全选框被取消选中，且 selectedFeatures 的长度大于 0，则将其置为 false
      this.selectAll = newValue.length === this.fields.length;
    },
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
      // 获取虚拟树形结构数据
      // treeData: JSON.parse(JSON.stringify(treeData)),
      treeData: [],
      treeData1: [],
      treeData2: [],
      treeData3: [],
      labelList: [],
      tableData: [],
      diseaseNum: 0,
      datasetNum: 0,
      filterText: "",
      selectedDataset: null,
      fullData: "",
      showTooltip: false,
      hoverTimer: null,
      dialogDiseaseVisible: false,
      dialogDataVisible: false,
      characterVisible: false,
      showAddTableData: false,
      characterId: 1,
      showDataForm: {
        tableName: "",
        createUser: "",
        createTime: "",
        classPath: "",
        columnCount: "",
        rowCount: "",
      },
      addDataForm: {
        dataName: "",
        createUser: "",
        createTime: "",
        path: "",
        characterList: [
          {
            opt: "",
            characterId: -1,
            featureName: "",
            chName: "",
            type: "",
            unit: "",
            range: "",
            button: "点击选择特征",
            value: "",
            computeOpt: "",
          },
        ],
      },
      characterOptList: [],
      addTableData: [],
      input3: "",
      select: "",

      dialogDiseaseVisible2: false,

      nodeData: {},

      diseaseName: "",

      loading: false,
      loading2: false,
      getData_loading: false,
      dataLoaded: false, //骨架屏加载
      loadText: "拼命加载中",
      loadText2: "拼命加载中",
      disease: "",
      creator: "",
      disOptions,
      featuresVision: false,
      DatadialogVisible: false,
      featuresMap: {},
      patientTable: [],
      dialogForm: {
        filesInfo: [],
        tableName: "",
        isOnly: true,
        dataDisease: "",
        featuresNum: 1,
        fields: [{ name: "", type: "" }],
        rules: {
          tableName: [
            {
              required: true,
              message: "数据表名称不能为空",
              trigger: "change",
            },
          ],
          dataDisease: [
            {
              required: true,
              message: "涉及疾病不能为空",
              trigger: "blur",
            },
          ],
          numFeatures: [
            { required: true, message: "特征个数不能为空", trigger: "blur" },
            { type: "integer", message: "特征个数需为整数", trigger: "blur" },
            { min: 1, message: "特征个数需>1", trigger: "blur" },
          ],
        },
      },
      dialogFormVisible: false,
      options: {
        method: "post",
        data: {},
        url: "/DataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      },

      nodeid:"",
      downloadStatus: "0",

    };
  },

  created() {
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
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    compelete() {
      // 判断多标签合理性
      let labelCount = 0;
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          if (this.featuresMap[key] == "label") {
            labelCount++;
          }
        }
      }
      if (labelCount < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请至少设置一个标签特征",
        });
        return false;
      }
      if (this.dialogForm.dataDisease != "多疾病" && labelCount > 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "只有多病种数据集能设置多个标签特征",
        });
        return false;
      }

      this.loadText2 = "正在添加字段类型";
      this.loading2 = true;
      let tableHeaders = [];
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          switch (this.featuresMap[key]) {
            case "diagnosis":
              tableHeaders.push({
                fieldName: key,
                isDiagnosis: "1",
              });
              break;
            case "examine":
              tableHeaders.push({
                fieldName: key,
                isExamine: "1",
              });
              break;
            case "pathology":
              tableHeaders.push({
                fieldName: key,
                isPathology: "1",
              });
              break;
            case "vital_signs":
              tableHeaders.push({
                fieldName: key,
                isVitalSigns: "1",
              });
              break;
            case "label":
              tableHeaders.push({
                fieldName: key,
                isLabel: "1",
              });
              break;
            default:
              break;
          }
        }
      }
      // let userId = sessionStorage.getItem("userid")-0;
      // 上传特征分类结果
      postRequest("/api/feature/insertFeature", {
        tableName: this.dialogForm.tableName,
        tableHeaders,
        // userId
      }).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
      });

      // 重新上传数据表，使其保存到数据列表中
      // 此处上传时后台已有数据表，可和后台配合只发送保存通知已提高效率
      // this.options.url = "/DataTable/uploadTable";
      // this.$axios(this.options).then((res) => {

      //   this.loading2 = false;
      //   this.resetForm('dialogFormRef');
      //   if (res?.code == "200") {
      //     this.$message({
      //       showClose: true,
      //       type: "success",
      //       message: "上传成功",
      //     });
      //     this.featuresVision = false;
      //     this.dialogFormVisible = false;
      //     this.getDataList();
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       type: "error",
      //       message: "上传失败",
      //     });
      //   }
      // });
      this.getCatgory(); // 更新目录结构
    },
    changeLabel(name, label) {
      console.log("name: ");
      console.log(name);

      console.log("label:");
      console.log(label);

      this.featuresMap[name] = label;
    },
    confirmCharacter() {
      this.characterVisible = false;
      let index = this.addDataForm.characterList.indexOf(this.characterOptItem);
      let oldObj = this.addDataForm.characterList[index];
      for (let i = 0; i < this.characterOptList.length; i++) {
        let a = this.characterOptList[i];
        if (this.characterId == a.characterId) {
          oldObj.characterId = a.characterId;
          oldObj.featureName = a.featureName;
          oldObj.chName = a.chName;
          oldObj.type = a.type;
          oldObj.unit = a.unit;
          oldObj.range = a.range;
          oldObj.button = a.chName;
          oldObj.value = "";
          oldObj.opt = this.characterItem.opt;
        }
      }
      this.addDataForm.characterList[index] = oldObj;
      console.log(this.addDataForm.characterList);
      this.characterId = "";
    },
    // 数据表上传函数
    upRequest(data) {
      console.log("开始上传文件");
      const payload = new FormData();

      payload.append("file", data.file);
      payload.append("newName", this.dialogForm.tableName);
      payload.append("disease", this.dialogForm.dataDisease);
      payload.append("user", sessionStorage.getItem("username"));
      payload.append("uid", sessionStorage.getItem("userid") - 0);
      payload.append("parentId", this.nodeData.id);
      payload.append("parentType", this.nodeData.label);
      payload.append("status", this.nodeData.status);
      payload.append(
        "size",
        this.$refs["uploadRef"].uploadFiles[0].size / 100000
      );
      payload.append("is_upload", "1");
      payload.append("is_filter", "0");
      this.options = {
        method: "post",
        data: payload,
        url: "api/dataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      };
      // 多疾病下的上传文件需要打标签，用不同的接口
      let paths = this.nodeData.label;
      if (paths === "多疾病") {
        this.options.url = "api/dataTable/parseAndUpload";
      }

      this.$axios(this.options).then((res) => {
        // 返回表头信息
        this.loading = false;
        console.log(res);
        if (res?.code == "200") {
          this.$message({
            showClose: true,
            type: "success",
            message: "解析成功",
          });
          let featureList = res.data;
          //把特征存为map的键
          for (const item of featureList) {
            this.$set(this.featuresMap, item, "diagnosis");
          }
          if (paths === "多疾病") {
            this.featuresVision = true;
          }
          this.dialogFormVisible = false;
          this.getCatgory();
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "解析失败",
          });
        }
      });
    },

    getCatgory() {
      // console.log("uid", this.loginUserID)
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
    uploadFile() {
      console.log("开始上传文件");
      if (this.$refs["uploadRef"].uploadFiles.length < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择数据表",
        });
        return false;
      }
      this.checkTableName();
      if (!this.dialogForm.isOnly) {
        return false;
      }
      this.$refs["dialogFormRef"].validate((valid) => {
        if (valid) {
          this.loadText = "正在上传并解析文件";
          this.loading = true;
          this.$refs.uploadRef.submit();
        }
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
          this.dataLoaded = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCheckApprove(){
      getRequest(`/api/sysManage/getCheckApprove`,{
        id: this.nodeid,
        username: sessionStorage.getItem("username")
      }).then((res) => {
        if (res.code == 200) {
          // console.log("ret data", res.data);
          this.downloadStatus = res.data;
          // console.log(res.data);
        }        
      });
    },

    applyDownload(){
      getRequest(`/api/sysManage/applyCheckApprove`,{
        id: this.nodeid,
        username: sessionStorage.getItem("username")
      }).then((res) => {
        if (res.code == 200) {
          this.downloadStatus=res.data;
          // console.log("ret data", res.data);
          this.$message({
            showClose: true,
            type: "success",
            message: res.msg,
          });
          // console.log(res.data);
        }
      });
    },
    waitingCheck(){
      this.$message({
            showClose: true,
            type: "warning",
            message: `申请还在审核中……，请尽快联系管理员审核`,
          });
    },
    allowDownload(){
      getRequest(`/api/sysManage/allowCheckApprove`,{
        id: this.nodeid,
        username: sessionStorage.getItem("username")
      }).then((res) => {
        if (res.code == 200) {
          // console.log("ret data", res.data);
          this.downloadStatus=res.data;
          this.$message({
            showClose: true,
            type: "success",
            message: res.msg,
          });
          // console.log(res.data);
        }
      });
    },

    changeData(data) {
      console.log("data:", data)
      this.nodeid = data.id;
      this.getCheckApprove();
      if (data.isLeafs == 1) {
        //数据获取前显示骨架屏
        this.dataLoaded = false;
        //获取描述信息
        this.getTableDescribe(data.id, data.label);
        //获取数据信息
        this.getTableData(data.id, data.label);
        //显示表数据
        this.selectedDataset = true;
      }
    },

    append(isLeaf) {
      // 发送请求新增一个病种信息（目录结构）
      let catagoryNode = {
        label: this.diseaseName,
        catLevel: this.nodeData.catLevel + 1,
        parentId: this.nodeData.id,
        isLeafs: isLeaf,
        isCommon: this.nodeData.isCommon,
        path: this.nodeData.path + "/" + this.diseaseName,
        isDelete: 0,
        children: [],
      };

      let catagoryNodeJSON = JSON.stringify(catagoryNode);
      addDisease("/api/addDisease", catagoryNodeJSON)
        .then((response) => {
          this.getCatgory(); //刷新目录结构
          console.log(response.data);
        })
        .catch((error) => {
          alert("新增疾病目录错误" + error);
        });
      this.nodeData = {};
      this.cleanInput();
      this.dialogDiseaseVisible = false;
    },
    appendCommon() {
      const newChild = {
        id: id++,
        label: this.diseaseName,
        children: [],
        isLeafs: false,
        isCommon: true,
      };
      if (!this.nodeData.children) {
        this.$set(this.nodeData, "children", []);
      }
      this.nodeData.children.push(newChild);
      this.nodeData = {};
      this.cleanInput();
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      removeCate("/api/category/remove", data)
        .then((response) => {
          // data就是要删除的目录信息
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    addDisease() {
      // 发送请求新增一个病种信息（目录结构）
      let catagoryNode = {
        label: this.diseaseName,
        catLevel: 1,
        parentId: 0,
        isLeafs: 0,
        isCommon: 0,
        path: this.diseaseName,
        isDelete: 0,
        children: [],
      };

      let catagoryNodeJSON = JSON.stringify(catagoryNode);
      console.log("name:", this.diseaseName);
      let diseaseName = this.diseaseName;

      // 这里是增加一个目录，服用了addDisease方法
      addDisease("/api/addDisease", catagoryNodeJSON)
        .then((response) => {
          this.getCatgory();
        })
        .catch((error) => {});
      // const newNode = { id: id++, label: this.diseaseName, children: [] , isLeafs: false};
      // this.treeData.push(newNode);
      this.cleanInput();
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },

    markNode(data) {
      console.log(data);
      this.nodeData = data;
    },

    cleanInput() {
      this.dialogDiseaseVisible = false;
      this.dialogDiseaseVisible2 = false;
      this.diseaseName = "";
    },
    cleanDataInput() {
      this.dialogDataVisible = false;
    },
    addTable() {
      // 创建表
      this.diseaseName = this.addDataForm.dataName;
      this.dialogDataVisible = false;
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/createTable",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      };
      this.$axios(this.options).then((res) => {
        console.log("数据:");
        console.log(res.data);
      });
      this.append(1);
    },
    putToAddDataForm() {
      let number = -Math.floor(Math.random() * 100);
      let item = {
        opt: "",
        characterId: -1,
        featureName: "",
        chName: "",
        type: "",
        unit: "",
        range: "",
        removeIndex: number,
        button: "点击选择特征",
        value: "",
        computeOpt: "",
      };
      this.addDataForm.characterList.push(item);
    },
    deleteToAddDataForm(item) {
      let index = this.addDataForm.characterList.indexOf(item);
      if (index !== -1) {
        this.addDataForm.characterList.splice(index, 1);
      }
    },
    chooseCharacter(item) {
      this.exchangeCharacterList(0);
      this.characterVisible = true;
      this.characterOptItem = item;
    },
    submitCharacterCondition() {
      console.log("this.addDataForm.characterList");
      console.log(this.addDataForm.characterList);
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/filterTableData",
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("请求参数：" + JSON.stringify(filterConditions));
      this.$axios(this.options)
        .then((res) => {
          this.addTableData = res.data;
          console.log("数据:");
          console.log(this.addTableData);
          this.showAddTableData = true;
        })
        .catch((error) => {
          this.$message.error("获取数据失败");
          console.log("获取数据失败" + error);
        });
      let s = JSON.stringify(this.addDataForm.characterList, null, 2);
      console.log("this.addDataForm:");
      console.log(this.addDataForm);
      console.log(s);
    },
    getNowDateFormat() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    openAddDataForm(type) {
      this.addDataForm = {
        dataName: "",
        characterList: [
          {
            opt: "",
            characterId: -1,
            featureName: "",
            chName: "",
            type: "",
            unit: "",
            range: "",
            button: "点击选择特征",
            value: "",
            computeOpt: "",
          },
        ],
      };
      this.dialogDataVisible = true;
      this.showAddTableData = false;
      this.showDataForm.createUse = sessionStorage.getItem("username");
      this.showDataForm.createTime = this.getNowDateFormat();
      this.showDataForm.classPath = type;
    },
    exchangeCharacterList(index) {
      getFetures("/api/feature/getFeatures", index)
        .then((response) => {
          console.log("特征为：");
          console.log(response.data);
          this.characterOptList = response.data;
          console.log(this.characterList);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),
    getData(tablename) {
      this.DatadialogVisible = true;
      this.getData_loading = true;
      getRequest("/DataTable/getInfoByTableName", {
        tableName: tablename,
      }).then((res) => {
        this.patientTable = res.data;
        console.log("patientTable:" + res.data);
        this.getData_loading = false;
      });
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(row) {
      postRequest(`DataTable/delete/${row.id}`).then((res) => {
        this.SetDataList(res.reverse());
      });
    },
    clearFilter() {
      this.disease = "";
      this.creator = "";
    },
    importData() {
      // 涉及疾病填入上一级节点名
      this.dialogForm.dataDisease = this.nodeData.label;
      this.dialogFormVisible = true;
    },

    handleSubmit() {
      console.log("文件上传中...");
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      //上传前的验证
      const isCSV =
        file.type === "text/csv" || file.type === "application/vnd.ms-excel";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isCSV) {
        this.$message.error("上传文件仅支持 CSV 格式");
      }
      // if (!isLt2M) {
      //     this.$message.error('上传文件大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
      return isCSV;
    },

    removeFileExtension(fileName) {
      // 寻找最后一个点号的位置
      const lastDotIndex = fileName.lastIndexOf(".");

      // 如果找到了点号并且不在文件名的开头或结尾
      if (
        lastDotIndex !== -1 &&
        lastDotIndex < fileName.length - 1 &&
        lastDotIndex > 0
      ) {
        // 返回删除了后缀的文件名部分
        return fileName.substring(0, lastDotIndex);
      } else {
        // 如果没有找到点号或者点号在文件名的开头或结尾，直接返回原文件名
        return fileName;
      }
    },

    changeFile() {
      console.log(this.$refs["uploadRef"].uploadFiles);
      if (this.dialogForm.tableName.length < 1) {
        this.dialogForm.tableName = this.removeFileExtension(
          this.$refs["uploadRef"].uploadFiles[0].name
        );
      }
    },

    //导出CSV文件
    exportCSV() {
      console.log(this.tableData); // 打印表格数据到控制台

      /* 从 this.tableData 生成 CSV 字符串 */
      this.type = "";
      setTimeout(() => {
        // 生成 CSV 字符串
        var csvData = "";

        // 添加表头
        var headerRow = Object.keys(this.tableData[0]);
        csvData += headerRow.join(",") + "\n";

        // 添加数据行
        this.tableData.forEach((row) => {
          var rowData = [];
          Object.values(row).forEach((value) => {
            rowData.push(value);
          });
          csvData += rowData.join(",") + "\n";
        });

        // 下载 CSV 文件
        try {
          FileSaver.saveAs(
            new Blob([csvData], { type: "text/csv;charset=utf-8" }),
            `${this.showDataForm.tableName}.csv`
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, csvData);
        }
      }, 1000);
    },

    //导出XLSX文件
    exportXLSX() {
      console.log(this.tableData); // 打印表格数据到控制台

      /* 从 this.tableData 生成 XLSX 对象 */
      this.type = "";
      setTimeout(() => {
        // 创建 Workbook 对象
        var wb = XLSX.utils.book_new();

        // 创建 Worksheet 对象
        var ws = XLSX.utils.json_to_sheet(this.tableData);

        // 将 Worksheet 添加到 Workbook 中
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // 将 Workbook 转换为二进制字符串
        var wbout = XLSX.write(wb, { type: "binary" });

        // 下载 XLSX 文件
        try {
          FileSaver.saveAs(
            new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }),
            `${this.showDataForm.tableName}.xlsx`
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
      }, 1000);
    },
    s2ab(s) {
      // 将字符串转换为 ArrayBuffer
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    },
  },
};
</script>

<style scoped>
.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#table {
  margin-top: 10px;
}

.main {
  display: grid;
  grid-template-columns: 17% 83%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
}
.left_tree {
  height: 90vh;
  display: inline-block;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.1);
  overflow-y: hidden;
}
.tree-top {
  position: sticky;
  top: 0;
  z-index: 999;
  height: 93px;
  margin-bottom: 10px;
}
.tipInfo {
  background-color: rgb(231, 228, 228);
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
.featureLabel {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}
.featureLabel .el-form-item__label {
  color: #252525;
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
  white-space: nowrap;
  box-sizing: border-box;
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
  height: 90vh;
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

.nameInput {
  width: 70%;
}
.addDataClass {
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 16px;
}
.addDataClass .el-input {
  width: 160px;
}
.addDataClass .addDataBaseInfo {
  margin-left: 50px;
}
.addDataClass .addDataTitle {
  margin-top: 10px;
  margin-right: 15px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.cool-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(to right, #26acdf, #3ee09a);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 200px;
  letter-spacing: 1px;
  cursor: pointer;
}
.cool-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}
.cool-button:hover {
  background: linear-gradient(to right, #51bae2, #80e7bb);
}
.cool-button:hover::before {
  transform: scaleX(1);
}
.custom-table {
  width: 100%;
  height: auto;
}
.custom-table tr {
  background-color: #dcf3fc !important;
}
.imgStyle {
  width: 25%;
  margin-left: 50px;
}
.table-container-after {
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
}
/* 修改树形控件高亮颜色 */
::v-deep.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #ffffff;
  background: rgba(30, 129, 178, 0.5) !important;
}

.blinking-text {
  color: #585858;
  animation: blink-animation 1s infinite alternate; /* 定义闪烁动画 */
}

@keyframes blink-animation {
  from {
    opacity: 0.9;
  }
  to {
    opacity: 0.3;
  }
}
</style>
