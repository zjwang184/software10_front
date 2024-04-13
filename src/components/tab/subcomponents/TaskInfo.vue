<template>
  <div id="mainBox">
    <el-form
      ref="taskInfoForm"
      :model="taskInfoForm"
      label-width="100px"
      class="form"
      label-position="top"
    >
      <el-form-item prop="taskName" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务名称</span>
        </template>
        <el-input
          v-model="taskInfoForm.taskName"
          :validate-event="'blur'"
        ></el-input>
      </el-form-item>
      <el-form-item prop="principal" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务负责人</span>
        </template>
        <el-input
          v-model="taskInfoForm.principal"
          :disabled="true"
          :validate-event="'blur'"
        ></el-input>
      </el-form-item>
      <el-form-item prop="participants" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>参与人员</span>
        </template>
        <el-input v-model="taskInfoForm.participants"></el-input>
      </el-form-item>
      <div></div>

      <el-form-item prop="comment" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务备注</span>
        </template>
        <el-input
          v-model="taskInfoForm.comment"
          type="textarea"
          style="width: 60vh"
        ></el-input>
      </el-form-item>

      <!-- <el-form-item>
        <el-button @click="resetForm('taskInfoForm')" round>重置</el-button>
        <el-button type="primary" @click="next()" round>下一步</el-button>
      </el-form-item> -->
    </el-form>
    <div class="buttonGroup">
      <el-button @click="resetForm()" round>清除</el-button>
      <el-button type="primary" @click="next()" round>下一步</el-button>
    </div>
  </div>
</template>

<script>
import { disOptions } from "@/components/tab/constData.js";
// import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";

export default {
  name: "TaskInfo",
  // mixins: [resetForm, vuex_mixin],
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "modelTraining",
    },
  },
  watch: {},
  computed: {},
  data() {
    return {
      disOptions: disOptions,
      taskInfoForm: {
        taskName: "",
        principal: "",
        participants: "",
        disease: "",
        comment: "",
      },
      invalidCharacters: /[\\\/]/, // 非法字符正则表达式，包含 / 和 \
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" }, // 任务名称不能为空
          { validator: this.validateTaskName, trigger: "blur" }, // 自定义验证方法验证任务名称是否包含非法字符
        ],
      },
    };
  },

  // TODO:初始化两遍，还可把数据放到localStorage里解决这个问题
  created() {
    this.init();
    this.$watch("m_dataDisList", () => {
      this.init();
      this.$message({
        message: "数据更新成功",
        type: "success",
      });
    });
  },

  methods: {
    // ...mapMutations("modelTraining",["ChangeStep","ChangeTaskInfo"]),
    init() {
      //和vuex内数据同步
      console.log("当前模块名👉", this.moduleName);
      this.taskInfoForm.taskName = this.m_taskName;
      this.taskInfoForm.principal = sessionStorage.getItem("username");
      this.taskInfoForm.participants = this.m_participants;
      this.taskInfoForm.disease = this.m_disease;
      this.taskInfoForm.comment = this.m_comment;
      if (this.m_disease.length < 1 && this.moduleName != "factorDis") {
        for (const item of this.m_dataDisList) {
          let index = this.disOptions.findIndex(({ name }) => name === item);
          if (index != -1) {
            this.disOptions[index].disable = false;
          }
        }
        // 只有第三个挖掘功能的时候才允许选择多疾病
        this.disOptions[0].disable = true;
        // 设置默认疾病
        for (const item of this.disOptions) {
          if (!item.disable) {
            this.taskInfoForm.disease = item.name;
            break;
          }
        }
        return;
      }

      // 第三个挖掘功能可选疾病设置
      if (this.moduleName == "factorDis") {
        for (const item of this.disOptions) {
          item.disable = true;
        }
        // 数据列表中有多疾病数据就显示
        if (this.m_dataDisList.findIndex((item) => item == "多疾病") != -1) {
          this.disOptions[0].disable = false;
          this.taskInfoForm.disease = this.disOptions[0].name;
        } else {
          this.$message({
            type: "warning",
            message: "暂无多疾病数据集",
          });
        }
      }
    },

    resetForm() {
      this.taskInfoForm.taskName = "";
      this.taskInfoForm.participants = "";
      this.taskInfoForm.comment = "";
      this.m_changeTaskInfo(this.taskInfoForm);
    },


    next() {
      if (
        this.taskInfoForm.taskName.length < 1 ||
        this.taskInfoForm.principal.length < 1
      ) {
        this.$message("请填写任务名称和负责人");
        return;
      }
      this.m_changeTaskInfo(this.taskInfoForm);
      console.log("taskInfoForm:", this.taskInfoForm);
      this.m_changeStep(2);
    },
  },
};
</script>

<style scoped>
#mainBox {
  margin-left: 10%;
  overflow: auto;
}
.form {
  width: 80vh;
  margin: auto;
}
.form .inputBox {
  width: 25%;
}
.form .shortItem {
  display: inline-block;
  margin-right: 12vh;
}
.form .inputBox:last-child {
  width: 50%;
}

.lineStyle {
  color: rgb(100, 172, 231);
}

#disGroup {
  width: 70%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.disGroup-item {
  width: 180px;
  margin-bottom: 10px;
}

/* 这里是最后的两个按钮固定在页面上 */
.buttonGroup {
  position: fixed;
  bottom: 10%; /* 距离页面底部 10px */
  left: 50%;
  transform: translateX(-50%); /* 水平居中 */
  width: 200px;
  z-index: 9999; /* 置于最顶层 */
  margin-left: 5%;
}

::v-deep .el-textarea__inner {
  height: 250px;
}
</style>


