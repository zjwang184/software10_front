<template>
  <div class="main">
    <div id="pdf_1">
      <div class="top">
        <el-card>
          <h2 v-if="predValue == 1" style="color: red" align="center">
            <span style="color: black">患病风险：</span> 高风险
          </h2>
          <h2
            v-if="predValue == 0"
            style="color: rgb(0, 255, 76)"
            align="center"
          >
            <span style="color: black">患病风险：</span>低风险
          </h2>
          <h3>患者信息：</h3>
        </el-card>
        <!-- 特征信息 -->
        <div class="tableData">
          <el-table
            :data="tableDataArray"
            stripe
            class="custom-table"
            fit
            align="center"
            fixed="left"
            :header-cell-style="headerCellStyle"
          >
            <el-table-column
              v-for="(value, key) in tableData"
              :key="key"
              :prop="key"
              :label="key"
              width="auto"
            >
              <template>
                <div class="truncate-text">{{ value }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div></div>
      </div>
    </div>

    <div id="pdf_2">
      <div class="bottom">
        <div
          style="
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px;
          "
        >
          各特征对结果的影响
        </div>
        <div class="box">
          <div class="description">
            下图为瀑布图，横轴为SHAP值，纵轴是该样本各个特征的取值；
            蓝色代表该特征对预测有负向影响（箭头朝左，SHAP值减少），红色代表该特征对预测有正向影响（箭头超右，SHAP值增加）；
          </div>
          <div>
            <img :src="imgurl1" alt="Image" />
          </div>
          <div class="description">
            下图为力图，蓝色代表该特征对预测有负向影响（箭头朝左，SHAP值减少），红色代表该特征对预测有正向影响（箭头超右，SHAP值增加）
          </div>
          <div>
            <img :src="imgurl2" alt="Image" />
          </div>
        </div>
      </div>
    </div>

    <div class="buttonGroup">
      <el-button @click="backStep()" round>上一步</el-button>
      <!-- <el-button type="success" @click="exportToPDF()" round
        >导出结果</el-button
      > -->
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import jsPDF from "jspdf";
import XLSX from "xlsx";
import PlusAndMinusBarVue from "../subcomponents/PlusAndMinusBar.vue";
import html2canvas from "html2canvas";
import { getRequest } from "@/api/user";

export default {
  name: "ResultDisplay",
  mixins: [vuex_mixin],
  components: {
    PlusAndMinusBarVue,
  },
  props: {
    moduleName: {
      type: String,
      default: "diseaPredict",
    },
  },
  data() {
    return {
      predValue: "",
      tableData: [],
      imageUrl: "",
      imgurl1: "",
      imgurl2: "",
    };
  },
  mounted() {
    this.init();
    // console.log("typeof XLSX",typeof XLSX);
    // if (typeof XLSX === "undefined") {
    //   console.error("XLSX is not available.");
    // } else {
    //   console.log("XLSX is available.");
    // };

    // this.getKnowledge();
  },
  computed: {
    tableDataArray() {
      return [this.tableData];
    },
    headerCellStyle() {
      return {
        color: "black",
      };
    },
  },
  methods: {
    init() {
      this.tableData = this.m_personForm;
      delete this.tableData.featuredata;
      delete this.tableData.modelname;
      delete this.tableData.taskname;
      this.predValue = this.m_predValue;
      // this.getImageFromBackend();
      this.imgurl1 = `http://10.16.97.233:8088/fig/${this.m_predict_task_name}_${this.m_predict_model_name}_shap2.png`;
      this.imgurl2 = `http://10.16.97.233:8088/fig/${this.m_predict_task_name}_${this.m_predict_model_name}_shap1.png`;
      console.log("imgurl:", this.imgurl1, this.imgurl2);
      console.log("this.tableData   ", this.tableData);
      console.log("this.m_patient_form2222222   ", this.m_patient_form);
      console.log("this.predValue   ", this.predValue);
    },

    async exportRes() {
      // this.exportExcel();
      const divsToExport = ["pdf_1", "pdf_2"];
      const pdf_positions = [
        { x: 5, y: 10 },
        { x: 5, y: 55 },
      ];
      const pdf = new jsPDF();
      const renderPromises = divsToExport.map((divId, index) => {
        const div = document.getElementById(divId);
        return html2canvas(div).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          const position = pdf_positions[index] || { x: 0, y: 0 };
          pdf.addImage(
            imgData,
            "PNG",
            position.x,
            position.y,
            pdfWidth,
            pdfHeight
          );
        });
      });

      await Promise.all(renderPromises);
      // pdf.save(`${this.m_taskName}.pdf`);
      pdf.save("预测报告.pdf");
    },
    next() {
      console.log("1111111");
      this.m_changeStep(3);
      console.log("222222");
    },

    backStep() {
      this.m_changeStep(2);
    },
  },
};
</script>

<style>
.main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.top {
  height: auto;
  width: 90%;
  margin: 0 auto; /* 居中 */
  border: 2px solid grey; /* 灰色边框 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* 边框阴影 */
}

.risk {
  margin-top: 20px;
  font-size: 36px; /* 大号字体大小 */
  color: red; /* 红色文本颜色 */
  text-align: center; /* 文本居中 */
}

.bottom {
  /* display: flex; */
  justify-content: center;
  height: auto;
  width: 90%;
  margin: 20px auto; /* 顶部和底部留有间距，并居中 */
  border: 2px solid rgb(10, 7, 7); /* 灰色边框 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* 边框阴影 */
}

.box {
  height: 80%;
  width: 90%;
  margin: 30px;
  margin-left: 4%;
  padding: 20px;
  border: 2px solid black;
}

.box div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.description {
  background-color: rgba(99, 97, 97, 0.1);
  margin-bottom: 10px;
  padding: 10px;
  height: auto;
  text-align: center;
}

.custom-table tr {
  background-color: hwb(197 81% 5%) !important;
}

.tableData {
  width: auto;
  height: auto;
  overflow-y: auto;
  margin: auto; /* 使用 margin: auto; 实现水平和垂直居中 */
  display: block;
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.image-container {
  width: 100%;
  height: auto;
}

img {
  max-width: 100%;
  height: auto;
}

.buttonGroup {
  margin: 20px auto; /* 顶部和底部留有间距，并居中 */
}
</style>
