<template>
  <div class="main">
    <div class="info">特征条下方进度条为特征完备率</div>
    <!-------------------------------------------------------- 标签特征 ------------------------------------------------------>
    <div class="label-feature" style="margin: 20px 0">
      <div>
        <span class="lineStyle">▍</span
        ><span class="featureTitle">标签特征：</span>
        <el-checkbox
          v-model="checkAll_label"
          @change="handleCheckAll_label"
          style="width: auto"
        >
          全选
        </el-checkbox>
      </div>

      <div style="margin: 15px"></div>

      <el-checkbox-group
        v-model="labelFeatures"
        @change="changeBox_label()"
        style="display: flex; flex-wrap: wrap"
      >
        <div
          v-for="item in displayedLabel"
          :key="item.riskFactor"
          style="flex-basis: 20%; padding: 5px; box-sizing: border-box"
          class="checkbox-item"
        >
          <el-checkbox :label="item.riskFactor" style="width: 100%">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <span>{{ item.riskFactor }}</span>
            </div>
          </el-checkbox>
          <el-progress
            :percentage="Math.round(item.rate * 100)"
            :color="changeProgressColor(item.rate * 100)"
            style="margin-top: 5px"
          ></el-progress>
        </div>
      </el-checkbox-group>
    </div>

    <el-divider></el-divider>
    <div style="margin: 20px 0">
      <!---------------------------------------------------------- 参与运算特征 -------------------------------------------------->
      <div>
        <span class="lineStyle">▍</span
        ><span class="featureTitle">参与运算的特征：</span>

        <div style="display: inline-block">
          <el-checkbox
            v-model="checkAll_compute"
            @change="handleCheckAll_compute"
            style="width: auto"
          >
            全选
          </el-checkbox>

          <el-input v-model="searchQuery" placeholder="搜索特征"></el-input>
        </div>
        <el-checkbox-group
          v-model="computeFeatures"
          @change="changeBox_compute()"
          style="display: flex; flex-wrap: wrap"
        >
          <div
            v-for="item in filteredComputeFeatures"
            :key="item.riskFactor"
            style="flex-basis: 20%; padding: 5px; box-sizing: border-box"
            class="checkbox-item"
          >
            <el-checkbox :label="item.riskFactor" style="width: 100%">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="item.riskFactor"
                  placement="top-start"
                >
                  <span
                    v-html="highlight(item.riskFactor)"
                    class="text-clip"
                  ></span>
                </el-tooltip>
              </div>
            </el-checkbox>
            <el-progress
              :percentage="Math.round(item.rate * 100)"
              :color="changeProgressColor(item.rate * 100)"
              style="margin-top: 5px"
            ></el-progress>
          </div>
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
      <div v-loading="compute_loading" class="reward-degree">
        <div style="margin-bottom: 10px">
          <div>
            <span class="lineStyle">▍</span
            ><span class="featureTitle"
              >请根据特征重要性拖动滑块设置奖励程度</span
            >

            <!------- 下拉框得到默认值 ----------------->
            <el-icon class="el-icon-warning-outline"></el-icon>
            选择一个算法初步计算各特征的特征重要性：
            <el-select
              v-model="value"
              style="margin: 20px"
              default-first-option
              @change="runDefaultReward(value)"
              :disabled="isDisabled"
            >
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
        <div style="height: 600px; overflow-y: auto; width: 100%">
          <!-- 使用transition-group包裹动态列表 -->
          <transition-group name="slide" tag="div">
            <el-row
              v-for="item in allFeatures"
              :key="item.riskFactor"
              class="slide-item"
            >
              <el-col
                :span="20"
                v-if="computeFeatures.includes(item.riskFactor)"
              >
                <span class="demonstration">{{ item.riskFactor }}</span>
                <span>&nbsp; &nbsp; &nbsp;{{ item.doctorRate }}%</span>
                <el-slider
                  v-model="item.doctorRate"
                  @change="sortFeatures"
                  style="width: 115%; margin-left: 10px"
                  :format-tooltip="formatTooltip"
                  show-input
                ></el-slider>
              </el-col>
            </el-row>
          </transition-group>
        </div>
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
import { log } from "@antv/g2plot/lib/utils";

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

    filteredComputeFeatures() {
      if (!this.searchQuery) {
        return this.displayedFeatures;
      }
      const searchLower = this.searchQuery.toLowerCase();
      const filtered = this.displayedFeatures.filter((item) =>
        item.riskFactor.toLowerCase().includes(searchLower)
      );
      // 先按是否匹配排序，再按原有逻辑排序
      const sorted = filtered.sort((a, b) => {
        const matchA = a.riskFactor.toLowerCase().includes(searchLower) ? 0 : 1;
        const matchB = b.riskFactor.toLowerCase().includes(searchLower) ? 0 : 1;
        if (matchA === matchB) {
          return (
            a.riskFactor.toLowerCase().indexOf(searchLower) -
            b.riskFactor.toLowerCase().indexOf(searchLower)
          );
        }
        return matchA - matchB;
      });
      return sorted;
    },
  },
  data() {
    return {
      // 所有特征计算重要性
      compute_loading: false,
      // 获取虚拟树形结构数据
      // treeData: JSON.parse(JSON.stringify(treeData)),
      treeData: [],
      allFeatures: [],
      checkAll_compute: false,
      checkAll_label: false,
      computeFeatures: [],
      knownFeatures: [],
      targetFeatures: [],
      labelFeatures: [],
      defaultReward: [],
      tableData: [], // 存储表格数据
      value: "",
      //分页数据
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      currentPage: 1,
      isDisabled: true,
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
      searchQuery: "",
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
    },

    handleCheckAll_compute(checked) {
      // 处理全选复选框状态改变
      if (checked) {
        this.computeFeatures = this.allFeatures.map((item) => item.riskFactor);
        this.isDisabled = false;
      } else {
        this.computeFeatures = [];
        this.isDisabled = true;
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
    highlight(text) {
      if (this.searchQuery) {
        const regex = new RegExp(this.searchQuery, "gi");
        return text.replace(
          regex,
          `<span style="color: red;">${this.searchQuery}</span>`
        );
      } else {
        return text;
      }
    },
    changeBox_compute() {
      if (
        this.computeFeatures.length === this.allFeatures.length &&
        this.computeFeatures.length > 0
      ) {
        this.checkAll_compute = true;
      } else {
        this.checkAll_compute = false;
      }

      if (this.computeFeatures.length > 0) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },

    changeBox_label() {
      if (
        this.labelFeatures.length === this.targetFeatures.length &&
        this.labelFeatures.length > 0
      ) {
        this.checkAll_label = true;
      } else {
        this.checkAll_label = false;
      }
    },

    runDefaultReward(model) {
      if (this.computeFeatures.length < 5) {
        this.$message({
          type: "warning",
          message: "请选择至少5个特征参与运算",
        });
        return;
      }
      if (this.labelFeatures.length < 1) {
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

      (this.compute_loading = true),
        postRequest("/runtime_bus/submitBus", {
          // model: model,

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
                this.defaultReward[risk]["riskFactor"] ==
                this.defaultReward[risk2]["riskFactor"]
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
          this.compute_loading = false;
          this.sortFeatures();
        });
    },

    next() {
      if (this.labelFeatures.length < 1) {
        this.$message({
          message: "请选择标签特征！",
          type: "warning",
        });
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
      return val + "%   数值越大代表特征越重要";
    },

    sortFeatures() {
      // 重新排序逻辑
      this.allFeatures.sort((a, b) => b.doctorRate - a.doctorRate);
    },
  },
};
</script>

<style scoped>
.main {
  height: auto;
  width: 80%;
  margin: 0 auto;
}

.main .info {
  height: 2rem;
  background-color: rgb(143, 144, 144, 0.3);
  line-height: 2rem;
  text-align: center;
}

.main .reward-degree {
  width: 100%;
}

.featureTitle {
  font-size: 25px;
  margin-right: 30px;
  margin-bottom: 20px;
}

.text-clip {
  margin-top: 5px;
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.text-clip:hover {
  text-overflow: none;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.buttonGroup {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%); /* 水平居中 */
  width: 200px;
  z-index: 9999; /* 置于最顶层 */
  margin-left: 6%;
}

.el-input {
  width: 100px;
  margin-left: 30px;
}

::v-deep .el-input input:focus {
  width: 200px;
  transition: all 0.5s ease;
}

.checkbox-item {
  opacity: 0;
  transform: translateY(100%);
  animation: fadeInUp 0.5s ease forwards;
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

.slide-item {
  transition: all 1s ease;
  position: relative;
}

/* 进入和离开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.slide-enter,
.slide-leave-to {
  /* 使用opacity和transform来模拟向上或向下滑动 */
  opacity: 0;
  transform: translateY(20px); /* 这里控制向上偏移的距离 */
}
</style>