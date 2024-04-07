<template>
    <el-table
      :data="tableData"
      v-if="is_show"
      style="width: 100%">

      <el-table-column
        prop="age"
        label="年龄"
        width="120">
      </el-table-column>
      <el-table-column
        prop="glucose"
        label="2小时血浆葡萄糖浓度"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bloodPressure"
        label="舒张压(mm Hg)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bmi"
        label="体重指数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="diabetesPedigreeFunction"
        label="糖尿病谱系功能"
        width="120">
      </el-table-column>
      <el-table-column
        prop="insulin"
        label="2小时血清胰岛素"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pregnancies"
        label="怀孕次数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="skinThickness"
        label="三头肌皮肤褶皱厚度(mm)"
        width="120">
      </el-table-column>
    </el-table>

    <h1 v-else-if="!is_show"> 无数据 </h1>
  </template>
  
  <script>
  import {getRequest,postRequest} from '@/api/user'

  export default {
    name:"Table",
    props:{
      table: String,
    },
    data () {
      return {        
        is_show: true,
        tableData: []
      }
    },
    mounted() {
        this.initTable();
        
    },
    
    methods: {
      initTable(){
        console.log("table vue table",this.table)
        if(this.table == "kaggle_diabetes" ){
            this.is_show = true;
            getRequest("/ten/data/diabetes").then((res)=>{
                this.tableData = res.data;
                console.log("train step1 table:", this.tableData);
            }).catch(error=>{
                console.log(error);
            })
        }else{
          this.is_show = false;
        }
        
        },
    }
  }
  </script>