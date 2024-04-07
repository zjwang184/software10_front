<template>
  <div>
    <div class="container">
      <div style="font-size: 50px">医学知识引导的多病种疾病风险预测强化学习工具软件</div>
     
        <div class="size-icon">
          <div class="icon">
            <div class="singleBox" @click="quickLink('DataManage')">
              <img
                src="@/assets/数据管理.png"
                class="imgStyle"
                style="border-radius: 15px"
              />
              <h3 style="font-size: 30px">数据管理</h3>
            </div>
          </div>

          <div class="icon">
            <div class="singleBox" @click="quickLink('exceptionFeature')">
              <img
                src="@/assets/知识管理.png"
                class="imgStyle"
                style="border-radius: 15px"
              />
              <h3 style="font-size: 30px">知识管理</h3>
            </div>
          </div>

          <div class="icon">
            <div class="singleBox" @click="quickLink('TaskManage')">
              <img
                src="@/assets/任务管理.png"
                class="imgStyle"
                style="border-radius: 15px"
              />
              <h3 style="font-size: 30px">任务管理</h3>
            </div>
          </div>

          
          <div class="icon">
            <div class="singleBox" @click="quickLink('TableManage')">
              <img
                src="@/assets/字段管理.png"
                class="imgStyle"
                style="border-radius: 15px"
              />
              <h3 style="font-size: 30px">字段管理</h3>
            </div>
          </div>
          <div class="icon">
            <div class="singleBox" @click="quickLink('ModelTraining')">
              <img
                src="@/assets/模型训练.png"
                class="imgStyle"
                style="border-radius: 15px"
              />
              <h3 style="font-size: 30px">模型训练</h3>
            </div>
          </div>
          <div class="icon">
            <div class="singleBox" @click="quickLink('DiseaPredict')">
              <img
                src="@/assets/风险预测.png"
                class="imgStyle"
                style="border-radius: 15px"
              />
              <h3 style="font-size: 30px">风险预测</h3>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {},
  data() {
    return {
      quickEntry: [
        
         
        {
          title: "任务管理",
          img: require("@/assets/model_intro.png"),
          router: "TaskManage",
        },
      ],
    };
  },

  methods: {
    quickLink(router) {
      this.$router.push(router);
    },
  },
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-flow: column;
}

.size-icon {
  font-size: 80px;
  display: grid;

  grid-template-columns: repeat(3, 400px);
  grid-template-rows: repeat(2, 300px);
  gap: 5px;
  justify-items: center;
  align-items: center;
  margin-top: 50px;
}
.icon {
  display: grid;
  place-items: center;
  text-align: center;
}
.icon svg-icon {
  max-width: 100%;
  vertical-align: middle;
}
.icon h3 {
  margin-top: 10px;
}
.imgStyle {
  height: 150px;
  width: 150px;
}
</style>
