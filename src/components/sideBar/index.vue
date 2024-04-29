<template>
  <div>
    <el-container>
      <el-header class="header">
        <el-menu
          :default-active="activeIndex"
          background-color="#071135"
          text-color="#fff"
          active-text-color="#fff"
          class="el-menu-demo"
          mode="horizontal"
        >
          <span index="1" style="float: left; color: cornflowerblue">
            <i class="el-icon-box"></i>
            <span style="font-size: 20px"
              >医学知识引导的多病种疾病风险预测强化学习工具软件</span
            >
          </span>
          <!--            <template slot="title">当前服务器：</template>-->
          <el-dropdown style="float: right; margin-right: 30px">
            <span
              class="el-dropdown-link"
              style="float: right; color: #fff; font-size: 15px"
              ><i class="el-icon-user"></i>欢迎你，{{ LoginUserName }}</span
            ><i
              style="color: #fff"
              class="el-icon-arrow-down el-icon--right"
            ></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toUserCenter"
                >个人信息</el-dropdown-item
              >
              <el-dropdown-item @click.native="updatePass"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item @click.native="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="220px" class="side">
          <el-menu
            default-active="1"
            router
            class="el-menu-vertical-demo"
            background-color="#071135"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="changeMenu()"
            :default-openeds="['task', 'settings']"
          >
            <el-menu-item index="/sideBar/dash">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/sideBar/DataManage">
              <i class="el-icon-s-data"></i>
              <span slot="title">数据管理</span>
            </el-menu-item>
            <el-submenu index="task">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">模型训练</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/sideBar/ModelTraining">
                  <i class="el-icon-s-claim"></i>
                  <span slot="title">新建训练任务</span></el-menu-item
                >
                <el-menu-item index="/sideBar/taskManage"
                  ><i class="el-icon-s-grid"></i
                  ><span slot="title">历史任务查看</span></el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/sideBar/DiseaPredict"
              ><i class="el-icon-s-cooperation"></i>
              <span slot="title">疾病风险预测</span></el-menu-item
            >

            <el-submenu index="settings">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span slot="title">系统设置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/sideBar/UserManage">
                  <i class="el-icon-user-solid"></i>
                  <span slot="title"> 用户管理</span></el-menu-item
                >
                <el-menu-item index="/sideBar/AdminDataManage">
                  <i class="el-icon-s-data"></i>
                  <span slot="title">数据管理</span></el-menu-item
                >
                <el-menu-item index="/sideBar/exceptionFeature"
                  ><i class="el-icon-s-opportunity"></i>
                  <span slot="title">知识管理</span></el-menu-item
                >
                <el-menu-item index="/sideBar/Inform"
                  ><i class="el-icon-message-solid"></i>
                  <span slot="title">通知管理</span></el-menu-item
                >
                <el-menu-item index="/sideBar/LogManage"
                  ><i class="el-icon-s-order"></i>
                  <span slot="title">日志管理</span></el-menu-item
                >
                <el-menu-item index="/sideBar/SettingDisease"
                  ><i class="el-icon-s-platform"></i>
                  <span slot="title">参数设置</span></el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>

            <div class="menu-footer">
              <el-menu-item index="/sideBar/SoftwareIntro">
                <i class="el-icon-s-data"></i>
                <span slot="title"> 软件介绍</span>
              </el-menu-item>
              <el-menu-item>
                <i class="el-icon-s-help"></i
                ><span slot="title"> 操作手册</span></el-menu-item
              >
            </div>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- <app-main></app-main> -->
          <router-view></router-view>
        </el-main>
      </el-container>

      <el-footer>
        <h1>
          重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2023 All
          Rights Reserved
        </h1>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import AppMain from "@/components/AppMain";
export default {
  // components: { AppMain },
  mounted() {
    this.LoginUserName = sessionStorage.getItem("username");
  },
  computed: {},
  data() {
    return {
      activeIndex: "0",
      // describVision: false,
      LoginUserName: "",
    };
  },
  methods: {
    ...mapMutations("modelTraining", { dfChangeStep: "ChangeStep" }),
    changeMenu() {
      // this.dfChangeStep(1);
    },
    logout() {
      sessionStorage.clear();
      this.$router.replace("/");
    },
    toUserCenter() {
      this.$router.replace("/userCenter");
    },
    updatePass() {
      this.$router.replace("/updatePassword");
    },
  },
};
</script>

<style scoped>
.el-icon-mobile-phone {
  color: white;
}
.el-menu-item {
  color: aliceblue;
}

.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  height: 100%;
  /*解决侧边栏凸起问题*/
  border-right: none;
}
.el-menu-vertical-demo span {
  font-size: 14px;
}
.header {
  background-color: #071135;
  color: #333;
  /* text-align: center; */
  line-height: 60px;
}

.side {
  color: #333;
  height: calc(100vh - 81px);
  position: relative;
}

.main {
  height: calc(100vh - 81px);
  /* background-color: #333; */
  /* width: 100vh; */
  overflow: auto;
}

.el-footer {
  height: 21px !important;
  font-size: 10px;
  background-color: #a5a5a5bb;
  color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-footer {
  bottom: 30px;
  position: absolute;
}
</style>
