<template>
  <div id="mainBox">
    <div class="info">
      <span> 模型训练： </span>
      <br />
      <span
        >在进行疾病预测任务之前您需要训练模型, 通过训练好的模型对个人进行疾病风险预测</span
      >
    </div>
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
          <span>任务（模型）名称</span
          ><el-popover placement="top" trigger="hover">
            <div>任务名称仅允许出现汉字、英文字母、数字及下划线</div>
            <el-icon
              class="el-icon-warning-outline"
              slot="reference"
              style="font-size: 15px; margin-left: 20px"
            ></el-icon>
          </el-popover>
        </template>
        <el-input
          v-model="taskInfoForm.taskName"
          placeholder="任务名称仅允许出现汉字、英文字母、数字及下划线"
          @blur="checkTaskNameUnique"
        ></el-input>
      </el-form-item>
      <el-form-item prop="principal" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务负责人</span>
        </template>
        <el-input v-model="taskInfoForm.responsiber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="participants" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>参与人员</span>
        </template>
        <el-input v-model="taskInfoForm.participants"></el-input>
      </el-form-item>
      <div></div>

      <el-form-item prop="remark" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务备注</span>
        </template>
        <el-input
          v-model="taskInfoForm.remark"
          type="textarea"
          placeholder="请填写任务备注......"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="buttonGroup">
      <el-button @click="resetForm()" round>清除</el-button>
      <el-button type="primary" @click="next()" round>下一步</el-button>
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      taskInfoForm: {
        taskName: "",
        responsiber: "",
        participants: "",
        remark: "",
      },
      showWarning: false,
      taskNameUnique: 0,
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
    init() {
      this.tips();  // 弹出提示
      this.synchronous();  // 同步保存的信息
    },

    // 弹出提示
    tips(){
      this.$notify({
        title: "提示",
        message: "请填写任务信息进行下一步操作",
        type: "success",
      });
    },

    // 同步保存的信息
    synchronous(){
      this.taskInfoForm.taskName = this.m_train_model.taskName;
      this.taskInfoForm.responsiber = sessionStorage.getItem("username");
      this.taskInfoForm.participants = this.m_train_model.participants;
      this.taskInfoForm.remark = this.m_train_model.remark;
    },

    // 检查任务名称
    checkTaskNameUnique() {
      if (this.taskInfoForm.taskName.trim()) {
        this.$axios
          .get(`/Task/existstaskname?name=${this.taskInfoForm.taskName}`)
          .then((res) => {
            console.log("res", res);
            this.taskNameUnique = res.data;
            if (this.taskNameUnique === 1) {
              this.$message.warning("任务名称已存在！");
            } else {
              this.$message.success("任务名称可用！");
            }
          })
          .catch((err) => {
            console.error(err);
            this.$message.error("检查任务名称时出错！");
          });
      }
    },

    // 重置任务信息
    resetForm() {
      this.taskInfoForm.taskName = "";
      this.taskInfoForm.participants = "";
      this.taskInfoForm.remark = "";
      
      this.m_changeModelTrain(this.taskInfoForm);
      console.log("this.m_train_model", this.m_train_model)
    },

    // 下一步
    next() {
      // 定义一个正则表达式，匹配不允许出现的字符
      const illegalCharacters = /[^\w\u4e00-\u9fa5]/;

      // 检查任务名称是否包含非法字符
      if (illegalCharacters.test(this.taskInfoForm.taskName)) {
        this.$message({
          showClose: true,
          message: "任务名称不允许出现非法字符",
          type: "error",
        });
        return;
      }

      if (this.taskInfoForm.taskName.length < 1) {
        this.$message({
          showClose: true,
          message: "请填写任务名称",
          type: "error",
        });
        return;
      }
      if (this.taskNameUnique === 1) {
        console.log("");
        this.$message.warning("任务名称已存在！");
        return;
      }

      this.m_changeModelTrain(this.taskInfoForm);
      console.log("this.m_train_model", this.m_train_model)
      this.$notify({
        title: "任务信息填写成功",
        message: "请选择数据集进行下一步操作",
        type: "success",
      });
      this.m_changeStep(2);
    },
  },
};
</script>

<style scoped>
#mainBox {
  margin: 0 auto;
  overflow: auto;
}
.info {
  height: 4rem;
  background-color: rgba(139, 187, 233, 0.2);
  line-height: 2rem;
  text-align: left;
  margin-bottom: 20px;
  margin-left: 20%;
  width: 48vw;
}

.info span:first-child {
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
}

.info span:nth-child(3) {
  margin-left: 2rem;
}
.form {
  width: 60vw;
  margin-left: 20%;
}
.form .inputBox {
  width: 35%;
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
  height: 200px;
  width: 48vw;
}
::v-deep .el-textarea__inner:focus {
  height: 300px;
  transition: all 0.5s ease;
}
</style>


