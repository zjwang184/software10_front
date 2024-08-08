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
import TaskManage from "@/components/tab/createModel/model_manage/TaskManage.vue";
import DataManage from "@/components/tab/DataManage2.vue";
import ModelManage from "@/components/tab/ModelManage.vue";
import ModelTraining from "@/components/tab/createModel/model_training/ModelTraining.vue";
// import ModelTraining from "@/components/tab/ModelTraining.vue";
import TableManage from "@/components/tab/TableManage.vue";
// import Login from "@/components/login/Login.vue";
// import Register from "@/components/login/register.vue";
import exceptionFeature from "@/components/tab/exceptionFeature";
import DiseaPredict from "@/components/tab/disea_predict/DiseaPredict.vue";
// import Login from "@/views/LogIn.vue";
// import SoftwareIntro from "@/components/tab/SoftwareIntro.vue";
import TaskCheck from "@/components/tab/createModel/model_manage/TaskCheck.vue";

// 系统管理的几个功能模块
import UserManage from "@/components/tab/sysManage/UserManage.vue";
import AdminDataManage from "@/components/tab/sysManage/AdminDataManage.vue";

import Inform from "@/components/tab/sysManage/Inform.vue";
import LogManage from "@/components/tab/sysManage/LogManage.vue";
import SettingDisease from "@/components/tab/sysManage/SettingDisease.vue";

// 软件介绍
import operation from "@/components/tab/flooter/operation.vue";
import SoftwareIntro from "@/components/tab/flooter/SoftwareIntro.vue";

import { getRequest } from '@/api/user'
import { log } from "@antv/g2plot/lib/utils";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    // name: "LogIn",
    // component: Login,
    redirect: "/siderBar",
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
        path: "operation",
        name: "operation",
        component: operation,
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
        path: "exceptionFeature",
        name: "exceptionFeature",
        component: exceptionFeature,
        meta: { roles: ["1", "0"] },
      },
      {
        path: "TaskCheck",
        name: "TaskCheck",
        component: TaskCheck,
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
  base:'/software10/',
  routes,
});


// router.beforeEach((to, from, next) => {
//   //to将要访问的路径
//   //from代表从哪个路径跳转而来
//   //next是一个函数，表示放行
//   //next() 放行 next('/login')强制跳转

//   if (to.path === "/") return next();
//   if (to.path === "/forget") return next();
//   if (to.path === "/register") return next();

//   //获取userRole
//   const restrictedPathsForUserRole = [
//     "/sideBar/UserManage",
//     "/sideBar/AdminDataManage",
//     "/sideBar/Inform",
//     "/sideBar/LogManage",
//     "/sideBar/SettingDisease",
//   ];
//   const userRole = window.sessionStorage.getItem("userRole");
//   if (userRole === "1" && restrictedPathsForUserRole.includes(to.path)) {
//     return next("/");
//   }

//   //获取token
//   const uid = window.sessionStorage.getItem("userid");
//   if (!uid) return next("/");
//   next();
// });
// export default router;


// const router = new VueRouter({
//   routes,
// });/l

