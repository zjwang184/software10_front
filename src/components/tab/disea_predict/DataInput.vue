<template>
  <div v-loading="loading">
    <div style="display: flex; align-items: center">
      <span class="lineStyle" style="display: inline-block">▍</span
      ><span class="featureTitle" style="display: inline-block"
        >请输入患者相关信息:</span
      >
      <el-dropdown
        split-button
        type="primary"
        @command="handleCommand"
        size="medium"
        style="font-size: 30px; line-height: 30px; margin-left: 10px"
      >
        输入方式
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="import">批量导入</el-dropdown-item>
          <el-dropdown-item command="manual">手动输入</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-popover placement="right" trigger="hover">
        <div>
          输入患者的具体详细信息，这里输入的信息是你上一个界面所选择的任务的数据集特征
        </div>
        <el-icon
          class="el-icon-warning-outline"
          slot="reference"
          style="font-size: 20px; margin-left: 20px"
        ></el-icon>
      </el-popover>
    </div>

    <div id="dataInput">
      <div v-if="importData === true">
        <div style="text-align: center; font-size: 30px; margin-bottom: 20px">
          批量输入患者信息
        </div>
        <el-skeleton
          v-if="!dataLoaded"
          style="width: 100%"
          :rows="20"
          animated
        />
        <el-table
          v-else
          :data="tableData"
          stripe
          class="custom-table"
          :header-cell-style="headerCellStyle"
          ref="scrollTable"
          height="700px"
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

          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                plain
                @click="predictPatient(scope.row)"
                >预测此患者</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else>
        <div style="text-align: center; font-size: 30px; margin-bottom: 20px">
          手动输入患者信息
        </div>
        <el-form
          :model="personForm"
          :rules="rules"
          ref="personForm"
          label-width="200px"
          class="demo-personForm"
        >
          <el-row>
            <el-col :span="12" v-for="item in predict_features" :key="item">
              <el-form-item :label="item" :prop="item">
                <el-input v-model="personForm[item]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="buttonGroup">
          <el-button @click="backStep()" round>上一步</el-button>
          <el-button @click="resetForm('personForm')" type="info" plain
            >重置</el-button
          >
          <el-button type="primary" @click="submit()" round>下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { getRequest, postRequest } from "@/api/user";
import { getTableDes, getTableData } from "@/api/tableDescribe.js";

