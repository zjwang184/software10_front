<template>
  <div class="Box">
    <div></div>
    <!-- <div class="left_tree">
      <el-tree
        :props="treeProps"
        :data="treeData"
        :load="loadNode"
        lazy
        show-checkbox
        @node-click="handleNodeClick"
      ></el-tree>
    </div> -->

    <div class="right">
      <!-------------------------------------------------------- 标签特征 ------------------------------------------------------>
      <div style="margin-bottom: 50px">
        <div>
          <span class="lineStyle">▍</span
          ><span class="featureTitle">标签特征：</span>
          <el-checkbox
            v-model="checkAll_label"
            @change="handleCheckAll_label"
            border
            style="width: auto"
          >
            全选
          </el-checkbox>
        </div>

        <div style="margin: 15px"></div>

        <el-checkbox-group v-model="labelFeatures" @change="changeBox_label()">
          <el-checkbox
            v-for="item in displayedLabel"
            :label="item.riskFactor"
            :key="item.riskFactor"
            border
            style="width: auto; margin: 10px"
          >
            <el-popover
              placement="top-end"
              width="150"
              :title="popovername"
              trigger="hover"
              :content="item.rate"
              :open-delay="200"
            >
              <span slot="reference">{{ item.riskFactor }}</span>
              <el-progress
                :percentage="item.rate * 100"
                :color="changeProgressColor(item.rate * 100)"
              ></el-progress>
            </el-popover>
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <el-divider></el-divider>

      <!---------------------------------------------------------- 参与运算特征 -------------------------------------------------->
      <div style="margin-bottom: 30px">
        <div>
          <span class="lineStyle">▍</span
          ><span class="featureTitle">参与运算的特征：</span>
          <el-checkbox
            v-model="checkAll_compute"
            @change="handleCheckAll_compute"
            border
            style="width: auto"
          >
            全选
          </el-checkbox>
        </div>

        <div style="margin: 15px 0"></div>

        <el-checkbox-group
          v-model="computeFeatures"
          @change="changeBox_compute()"
        >
          <el-checkbox
            v-for="item in displayedFeatures"
            :label="item.riskFactor"
            :key="item.riskFactor"
            border
            style="width: auto; margin: 10px"
          >
            <el-popover
              placement="top-end"
              width="150"
              :title="popovername"
              trigger="hover"
              :content="1 - item.rate"
              :open-delay="200"
            >
              <span slot="reference">{{ item.riskFactor }}</span>
              <el-progress
                :percentage="item.rate * 100"
                :color="changeProgressColor(item.rate * 100)"
              ></el-progress>
            </el-popover>
          </el-checkbox>
        </el-checkbox-group>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalFeatures"
          style="margin-top: 10px"
        >
        </el-pagination>
      </div>

      <el-divider></el-divider>

      <!---------------------------------------------------------- 特征重要性拖动滑块 -------------------------------------------------->
      <div  v-loading="compute_loading">
        <div style="margin-bottom: 50px"  >
          <div calss="top">
            <span class="lineStyle">▍</span
            ><span class="featureTitle"
              >请根据特征重要性拖动滑块设置奖励程度</span
            >
            <!-- <el-popover placement="right" trigger="hover">
              <div>
                手动设置奖励程度大小
              
              </div>
              <el-icon slot="reference" class="el-icon-warning-outline"></el-icon>
            </el-popover> -->
          
            <!------- 下拉框得到默认值 ----------------->
            <el-icon slot="reference" class="el-icon-warning-outline"></el-icon>
              选择一个算法初步计算各特征的特征重要性：
            <el-select
              v-model="value"            
              style="margin: 20px"
              default-first-option
              @change="runDefaultReward(value)"            
              :disabled="isDisabled"            
            >
              <!-- <div>
                手动设置奖励程度大小              
              </div> -->

              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            
          </div>
        </div>

        <el-row v-for="(item, index) in allFeatures" :key="index">
          <el-col :span="20" v-if="computeFeatures.includes(item.riskFactor)">
            <span class="demonstration">{{ item.riskFactor }}</span>
            <span>&nbsp; &nbsp; &nbsp;{{ item.doctorRate }}%</span>
            <el-slider
              v-model="allFeatures[index].doctorRate"
              :format-tooltip="formatTooltip"
              style="width: 100%"
            ></el-slider>
          </el-col>
          
          <!-- <el-col :span="4"> &nbsp; &nbsp; &nbsp;{{ item.rate }}%</el-col> -->
        </el-row>
      </div>

      <div class="buttonGroup">
        <el-button @click="backStep()" round>上一步</el-button>
        <!-- <el-button @click="printALLFeatures()">测试</el-button> --> 
        <el-button type="primary" @click="next()" round>下一步</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import { getRequest, postRequest } from "@/api/user.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
// import { treeData } from "@/components/tab/treeData.js";

