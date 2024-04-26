<template>
  <div v-loading="loading" element-loading-text="拼命运算中">
    <el-container>
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <div class="left_tree">
            <!-- <el-tabs id="modelRadiosList" v-model="model" tab-position="left"> -->
            <div style="margin-left: 10%">
              <!-- tab-pane的name值必须与vuex里的算法名字一一对应 -->
              <el-alert> 这里你可以选择多个算法同时训练 </el-alert>

              <el-row
                :gutter="20"
                v-for="(item, index) in editableTabs"
                :key="index"
              >
                <el-switch
                  style="margin-top: 10%"
                  v-model="item.is_select"
                  @change="handleCheckAlg($event, item.name)"
                  :active-text="item.content"
                  inactive-text=""
                >
                </el-switch>
              </el-row>

              <el-row :gutter="20">
                <div class="buttonBox">
                  <el-col :span="10">
                    <el-button round @click="backStep()" style="margin-top: 20%"
                      >上一步</el-button
                    >
                  </el-col>
                  <!-- <el-button round @click="printForm()">测试</el-button> -->
                  <!-- <el-row :gutter="20">                
                  <el-button round @click="resetForm('DQN_ref')"  style="margin-top: 10%"
                    >恢复默认</el-button>
                </el-row> -->
                  <el-col :span="10">
                    <el-button
                      style="margin-top: 20%"
                      type="primary"
                      round
                      @click="submit('/runtime_bus/submitAlg')"
                      >提交运算</el-button
                    >
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>
        </div></el-col
      >

      <el-col :span="18"
        ><div class="grid-content bg-purple">
          <!-- 横的tabs标签 -->
          <el-tabs
            v-model="editableTabsValue"
            type="card"
            editable
            @edit="handleTabsEdit"
          >
            <el-tab-pane
              v-for="(item, index) in filteredEditableTabs"
              :key="index"
              :label="item.title"
              :name="item.name"
            >
              <!-- <div v-if="item.name === 'dqn'"> -->
              <div class="titleBox">{{ item.title }}</div>
              <div class="introBox">
                <p>模型说明：</p>
                <p>{{ item.intro }}</p>
              </div>

              <!-- 强化学习DQN的表单 -->
              <div class="paramBox" v-if="editableTabsValue === 'dqn'">
                <el-form
                  :model="DQN_form"
                  class=""
                  label-position="top"
                  ref="DDN_ref"
                >
                  <el-form-item prop="reward">
                    <template slot="label">
                      <span class="paramTitle" style="margin: auto"
                        >预测任务上的奖励</span
                      >
                      <el-popover placement="right" trigger="hover">
                        <div>
                          给一个强化学习奖励基值，上一页的程度则是根据这个值乘以百分比
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="DQN_form.reward"></el-input>
                    <span class="valueRange">(取值范围为 1 - 10 )</span>
                  </el-form-item>

                  <el-form-item prop="epoch">
                    <template slot="label">
                      <span class="paramTitle">迭代次数</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          完整训练所有数据的轮次，数值越大模型训练越好，但时间更长
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="DQN_form.epoch"></el-input>
                    <span class="valueRange">(取值范围为 100 - 10000 )</span>
                  </el-form-item>

                  <el-form-item prop="gamma">
                    <template slot="label">
                      <span class="paramTitle">折扣率</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          对未来奖励的折扣
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="DQN_form.gamma"></el-input>
                    <span class="valueRange">(取值范围为 0 - 1 )</span>
                  </el-form-item>

                  <el-form-item prop="learning_rate">
                    <template slot="label">
                      <span class="paramTitle">学习率</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          模型梯度下降的值，一般越小越好，但是越小时间越长
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="DQN_form.learning_rate"></el-input>
                    <span class="valueRange">(取值范围为 0 - 1 )</span>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 机器学习SVM的表单 -->
              <div class="paramBox" v-if="editableTabsValue === 'svm'">
                <el-form
                  :model="SVM_form"
                  class=""
                  label-position="top"
                  ref="SVM_ref"
                >
                  <el-form-item prop="kernel">
                    <template slot="label">
                      <span class="paramTitle">SVM的核函数kernel</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          核函数kernel选择
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-select v-model="SVM_form.kernel" default-first-option>
                      <el-option
                        v-for="item in svm_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <!-- <span class="valueRange">(取值范围为 100 - 10000 )</span> -->
                  </el-form-item>

                  <el-form-item prop="random_state">
                    <template slot="label">
                      <span class="paramTitle">随机种子</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          随机划分数据集策略
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="SVM_form.random_state"></el-input>
                    <span class="valueRange">(取值范围为 0-999 )</span>
                  </el-form-item>

                  <el-form-item prop="cv">
                    <template slot="label">
                      <span class="paramTitle">交叉验证分几折验证</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          使用交叉验证
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="SVM_form.cv"></el-input>
                    <span class="valueRange">(取值范围为 3 - 10 )</span>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 机器学习KNN的表单 -->
              <div class="paramBox" v-if="editableTabsValue === 'knn'">
                <el-form
                  :model="KNN_form"
                  class=""
                  label-position="top"
                  ref="KNN_ref"
                >
                  <el-form-item prop="random_state">
                    <template slot="label">
                      <span class="paramTitle">随机种子</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          随机划分数据集策略
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="KNN_form.random_state"></el-input>
                    <span class="valueRange">(取值范围为 0-999 )</span>
                  </el-form-item>

                  <el-form-item prop="cv">
                    <template slot="label">
                      <span class="paramTitle">交叉验证分几折验证</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          使用交叉验证
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="KNN_form.cv"></el-input>
                    <span class="valueRange">(取值范围为 3 - 10 )</span>
                  </el-form-item>

                  <el-form-item prop="cv">
                    <template slot="label">
                      <span class="paramTitle">K临近值</span>
                      <el-popover placement="right" trigger="hover">
                        <div>
                          KNN中k的取值
                          <!--  待填 -->
                        </div>
                        <el-icon
                          slot="reference"
                          class="el-icon-warning-outline"
                        ></el-icon>
                      </el-popover>
                    </template>
                    <el-input v-model.trim="KNN_form.K"></el-input>
                    <span class="valueRange">(取值范围为 3 - 10 )</span>
                  </el-form-item>
                </el-form>
              </div>
              <!-- </div> -->
            </el-tab-pane>
          </el-tabs>
        </div></el-col
      >
    </el-container>
  </div>
