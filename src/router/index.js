import Vue from 'vue'
import VueRouter from 'vue-router'

//用户登录
import Login from '@/components/tab/user/Login.vue'
import forget from '@/components/tab/user/forget.vue'
import register from '@/components/tab/user/register.vue'

import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import TaskManage from "@/components/tab/TaskManage.vue";
import DataManage from "@/components/tab/DataManage.vue";
import ModelManage from "@/components/tab/ModelManage.vue";
import ModelTraining from "@/components/tab/ModelTraining.vue"
import F_Factor from "@/components/tab/F_Factor.vue";
import FactorDis from "@/components/tab/FactorDis.vue";
import TableManage from "@/components/tab/TableManage.vue";
// import Login from "@/components/login/Login.vue";
// import Register from "@/components/login/register.vue";
import exceptionFeature from "@/components/tab/exceptionFeature";
import DiseaPredict from '@/components/tab/disea_predict/DiseaPredict.vue';
// import LogIn from "@/views/LogIn.vue"
import SoftwareIntro from "@/components/tab/SoftwareIntro.vue";
import TaskCheck from '@/components/tab/subcomponents/TaskCheck.vue'; 

// 系统管理的几个功能模块
import UserManage from '@/components/tab/sysManage/UserManage.vue';
import AdminDataManage from '@/components/tab/sysManage/AdminDataManage.vue';

import Inform from '@/components/tab/sysManage/Inform.vue';
import LogManage from '@/components/tab/sysManage/LogManage.vue';
import SettingDisease from '@/components/tab/sysManage/SettingDisease.vue';
Vue.use(VueRouter)



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
      },
      {
        path: "TableManage",
        name: "TableManage",
        component: TableManage,
      },
      {
        path: "DataManage",
        name: "DataManage",
        component: DataManage,
      },
      {
        path: "ModelManage",
        name: "ModelManage",
        component: ModelManage,
      },
      {
        path: "DiseaPredict",
        name: "DiseaPredict",
        component: DiseaPredict,
      },
      {
        path: "SoftwareIntro",
        name: "SoftwareIntro",
        component: SoftwareIntro,
      },
      {
        path: "TaskManage",
        name: "TaskManage",
        component: TaskManage,
      },
      {
        path: "ModelTraining",
        name: "ModelTraining",
        component: ModelTraining,
      },
      {
        path: "F_Factor",
        name: "F_Factor",
        component: F_Factor,
      },
      {
        path: "FactorDis",
        name: "FactorDis",
        component: FactorDis,
      },
      {
        path: "exceptionFeature",
        name: "exceptionFeature",
        component: exceptionFeature,
      },
      {
        path: '/tab/subcomponents/TaskCheck',
        name: 'TaskCheck',
        component: TaskCheck, // 将 TaskCheck 组件与路由关联
      },
      {
        path: 'UserManage',
        name: 'UserManage',
        component: UserManage, 
      },
      {
        path: 'AdminDataManage',
        name: 'AdminDataManage',
        component: AdminDataManage, 
      },
      {
        path: 'Inform',
        name: 'Inform',
        component: Inform, 
      },
      {
        path: 'LogManage',
        name: 'LogManage',
        component: LogManage, 
      },
      {
        path: 'SettingDisease',
        name: 'SettingDisease',
        component: SettingDisease, 
      },
    ],
  },
];

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行 next('/login')强制跳转

  if (to.path === '/') return next();
  if(to.path==='/register') return next();
  //获取token
  const uid = window.sessionStorage.getItem('userid');
  if (!uid) return next('/');
  next();
});
export default router
