<template>
  <div>
    <h2 margin-left="25%">请输入疾病信息，具体如下：</h2>
    <br />
    <div class="tip">
      <p>
        输入一个人病人的具体详细信息，这里输入的信息是你上一个界面所选择的任务的数据集特征
      </p>
    </div>

    <div id="datainput">
      <!-- <h2 margin-left= "25%">请输入疾病信息，具体如下：</h2> -->
      <br /><br /><br />

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
        <el-form-item>
          <el-button @click="backStep()" round>上一步</el-button>
          <el-button type="primary" @click="submit()">下一步</el-button>
          <el-button @click="resetForm('personForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- <el-form
        :model="personForm"
        :rules="rules"
        ref="personForm"
        label-width="150px"
        class="demo-personForm"
      >
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="personForm.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="糖尿病谱系显示患糖尿病概率"
          prop="diabetesPedigreeFunction"
        >
          <el-input
            v-model.number="personForm.diabetesPedigreeFunction"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="怀孕次数" prop="pregnancies">
          <el-input
            v-model.number="personForm.pregnancies"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="血液中的葡萄糖水平" prop="glucose">
          <el-input v-model.number="personForm.glucose"></el-input>
        </el-form-item>
        <el-form-item label="血压值" prop="bloodPressure">
          <el-input v-model.number="personForm.bloodPressure"></el-input>
        </el-form-item>
        <el-form-item label="皮肤厚度" prop="skinThickness">
          <el-input v-model.number="personForm.skinThickness"></el-input>
        </el-form-item>
        <el-form-item label="血液中的胰岛素水平" prop="insulin">
          <el-input v-model.number="personForm.insulin"></el-input>
        </el-form-item>
        <el-form-item label="体重指数" prop="bmi">
          <el-input v-model.number="personForm.bmi"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="backStep()" round>上一步</el-button>
          <el-button
            type="primary"
            @click="
              step1('personForm');
              submit();
            "
            >下一步</el-button
          >
          <el-button @click="resetForm('personForm')">重置</el-button>
        </el-form-item>
      </el-form> -->
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
      // rules: {
      //   age: [
      //     { required: true, message: "年龄不能为空" },
      //     { type: "number", message: "年龄必须为数字值" },
      //   ],
      //   pregnancies: [
      //     { required: true, message: "从未怀孕可以填0,不能为空" },
      //     { type: "number", message: "必须为数字值", trigger: "change" },
      //   ],
      //   diabetesPedigreeFunction: [
      //     { required: true, message: "不能为空" },
      //     { type: "number", message: "必须为数字值", trigger: "change" },
      //   ],
      //   glucose: [
      //     { required: true, message: "不能为空" },
      //     { type: "number", message: "年龄必须为数字值" },
      //   ],
      //   bloodPressure: [
      //     { required: true, message: "不能为空" },
      //     { type: "number", message: "必须为数字值", trigger: "change" },
      //   ],
      //   skinThickness: [
      //     { required: true, message: "不能为空" },
      //     { type: "number", message: "必须为数字值", trigger: "change" },
      //   ],
      //   insulin: [
      //     { required: true, message: "不能为空" },
      //     { type: "number", message: "必须为数字值", trigger: "change" },
      //   ],
      //   bmi: [
      //     { required: true, message: "不能为空" },
      //     { type: "number", message: "必须为数字值", trigger: "change" },
      //   ],
      // },
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
        this.m_changeStep(3);
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
      for (const [key, value] of formData.entries()) {
        dictionary[key] = value;
      }
      console.log("typeof dictionary", typeof dictionary);
      console.log("dictionary", dictionary);
      console.log("=======");
      this.m_changeTaskInfo({ patient_form: dictionary });
      // console.log("this.m_patient_form   ", this.m_patient_form);
      postRequest("/ten/data/update_person", dictionary)
        .then((res) => {
          console.log("res:", res);
          this.loading = true;
          this.m_changeTaskInfo({ patient_form: dictionary });
          console.log("this.m_patient_form   ", this.m_patient_form);
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
    },
    backStep() {
      this.m_changeStep(1);
    },
  },
};
</script>

<style scoped>
/* 病种选择页面 */
#datainput {
  display: flex;
  flex-direction: column;
  margin-left: 20%;
  margin-right: 40%;
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
.tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
  /* margin-left: 10%;
    margin-right: 10%; */
}
</style>