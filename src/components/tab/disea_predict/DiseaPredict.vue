<template>
  <div >
    <el-container>
      <el-header>
        <div id="step">
          <el-steps :active="step" align-center>
            <el-step title="选择任务" icon="el-icon-guide"></el-step>
            <el-step title="输入数据" icon="el-icon-edit"></el-step>
            <el-step title="结果" icon="el-icon-view"></el-step>
          </el-steps>
        </div>
      </el-header>

      <el-divider></el-divider>

      <el-main v-if="step == 1" class="mainBox1">
        <TaskSelectVue :moduleName="moduleName"></TaskSelectVue>
      </el-main>

      <el-main v-if="step == 2" class="mainBox">
        <DataInputVue :moduleName="moduleName"></DataInputVue>
      </el-main>

      <el-main v-if="step == 3" class="mainBox">
        <ResultDisplayVue :moduleName="moduleName"></ResultDisplayVue>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TaskSelectVue from "./TaskSelect.vue";
import DataInputVue from "./DataInput.vue";
import ResultDisplayVue from "./ResultDisplay.vue";

export default {
  name: "DiseaPredict",
  components: {
    TaskSelectVue,
    DataInputVue,
    ResultDisplayVue,
  },
  computed: {
    ...mapState("diseaPredict", ["step"]),
  },
  data() {
    return {
      moduleName: "diseaPredict",
    };
  },
  created() {
    console.log("进入到DiseaPredict");
  },
  methods: {},
};
</script>

<style scoped>

.mainBox1 {
  height: 1200px;
  /* overflow-y: auto; */
}
.mainBox {
  height:100%;
}

</style>