export default {
  name: "DataInput",
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "diseaPredict",
    },
  },
  computed: {
    headerCellStyle() {
      return {
        color: "black",
      };
    },
  },
  data() {
    return {
      loading: false,
      predict_features: [],
      predict_task_name: "",
      predict_model_name: "",
      personForm: {},
      rules: {},
      predValue: "",
      modelSelected: "11",
      tableData: [],
      importData: false,
      predict_dataset: "",
      dataLoaded: false, //骨架屏加载
    };
  },
  mounted() {
    this.init();
    this.generateFormAndRules();
  },
  methods: {
    init() {
      this.$notify({
        title: "模型选择成功",
        message: "请输入患者信息进行预测",
        type: "success",
      });
      this.predict_features = this.m_predict_features;
      this.patient_form = this.m_patient_form;
      this.predict_task_name = this.m_predict_task_name;
      this.predict_model_name = this.m_predict_model_name;
      this.predValue = this.m_predValue;
      this.predict_dataset = this.m_predict_dataset;

      // console.log("this.m_predict_features   ", this.predict_features);
      // console.log("this.patient_form", this.patient_form);
      // console.log("this.predict_task_name", this.predict_task_name);
      // console.log("this.predict_model_name ", this.predict_model_name);
    },
    handleCommand(command) {
      switch (command) {
        case "import":
          this.handleImport();
          break;
        case "manual":
          this.handleManualInput();
          break;
        default:
          console.error("未知的命令:", command);
      }
    },
    handleImport() {
      // 导入数据集
      this.importData = true;
      this.getTableData("", this.predict_dataset);
    },
    handleManualInput() {
      this.importData = false;
    },

    generateFormAndRules() {
      // 动态生成表单项
      this.personForm = this.predict_features.reduce((acc, cur) => {
        acc[cur] = ""; // 将表单项添加到表单数据对象中，并初始化为空字符串
        return acc;
      }, {});

      // 动态生成验证规则
      this.rules = this.predict_features.reduce((acc, cur) => {
        acc[cur] = [
          { required: true, message: "此项不能为空", trigger: "blur" },
          { validator: this.validateInput, trigger: "blur" }, // 添加自定义验证器
          // 可以添加其他验证规则
        ];
        return acc;
      }, {});
    },

    validateInput(rule, value, callback) {
      // 检查是否包含非法字符
      if (/[/\\]/.test(value)) {
        callback(new Error("不能包含/或\\字符"));
      } else {
        // 检查是否只包含数字
        if (!/^\d+$/.test(value)) {
          callback(new Error("只能输入数字"));
        } else {
          callback(); // 通过验证
        }
      }
    },

    getTableData(tableId, tableName) {
      getTableData("/api/getTableData", tableId, tableName)
        .then((response) => {
          console.log("response", response);
          // 获取表数据
          this.tableData = response.data;
          console.log("this.tableData[0]", this.tableData[0]);
          this.dataLoaded = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    predictPatient(row) {
      this.personForm = { ...row };
      this.submit();
    },

    async submit() {
      // 检查是否有空值
      const emptyFields = this.predict_features.filter(
        (item) => !this.personForm[item]
      );

      if (emptyFields.length > 0) {
        // 如果有空值，则弹出警告
        this.$message.error("请填写完整的表单！");
      }
      // alert("提交成功");
      let formData = new FormData();

      // formData.append("personForm", JSON.stringify(this.personForm))

      for (let key in this.personForm) {
        formData.append(key, this.personForm[key]);
      }
      console.log("=======");
      const dictionary = {};
      // 将任务名称和所用算法加入字典对象
      dictionary["taskname"] = this.predict_task_name;
      dictionary["modelname"] = this.predict_model_name;
      // 创建一个列表来存储 FormData 对象中的值
      const featuredata = [];
      // for (const [key, value] of formData.entries()) {
      //   featuredata.push(value);
      // }
      // 将列表存储在 featuredata 键中
      // dictionary["featuredata"] = featuredata;

      // <------------------------创建一个普通对象来存储 FormData 对象中的键值对------------------->
      // const featuredata = {};
      // for (const [key, value] of formData.entries()) {
      //   featuredata[key] = value;
      // }

      // <------------------------将普通对象存储在 featuredata 键中------------------------------->
      dictionary["featuredata"] = featuredata;
      for (const [key, value] of formData.entries()) {
        dictionary[key] = value;
      }
      // 将列表存储在 featuredata 键中
      dictionary["featuredata"] = featuredata;

      postRequest("/runtime_bus/runmodel", dictionary)
        .then((res) => {
          this.loading = true;
          this.predValue = res.res;
          this.m_changeTaskInfo({
            patient_form: dictionary,
            predValue: this.predValue,
          });

          console.log("this.m_patient_form11   ", this.m_patient_form);
          // 确保在数据处理完成后再跳转

          this.m_changeStep(3);
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `发生错误：${err}`,
          });
        });
      // postRequest("/ten/data/update_person2", formData)
      this.loading = true;
    },
    backStep() {
      this.m_changeStep(1);
    },
  },
};
</script>

<style scoped>
/* 病种选择页面 */
#dataInput {
  display: flex;
  flex-direction: column;
  margin-left: 15%;
  margin-right: 15%;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4); /* 修正阴影的颜色和透明度 */
  background: rgba(255, 255, 255, 0.1);
  margin-top: 30px;
  padding: 20px 2%;
}

.buttonGroup {
  display: flex;
  justify-content: center;
  align-content: center;
  padding-left: 0;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
  margin-left: 15%;
}

.featureTitle {
  font-size: 30px;
}
.custom-table {
  width: 100%;
  height: auto;
}
.custom-table tr {
  background-color: #dcf3fc !important;
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