router.beforeEach(async (to, from, next) => {
   // 解析全局的查询字符串
   const queryString = window.location.search;
   const params = new URLSearchParams(queryString);
  //to将要访问的路径  //from代表从哪个路径跳转而来  //next是一个函数，表示放行  //next() 放行 next('/login')强制跳转
  console.log("111", queryString, params)
  try {
    //无权限页面不需要判断用户信息就放行
    if (to.path == '/unauthorized') {
      console.log("222")
      return next();
    }

    // 检查 session 里的用户信息
    const username = sessionStorage.getItem('username');
    console.log("username:"+username)
    // 如果没有用户信息
    if (!username) {
      console.log("333")
      console.log("to:"+JSON.stringify(to)+"   from:"+JSON.stringify(from))
      // 检查 URL 参数
      let repKey = to.query?.repKey;
      if(!repKey){
        repKey = from.query?.repKey;
      }
      console.log("repKey:", repKey);

      // 获取repKey参数
      if(!repKey){
        repKey = params.get('repKey');
        console.log("repKey params:", repKey);
      }

      if (repKey) {
        // 绵阳单点登录
        // 使用 Promise 处理异步请求
        // getRequest(`/login?repKey=${repKey}`).then(resp => {
        //   if (resp) {
        //     console.log("后台回复的code", resp.code);
        //     console.log("后台回复的UserName", resp.data.username);
        //     console.log("后台回复的UserCode", resp.data.uid);
        //     if (resp.code == "200") {
        //       sessionStorage.setItem("username", resp.data.username);
        //       sessionStorage.setItem("userid", resp.data.uid);
        //       sessionStorage.setItem("userrole", resp.data.role);
        //       return next('/SoftwareIntro'); // 跳转到 SoftwareIntro 页面
        //     } else {
        //       return next('/unauthorized');
        //     }
        //   } else {
        //     return next('/unauthorized');
        //   }}).catch(error => {
        //     console.error('获取用户信息时出错:', error);
        //     return next('/unauthorized');
        //   });
        // const resp = await getRequest(`/login?repKey=${repKey}`);
        // if (resp) {
        //   console.log("后台回复的code", resp.code);
        //   console.log("后台回复的UserName", resp.data.username);
        //   console.log("后台回复的UserCode", resp.data.uid);
        //   if (resp.code == "200") {
        //     sessionStorage.setItem("username", resp.data.username);
        //     sessionStorage.setItem("userid", resp.data.uid);
        //     sessionStorage.setItem("userrole", resp.data.role);
        //     return next('/SoftwareIntro'); // 跳转到 SoftwareIntro 页面
        //   } else {
        //     return next('/unauthorized');
        //   }
        // } else {
        //   return next('/unauthorized');
        // }
        const resp = await getRequest(`/user/login?key=${repKey}`);
        if (resp) {
          console.log("444")
          console.log("后台回复的code", resp.code);
          console.log("后台回复的UserName", resp.data.username);
          console.log("后台回复的UserCode", resp.data.uid);
          if (resp.code == "200") {
            sessionStorage.setItem("username", resp.data.username);
            sessionStorage.setItem("userid", resp.data.uid);
            sessionStorage.setItem("userrole", resp.data.role);
            return next('/sideBar/dash'); // 跳转到 SoftwareIntro 页面
          } else {
            console.log("555")
            return next('/unauthorized');
          }
        } else {
          console.log("666")
          return next('/unauthorized');
        }
      } else {
        // 跳转到未授权页面
        console.log("777")
        return next({ path: '/unauthorized' });
      }
    } else {
      console.log("888")
      //这里写你原来的路由逻辑，下面是我的代码示例
      // 如果有用户信息，检查白名单
      const whiteList = ['/logIn', '/register', '/unauthorized', '/forget','/siderBar'];
      if (whiteList.indexOf(to.path) !== -1) {
        // 如果在白名单中，则直接放行
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
        // next();
        return next();
      } else {
        console.log("999")
        // const userRoles = sessionStorage.getItem('userrole'); // 从 sessionStorage 获取用户角色信息
        // let record = to.matched[to.matched.length - 1]; // 获取当前匹配路由的最右侧路由
        // let isAuthorized = false; // 初始化权限标志为 false

        // if (record.meta.roles) {
        //   // 检查用户角色是否在路由允许的角色列表中
        //   if (record.meta.roles.includes(userRoles)) {
        //     isAuthorized = true; // 如果找到匹配的角色，设置权限标志为 true
        //   }
        // }

        // if (isAuthorized) {
        //   if (to.path === "/TaskResult") {
        //     store.commit("SetSideBarPath", "/taskManage");
        //   } else {
        //     store.commit("SetSideBarPath", to.path);
        //   }
        //   return next(); // 用户有权限，允许访问
        // } else if (to.matched.some(record => record.meta.roles)) {
        //   return next({ path: '/unauthorized' }); // 用户无权限，重定向到未授权页面
        // } else {
        //   if (to.path === "/TaskResult") {
        //     store.commit("SetSideBarPath", "/taskManage");
        //   } else {
        //     store.commit("SetSideBarPath", to.path);
        //   }
        //   return next(); // 如果没有定义 roles 元数据，允许所有用户访问
        // }
        return next(); 
      }
    }
  } catch (error) {
    console.log("hyhyhyhy")
    // 如果代码有问题，可以在这里捕获并处理错误
    console.error('导航守卫出错:', error);
    // 跳转到未授权页面
    return next({ path: '/unauthorized' });
  }
});


// });
export default router;