export default {
  name: "FeatureSelect",
  props: {
    moduleName: {
      type: String,
      default: "modelTraining",
    },
  },
  mixins: [vuex_mixin],
  computed: {
    // 计算属性，根据当前页和每页数量筛选出显示的特性
    displayedFeatures() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.allFeatures.slice(startIndex, endIndex);
    },
    displayedLabel() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.targetFeatures.slice(startIndex, endIndex);
    },
    // 计算属性，计算总特性数量
    totalFeatures() {
      return this.allFeatures.length;
    },
  },
  data() {
    return {
      // 所有特征计算重要性
      compute_loading: false,
      
      // 获取虚拟树形结构数据
      // treeData: JSON.parse(JSON.stringify(treeData)),
      isChange: false,
      treeData: [],
      allFeatures: [],
      peopleFeatures: [],
      physiologicalFeatures: [],
      socialFeatures: [],
      checked_label: false,
      checkAll: false,
      checkAll_compute: false,
      checkAll_2: false,
      checkAll_label: false,
      computeFeatures: [],
      knownFeatures: [],
      targetFeatures: [],
      
      labelFeatures: [],
      defaultReward: [],

      //树形控件
      treeProps: {
        label: "label",
        children: "children",
      },
      selectedNodeTags: [], // 用于存储选中节点的标签数据

      tableData: [], // 存储表格数据

      popovername: "缺失率:",

      //分页数据
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      currentPage: 1,

      formData: {
        id: "",
        doctorRate: "",
      },
      formDatalist: [],
      
      isDisabled: true,
      value: "",
      options: [
        {
          value: "XGB",
          label: "XGBoost",
        },
        {
          value: "RF",
          label: "随机森林",
        },
      ],
    };
  },

  created() {
    // this.init();
    //   this.getData("");
    // 在组件创建时将 JSON 数据赋值给 treeData
    // this.treeData = treeData;
  },

  mounted() {
    this.init();
    // this.getData();       
  },
  methods: {
    init() {
      //   同步vuex里的数据
      this.targetFeatures = this.m_target_features;
      this.allFeatures = this.m_all_features;
      this.computeFeatures = this.m_use_features;
      this.labelFeatures = this.m_use_labels;
      this.changeBox_compute();
      this.changeBox_label();
      this.knownFeatures = this.m_known_features;
      console.log("!!!!!!!!!", this.targetFeatures);
      console.log("!!!!!!!!!", this.allFeatures);
      // this.handleCheckAll_label();
      // this.handleCheckAll_compute();
      // this.changeBox_1();
      // this.changeBox_2();

      // getRequest("/tTableManager/tablemanager", {
      //   tableName: this.m_dataset,
      // }).then((res) => {
      //   res.forEach((item) => {
      //     if (item) {
      //       if (item.is_demography == 1) {
      //         this.allFeatures.push(item.field_name);
      //         this.peopleFeatures.push(item.field_name);
      //       } else if (item.is_physiological == 1) {
      //         this.allFeatures.push(item.field_name);
      //         this.physiologicalFeatures.push(item.field_name);
      //       } else if (item.is_sociology == 1) {
      //         this.allFeatures.push(item.field_name);
      //         this.socialFeatures.push(item.field_name);
      //       } else if (item.is_label == 1) {
      //         console.log(this.moduleName);
      //         上面判断是否是标签列
      //         if (this.moduleName === "modelTraining") {
      //           this.targetFeatures.push(item.field_name);
      //         }
      //       }
      //     }
      //   });
      //   同步vuex里的数据
      //   this.targetFeatures = this.m_target_feature;
      //   this.allFeatures = this.m_all_features;
      //   console.log("123456", this.allFeatures);
      //   this.computeFeatures = this.m_use_features;
      //   this.knownFeatures = this.m_known_features;
      //   this.changeBox_1();
      //   this.changeBox_2();
      //   if (this.moduleName !== "modelTraining") {
      //     this.targetFeatures = this.m_target_feature;
      //     this.changeBox_target();
      //     console.log("123", this.targetFeatures);
      //   }
      // });
    },

    handleCheckAll_compute(checked) {
      // 处理全选复选框状态改变
      if (checked) {
        this.computeFeatures = this.allFeatures.map((item) => item.riskFactor);
        this.isDisabled=false;
      } else {
        this.computeFeatures = [];
        this.isDisabled=true;
      }
    },

    handleCheckAll_label(checked) {
      // 处理全选复选框状态改变
      if (checked) {
        this.labelFeatures = this.targetFeatures.map((item) => item.riskFactor);
        
      } else {
        this.labelFeatures = [];
        
      }
    },

    changeBox_compute() {
      if (this.computeFeatures.length === this.allFeatures.length && this.computeFeatures.length > 0) {
        this.checkAll_compute = true;
      } else {
        this.checkAll_compute = false;
      }

      if (this.computeFeatures.length > 0){
        this.isDisabled=false;
      }else{
        this.isDisabled=true;
      }
    },

    changeBox_2() {
      if (this.knownFeatures.length === this.allFeatures.length && this.knownFeatures.length != 0) {
        this.checkAll_2 = true;
      } else {
        this.checkAll_2 = false;
      }
      
    },

    changeBox_label() {
      if (this.labelFeatures.length === this.targetFeatures.length && this.labelFeatures.length > 0) {
        this.checkAll_label = true;
      } else {
        this.checkAll_label = false;
      }
    },

    runDefaultReward(model) {
      if (this.computeFeatures.length < 5 ) {
        this.$message({
          type: "warning",
          message: "请选择至少5个特征参与运算",
        });
        return;
      }
      if (this.labelFeatures.length < 1){
        this.$message({
          type: "warning",
          message: "请选择至少1个标签参与运算",
        });
        return;
      }

      console.log("model", model);
      console.log("tableName", this.m_dataset);
      console.log("features", this.computeFeatures);
      console.log("labels", this.labelFeatures);
      console.log("mode", "public");
      if (model == "") {
        return;
      }

      this.compute_loading=true,
      postRequest("/runtime_bus/submitBus", {
        // "model": model,

        tableName: this.m_dataset,
        features: this.computeFeatures,
        labels: this.labelFeatures,
        alg: model,
        mode: "public",
      }).then((res) => {
        // console.log("defaultReward:", this.defaultReward);
        // console.log("allFeatures:", this.allFeatures);
        this.defaultReward = res;
        for (var risk in this.defaultReward) {
          // console.log(" risk ",this.defaultReward[risk]["riskFactor"], this.defaultReward[risk]["rate"]);
          for (var risk2 in this.allFeatures) {
            if (
              this.defaultReward[risk]["riskFactor"] == this.defaultReward[risk2]["riskFactor"]
            ) {
              this.allFeatures[risk2]["doctorRate"] =
                parseFloat(this.defaultReward[risk]["rate"]) * 100;
              break;
            }
          }
          console.log(
            " risk ",
            this.allFeatures[risk]["riskFactor"],
            this.allFeatures[risk]["doctorRate"]
          );
        }
        this.compute_loading=false;
      });
    },

    next() {
      
      if (this.labelFeatures.length < 1) {
        alert("该数据没有标签特征，请重新选择或上传数据表");
        return;
      }
      if (this.computeFeatures.length < 5) {
        this.$message({
          type: "warning",
          message: "请选择至少5个特征参与运算",
        });
        return;
      }
      this.m_changeTaskInfo({
        // known_features: this.knownFeatures,
        target_feature: this.labelFeatures,
        use_features: this.computeFeatures,
        all_features: this.allFeatures,
        use_labels: this.labelFeatures,
      });

      this.m_changeStep(this.m_step + 1);
      // 发送后端请求
      // postRequest("", this.allFeatures).then((res) => {
      //   console.log(res);
      // });

      // this.m_changeStep(this.m_step + 1);
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },

    defaultSet() {},

    handleNodeClick(data, node) {
      // 添加选中节点的标签数据
      if (data.label) {
        // 模拟添加标签，可以根据实际情况设置标签数据
        this.selectedNodeTags.push({ name: data.label, type: "success" });
      }
    },

    // 进度条
    changeProgressColor(rate) {
      if (rate < 30) {
        return "RGB(230,162,60)";
      } else if (rate < 60) {
        return "RGB(245,108,108)";
      } else if (rate < 90) {
        return "RGB(64,158,255)";
      } else {
        return "RGB(103,194,58)";
      }
    },

    // 处理每页数量变化
    handleSizeChange(size) {
      this.pageSize = size;
    },
    // 处理当前页变化
    handleCurrentChange(page) {
      this.currentPage = page;
    },

    formatTooltip(val) {
      return val / 100;
    },
  },
};
</script>

<style scoped>
.Box {
  display: grid;
  grid-template-columns: 12% 85%;
}

.featureTitle {
  font-size: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
}

.featureSubTitle {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
}

.left_tree {
  display: inline-block;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
}

.right {
  display: inline-block;
  margin-left: 40px;
  height: auto;
  width: 100%;
}

/* 使用popover以后省略号就没用了 */
/* .el-checkbox-group >>> .el-checkbox__label {
  margin-top: 5px;
  line-height: 10px;
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
} */

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.buttonGroup {
  margin-top: 20px;
  margin-bottom: 20px; /* 设置上一个 div 元素底部的距离 */
  align-items: center;
}

.tag {
  margin-right: 10px;
  margin-top: 10px;
  font-size: 16px; /* 设置标签的字体大小 */
}

.buttonGroup {
  position: fixed;
  bottom: 10%; /* 距离页面底部 10px */
  left: 50%;
  transform: translateX(-50%); /* 水平居中 */
  width: 200px;
  z-index: 9999; /* 置于最顶层 */
  margin-left:6%;
}
</style>