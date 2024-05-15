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
                v-for="(item, index) in sorted_models_forms"
                :key="index"
              >
                <el-switch
                  style="margin-top: 10%"
                  v-model="item.isSelect"
                  @change="handleCheckAlg($event, item.modelname)"
                  :active-text="item.modelname"
                  inactive-text=""
                >
                </el-switch>
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
            @edit="handleTabsEdit"
          >
            <el-tab-pane
              v-for="(item, index) in filteredEditableTabs"
              :key="index"
              :label="item.modelname"
              :name="item.modelname"
            >
              <!-- <div v-if="item.name === 'dqn'"> -->
              <div class="titleBox">{{ item.modelname }}</div>
              <div class="introBox">
                <p>模型说明：</p>
                <p>{{ item.introduction }}</p>
                <p></p>
              </div>

              <!-- 模型参数表单 -->
              <div>
                <div
                  class="paramBox"
                  v-if="editableTabsValue === item.modelname"
                >
                  <el-form label-position="top" :model="paramObject">
                    <el-form-item
                      v-for="(valueobj, keyobj, index2) in paramObject"
                      :key="index2"
                      :prop="keyobj"
                    >
                      <!-- <template slot="label" v-if="valueobj">
                        <span class="paramTitle" style="margin: auto"
                          >{{ valueobj.meaning }}</span
                        >
                      </template> -->
                      <template slot="label">
                        <span class="paramTitle" style="margin: auto">{{
                          valueobj.meaning
                        }}</span>
                      </template>
                      <el-input v-model.trim="valueobj.value"></el-input>
                      <span class="valueRange">{{ valueobj.range }}</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <!-- </div> -->
            </el-tab-pane>
          </el-tabs>
        </div></el-col
      >
    </el-container>
    <div class="buttonGroup">
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
  </div>
</template>

