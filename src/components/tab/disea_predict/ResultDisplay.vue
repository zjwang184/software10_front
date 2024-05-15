<template>
  <div class="main">
    <div id="pdf_1">
      <div class="top">
        <!-- 风险预测 -->
        <!-- <div>
          <h1 style="color: red; font-size: 40px" align="center">高风险</h1>
        </div> -->
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
          <!-- <div
            v-for="(item, index) in cardItems"
            :key="index"
            class="text item"
          >
            <el-card shadow="hover">

              {{ item }}
            </el-card>
          </div> -->
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
          <div>这里是展示结果介绍</div>
          <div>
            <img :src="imgurl1" alt="Image" />
          </div>
          <div>
            <img :src="imgurl2" alt="Image" />
          </div>
          <!-- <img src="http://10.16.97.233:8088/fig/shap2.png" alt="Image" style="margin-left: 25%;"/>
            <img src="http://10.16.97.233:8088/fig/shap1.png" alt="Image" style="margin-left: 5%;"/> -->

          <!-- <PlusAndMinusBarVue /> -->
        </div>
      </div>
    </div>

    <div class="buttonGroup">
      <el-button @click="backStep()" round>上一步</el-button>
      <!-- <el-button type="success" @click="exportRes()" round>导出结果</el-button> -->
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

    exportExcel() {
      /* 从表生成工作簿对象 */
      this.type = "";
      setTimeout(() => {
        var wb = XLSX?.utils.table_to_book(
          document.querySelector("#out-table")
        );
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX?.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            `${this.m_taskName}-特征分布表格.xlsx`
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }, 1000);
    },
    async exportRes() {
      this.exportExcel();
      const divsToExport = ["pdf_1", "pdf_2"];
      const pdf_positions = [
        { x: 5, y: 10 },
        { x: 5, y: 100 },
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
      pdf.save(`${this.m_taskName}.pdf`);
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

.box div:first-child {
  background-color: rgba(99, 97, 97, 0.1);
  margin-bottom: 10px;
  padding: 10px;
  height: 40px;
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