</template>

<script>
import { postRequest } from "@/api/user";
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "AlgorithmSelect",
  mixins: [resetForm, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "modelTraining",
    },
  },
  computed: {
    filteredEditableTabs() {
      // 根据条件筛选 editableTabs 数组
      return this.editableTabs.filter((item) => item.is_select);
    },
  },
  data() {
    return {
      DQN_form: {
        reward: 1,
        epoch: 100,
        gamma: 0.8,
        learning_rate: 0.8,
      },

      SVM_form: {
        kernel: "linear",
        random_state: 42,
        cv: 5,
      },
      svm_options: [
        {
          value: "linear",
          label: "linear线性核",
        },
        {
          value: "rbf",
          label: "rbf高斯核",
        },
      ],

      KNN_form: {
        random_state: 42,
        cv: 10,
        K: 3,
      },

      editableTabs: [
        {
          title: "DQN",
          name: "dqn",
          content: "强化学习算法-DQN",
          intro:
            "DQN，即深度Q网络（Deep Q-network），是指基于深度学习的Q-Learing算法。",
          // forms: this.DQN_form,
          is_select: true,
        },
        // {
        //   title: 'DDQN',
        //   name: 'ddqn',
        //   content: '强化学习算法-DDQN',
        //   intro: "DDQN",
        //   // forms: this.DDQN_form,
        //   is_select: false
        // },
        {
          title: "KNN",
          name: "knn",
          content: "机器学习算法-KNN",
          // forms: this.SVM_form,
          intro:
            "KNN:如果一个样本在特征空间中的k个最相似（即特征空间中最近）的样本中的大多数属于某一个类别，则该样本也属于这个类别，并具有这个类别上样本的特性。",
          is_select: false,
        },
        {
          title: "SVM",
          name: "svm",
          content: "机器学习算法-SVM",
          // forms: this.SVM_form,
          intro:
            "SVM是找到一个最优的超平面来将不同类别的数据分隔开，以实现分类的算法。",
          is_select: false,
        },
      ],

      editableTabsValue: "dqn",

      model: "",
      loading: false,

      SF_DRMB_form: {
        K_OR: 0,
        K_and_PC: 0,
        K_and_SP: 0,
      },
      res: "",
    };
  },

  created() {
    console.log("this.editableTabs", this.editableTabs);
    this.init();
  },

  methods: {
    handleTabsEdit(targetName, action) {
      if (action === "remove") {
        let tabs = this.filteredEditableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        // 更新选项卡的 is_select 属性
        // let update_tabs = this.editableTabs;
        // update_tabs.forEach((tab, index) => {
        //   if (tab.name === targetName) {
        //     this.$set(tab, 'is_select', false); // 使用 Vue 的 $set 方法确保响应性
        //   }
        // });
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            this.$set(tab, "is_select", false); // 使用 Vue 的 $set 方法确保响应性
          }
        });
      }

      console.log("remove后", this.editableTabs);
    },
    handleCheckAlg(checked, name) {
      console.log("name:", name, " checked ", checked);
      if (checked) {
        this.editableTabsValue = name;
      } else {
        for (var i in this.filteredEditableTabs) {
          this.editableTabsValue = this.filteredEditableTabs[i].name;
          return;
        }
      }
    },

    init() {
      this.DQN_form = this.m_DQN;
      this.SVM_form = this.m_SVM;
      this.KNN_form = this.m_KNN;

      for (var i in this.m_models) {
        for (var j in this.editableTabs) {
          if (this.m_models[i].name === this.editableTabs[j].name) {
            this.editableTabs[j].is_select = this.m_models[i].is_select;
            if (this.m_models[i].is_select) {
              this.editableTabsValue = this.m_models[i].name;
            }
          }
        }
      }

      console.log(
        "this.editableTab",
        this.editableTabs,
        this.editableTabsValue
      );
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },
    printForm() {
      console.log("DQNForm", this.DQN_form);
      console.log("SVMForm", this.SVM_form);
      console.log("KNNForm", this.KNN_form);
    },

    submit(url) {
      this.loading = true;
      let targets = [];
      // console.log("this.m_target_features", this.m_target_features)
      for (var target in this.m_target_features) {
        targets.push(this.m_target_features[target].riskFactor);
        console.log(
          "this.m_target_features[target]:",
          this.m_target_features[target].riskFactor
        );
      }

      console.log("==========");
      let models = [];
      for (var ind = 0; ind < this.editableTabs.length; ind++) {
        console.log(ind);
        let selected_model = {
          name: this.editableTabs[ind].name,
          forms: {}, //获取不到editableTabs的值，所以更改成{}
        };

        if (this.editableTabs[ind].is_select) {
          if (this.editableTabs[ind].name === "dqn") {
            selected_model.forms = this.DQN_form;
            this.m_DQN_update(this.DQN_form);
          } else if (this.editableTabs[ind].name === "svm") {
            selected_model.forms = this.SVM_form;
            this.m_SVM_update(this.SVM_form);
          } else if (this.editableTabs[ind].name === "knn") {
            selected_model.forms = this.KNN_form;
            this.m_KNN_update(this.KNN_form);
          }
          selected_model.forms["taskname"] = this.m_taskName;
          selected_model.forms["table_name"] = this.m_dataset;
          selected_model.forms["cols"] = this.m_use_features;
          selected_model.forms["labels"] = targets;
          models.push(selected_model);
          this.m_models_update({
            name: this.editableTabs[ind].name,
            is_select: true,
            newdata: selected_model.forms,
          });
        } else {
          selected_model.forms["taskname"] = this.m_taskName;
          selected_model.forms["table_name"] = this.m_dataset;
          selected_model.forms["cols"] = this.m_use_features;
          selected_model.forms["labels"] = targets;
          this.m_models_update({
            name: this.editableTabs[ind].name,
            is_select: false,
            newdata: selected_model.forms,
          });
        }
        console.log("selected_model", selected_model.forms);
      }

      console.log("alg_models:", models);
      console.log("models:", this.m_models);

      // 使用 Promise.all 来等待所有的 POST 请求完成
      Promise.all(models.map((model) => postRequest(url, [model])))
        .then((responses) => {
          responses.forEach((res, index) => {
            let name = models[index]["name"];
            let values = res[name];
            console.log(
              "name:",
              name,
              " ",
              values,
              "\n==models",
              index,
              models[index]
            );
            models[index]["res"] = values;
            this.m_models_update_res({
              name: name,
              res: values,
            });
            console.log(name, "success");
          });
          this.loading = false;
          console.log("res_models:", this.m_models);
          this.m_changeStep(this.m_step + 1);
        })
        .catch((error) => {
          console.error("Error occurred while sending POST requests:", error);
          this.loading = false;
        });

      // console.log("is async");
    },
  },
};
</script>

<style scoped>
#modelList {
  height: 60vh;
  width: 100%;
  margin-bottom: 5vh;
}

.titleBox {
  margin: 10px auto 10px auto;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.introBox {
  background-color: #e8f3ff;
  height: 5vh;
  width: 100%;
  overflow: auto;
}

.introBox p {
  margin-left: 15px;
}
.introBox p:first-child {
  font-size: 18px;
  font-weight: 600;
}
.introBox p:nth-child(2) {
  margin-left: 2em;
}

.paramBox .el-form {
  margin-top: 3vh;
  margin-left: 40vh;
}
.paramBox .el-form .el-input {
  width: 25vh;
}

.paramTitle {
  font-size: 20px;
  font-weight: 600;
}

.valueRange {
  color: gray;
  margin-left: 10px;
}

.el-icon-warning-outline {
  margin-left: 10px;
  font-size: 20px;
}
.el-icon-warning-outline:hover {
  color: #368ce7;
}

.buttonBox {
  width: 35vh;
  margin-top: auto;
  margin-right: auto;
  margin-left: auto;
}
</style>