<script>
import { postRequest } from "@/api/user";
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { getRequest } from "@/utils/api";
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
      return this.model_froms.filter((item) => item.isSelect);
    },
    sorted_models_forms() {
      return this.model_froms.slice().sort((a, b) => {
        if (a.isSelect && !b.isSelect) {
          return -1;
        } else if (!a.isSelect && b.isSelect) {
          return 1;
        } else {
          return 0;
        }
      });
    },
  },
  data() {
    return {
      // 所有模型的表单都在集合中
      model_froms: [],
      paramObject: {},

      editableTabsValue: "",

      model: "",
      loading: false,
      res: "",

      ret: [],
    };
  },

  mounted() {
    this.init();
  },

  watch: {
    editableTabsValue(newValue, oldValue) {
      this.modifyParamObject(newValue, oldValue);
    },
  },

  methods: {
    modifyParamObject(newValue, oldValue) {
      for (let i in this.model_froms) {
        if (this.model_froms[i].modelname == this.editableTabsValue) {
          // 将单引号替换为双引号
          let dataWithDoubleQuotes = this.model_froms[i].defaultparams.replace(
            /'/g,
            '"'
          );
          // 解析 JSON
          let parsedData = JSON.parse(dataWithDoubleQuotes);

          // let paramsKeyValue = {};
          // for (var index in parsedData){
          //   paramsKeyValue[parsedData.Keys()[index]] = parsedData.Keys()[index]["value"];
          // }
          // this.paramObject = paramsKeyValue

          this.paramObject = parsedData;
        }
      }

      let params = {};
      for (let i in this.model_froms) {
        if (
          (this.model_froms[i].isSelect &&
            this.model_froms[i].modelname == oldValue) ||
          this.model_froms[i].modelname == newValue
        ) {
          let dataWithDoubleQuotes = this.model_froms[i].defaultparams.replace(
            /'/g,
            '"'
          );
          // 解析 JSON
          let parsedData = JSON.parse(dataWithDoubleQuotes);

          // let paramsKeyValue = {};
          // for (var index in parsedData){
          //   paramsKeyValue[parsedData.Keys()[index]] = parsedData.Keys()[index]["value"];
          // }
          // this.model_froms[i].algorithm_params=paramsKeyValue;

          this.model_froms[i].algorithm_params = parsedData;
        }
      }
    },
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

        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            this.$set(tab, "isSelect", false); // 使用 Vue 的 $set 方法确保响应性
          }
        });
      }

      console.log("remove后", this.model_froms);
    },
    handleCheckAlg(checked, name) {
      console.log("name:", name, " checked ", checked);
      if (checked) {
        this.editableTabsValue = name;
      } else {
        for (var i in this.model_froms) {
          console.log(this.model_froms)
          if (this.model_froms[i].name == name){
            this.model_froms[i].isSelect=false;            
          }
          if (this.model_froms[i].isSelect){
            this.editableTabsValue=this.model_froms[i].modelname;            
          }          
        }
      }
    },

    init() {
      // 同步数据库数据或者缓存数据
      this.getInitInfo();
    },

    // 同步数据库数据或者缓存数据
    getInitInfo() {
      if (this.m_train_model.algorithm_select.source === "") {
        // 刚进页面
        getRequest(`Task/getAllModelInfo`).then((res) => {
          if (res) {
            let i = 0;
            for (i = 0; i < res.length; i++) {
              this.model_froms.push(res[i]);
              if (res[i].isSelect) {
                this.model_froms[i].isSelect = true;
                this.editableTabsValue = res[i].modelname;
              }
            }
          }
        });
      } else {
        // 已经有缓存数据
        this.model_froms = this.m_train_model.algorithm_select.algorithm_infos;
      }

      console.log("this.model_froms", this.model_froms);
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },

    async submit(url) {
      this.loading = true;
      let targets = [];
      console.log("chak", this.m_train_model.target_features);
      for (var target in this.m_train_model.target_features) {
        targets.push(this.m_train_model.target_features[target].riskFactor);
        console.log(
          "this.m_target_features[target]:",
          this.m_train_model.target_features[target].riskFactor
        );
      }

      console.log("==========");
      let models = [];
      let algorithms = [];
      for (var ind = 0; ind < this.model_froms.length; ind++) {
        console.log(ind);
        let selected_model = {
          name: this.model_froms[ind].modelname,
          forms: {
            taskname: "",
            table_name: "",
            cols: "",
            labels: "",
          }, //获取不到editableTabs的值，所以更改成{}
        };
        selected_model.forms = {};
        let forms = {};
        if (this.model_froms[ind].isSelect) {
          algorithms.push(this.model_froms[ind].modelname);
          selected_model.forms["paramObject"] =
            this.model_froms[ind].algorithm_params;
          models.push(selected_model);
        }

        console.log(
          "train_mode",
          this.m_train_model,
          "\n",
          this.model_froms[ind]
        );
        console.log("t", this.paramObject);

        selected_model.forms["taskname"] = this.m_train_model.taskName;
        selected_model.forms["table_name"] = this.m_train_model.dataset;
        selected_model.forms["cols"] = this.m_train_model.use_features;
        selected_model.forms["labels"] = targets;

        console.log("selected_model", selected_model.forms);
      }

      // let results = []
      // 使用 Promise.all 来等待所有的 POST 请求完成
      await Promise.all(
        models.map((model) =>
          postRequest(url, {
            modelname: [model],
            features: this.m_train_model.all_features,
          })
        )
      )
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
            for (var ind = 0; ind < this.model_froms.length; ind++) {
              if (this.model_froms[ind].modelname == name) {
                this.model_froms[ind].res = values;
              }
            }
            // results.push({
            //   name: name,
            //   res: values,
            //   isSelected: true,
            // })
          });
        })
        .catch((error) => {
          console.error("Error occurred while sending POST requests:", error);
          this.loading = false;
        });

      this.m_changeModelTrain({
        algorithm_select: {
          source: "前端",
          selected_algorithms: algorithms,
          algorithm_infos: this.model_froms,
        },
        // res: results
      });
      this.loading = false;
      this.m_changeStep(this.m_step + 1);
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

.buttonGroup {
  position: fixed;
  bottom: 2%;
  left: 55%;
  transform: translateX(-50%); /* 水平居中 */
  width: 200px;
  z-index: 9999; /* 置于最顶层 */
  margin-left: 6%;
}


.buttonBox {
  width: 35vh;
  margin-top: auto;
  margin-right: auto;
  margin-left: auto;
}
</style>
