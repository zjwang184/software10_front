<template>
  <div>
    <div style="margin-left: 15%">
      <span class="lineStyle" style="display: inline-block">▍</span
      ><span class="featureTitle" style="display: inline-block"
        >请输入疾病信息，具体如下 ：</span
      ><el-popover placement="right" trigger="hover">
        <div>
          输入病人的具体详细信息，这里输入的信息是你上一个界面所选择的任务的数据集特征
        </div>
        <el-icon
          class="el-icon-warning-outline"
          slot="reference"
          style="font-size: 20px; margin-left: 20px"
        ></el-icon>
      </el-popover>
    </div>

    <div id="dataInput">
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
        <el-form-item class="buttongroup">
          <el-button @click="backStep()" round>上一步</el-button>
          <el-button @click="resetForm('personForm')" type="info" plain
            >重置</el-button
          >
          <el-button type="primary" @click="submit()" round>下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { getRequest, postRequest } from "@/api/user";

export default {
  name: "DataInput",
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "diseaPredict",
    },
  },

  data() {
    return {
      predict_features: [],
      predict_task_name: "",
      predict_model_name: "",
      personForm: {},
      rules: {},
      predValue:"",
    };
  },
  mounted() {
    this.init();
    this.generateFormAndRules();
  },
  methods: {
    init() {
      this.predict_features = this.m_predict_features;
      this.patient_form = this.m_patient_form;
      this.predict_task_name = this.m_predict_task_name;
      this.predict_model_name = this.m_predict_model_name;
      this.predValue = this.m_predValue;

      // console.log("this.m_predict_features   ", this.predict_features);
      // console.log("this.patient_form", this.patient_form);
      // console.log("this.predict_task_name", this.predict_task_name);
      // console.log("this.predict_model_name ", this.predict_model_name);
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

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submit() {
      // 检查是否有空值
      const emptyFields = this.predict_features.filter(
        (item) => !this.personForm[item]
      );

      if (emptyFields.length > 0) {
        // 如果有空值，则弹出警告
        this.$message.error("请填写完整的表单！");
      } else {
        // 如果没有空值，则进行页面跳转
        // this.m_changeStep(3);
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
      console.log("typeof dictionary", typeof dictionary);
      console.log("dictionary", dictionary);
      console.log("=======");
      this.m_changeTaskInfo({ patient_form: dictionary });
      // console.log("this.m_patient_form   ", this.m_patient_form);
      postRequest("/runtime_bus/runmodel", dictionary)
        .then((res) => {
          console.log("res:", res);

          this.loading = true;
          this.predValue = res;
          this.m_changeTaskInfo({
            patient_form: dictionary.featuredata,
            m_predValue: this.predValue,
          });
          console.log("this.m_patient_form   ", this.m_patient_form);
          console.log("this.predValue111   ", this.predValue);
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
      
      this.m_changeStep(3);
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
  padding: 5%;
}
#disGroup {
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.disGroup-item {
  width: 200px;
  margin-bottom: 10px;
}

.buttongroup {
  margin-top: 5%;
  margin-left: 20%;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
  margin-left: auto;
}

.featureTitle {
  font-size: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
}
</style>