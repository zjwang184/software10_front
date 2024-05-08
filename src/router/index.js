import Vue from "vue";
import VueRouter from "vue-router";

//用户登录
import Login from "@/components/tab/user/Login.vue";
import forget from "@/components/tab/user/forget.vue";
import register from "@/components/tab/user/register.vue";
import updatePassword from "@/components/tab/user/updatePassword.vue";
import userCenter from "@/components/tab/user/userCenter.vue";

import SideBar from "@/components/sideBar/index.vue";
import dash from "@/views/dash/index.vue";
import TaskManage from "@/components/tab/TaskManage.vue";
import DataManage from "@/components/tab/DataManage.vue";
import ModelManage from "@/components/tab/ModelManage.vue";
import ModelTraining from "@/components/tab/ModelTraining.vue";
import F_Factor from "@/components/tab/F_Factor.vue";
import FactorDis from "@/components/tab/FactorDis.vue";
import TableManage from "@/components/tab/TableManage.vue";
// import Login from "@/components/login/Login.vue";
// import Register from "@/components/login/register.vue";
import exceptionFeature from "@/components/tab/exceptionFeature";
import DiseaPredict from "@/components/tab/disea_predict/DiseaPredict.vue";
// import Login from "@/views/LogIn.vue";
import SoftwareIntro from "@/components/tab/SoftwareIntro.vue";
import TaskCheck from "@/components/tab/subcomponents/TaskCheck.vue";

// 系统管理的几个功能模块
import UserManage from "@/components/tab/sysManage/UserManage.vue";
import AdminDataManage from "@/components/tab/sysManage/AdminDataManage.vue";

import Inform from "@/components/tab/sysManage/Inform.vue";
import LogManage from "@/components/tab/sysManage/LogManage.vue";
import SettingDisease from "@/components/tab/sysManage/SettingDisease.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LogIn",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: register,
  },
  {
    path: "/forget",
    name: "forget",
    component: forget,
  },
  //个人中心
  {
    path: "/userCenter",
    name: "userCenter",
    component: userCenter,
    meta: { roles: ["1", "0"] },
  },
  //修改密码
  {
    path: "/updatePassword",
    name: "updatePassword",
    component: updatePassword,
    meta: { roles: ["1", "0"] },
  },

  {
    path: "/sideBar",
    //path: "/SoftwareIntro",
    name: "SideBar",
    //redirect: "/SoftwareIntro",
    component: SideBar,
    children: [
      {
        path: "dash",
        name: "dash",
        component: dash,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "TableManage",
        name: "TableManage",
        component: TableManage,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "DataManage",
        name: "DataManage",
        component: DataManage,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "ModelManage",
        name: "ModelManage",
        component: ModelManage,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "DiseaPredict",
        name: "DiseaPredict",
        component: DiseaPredict,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "SoftwareIntro",
        name: "SoftwareIntro",
        component: SoftwareIntro,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "TaskManage",
        name: "TaskManage",
        component: TaskManage,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "ModelTraining",
        name: "ModelTraining",
        component: ModelTraining,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "F_Factor",
        name: "F_Factor",
        component: F_Factor,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "FactorDis",
        name: "FactorDis",
        component: FactorDis,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "exceptionFeature",
        name: "exceptionFeature",
        component: exceptionFeature,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "/tab/subcomponents/TaskCheck",
        name: "TaskCheck",
        component: TaskCheck, // 将 TaskCheck 组件与路由关联
        meta: { roles: ["1", "0"] },
      },
      {
        path: "UserManage",
        name: "UserManage",
        component: UserManage,
        meta: { roles: ["0"] },
      },
      {
        path: "AdminDataManage",
        name: "AdminDataManage",
        component: AdminDataManage,
        meta: { roles: ["0"] },
      },
      {
        path: "Inform",
        name: "Inform",
        component: Inform,
        meta: { roles: ["0"] },
      },
      {
        path: "LogManage",
        name: "LogManage",
        component: LogManage,
        meta: { roles: ["0"] },
      },
      {
        path: "SettingDisease",
        name: "SettingDisease",
        component: SettingDisease,
        meta: { roles: ["0"] },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行 next('/login')强制跳转

  if (to.path === "/") return next();
  if (to.path === "/forget") return next();
  if (to.path === "/register") return next();

  //获取userRole
  const restrictedPathsForUserRole = [
    "/sideBar/UserManage",
    "/sideBar/AdminDataManage",
    "/sideBar/Inform",
    "/sideBar/LogManage",
    "/sideBar/SettingDisease",
  ];
  const userRole = window.sessionStorage.getItem("userRole");
  if (userRole === "1" && restrictedPathsForUserRole.includes(to.path)) {
    return next("/");
  }

  //获取token
  const uid = window.sessionStorage.getItem("userid");
  if (!uid) return next("/");
  next();
});
export default router;
