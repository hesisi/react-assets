// /*
//  * @Descripttion: 
//  * @version: 
//  * @Author: hesisi
//  * @Date: 2022-06-13 16:14:56
//  * @LastEditors: hesisi
//  * @LastEditTime: 2022-06-13 22:07:30
//  */
export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [{
      name: '用户管理',
      routes: [{
        name: '权限管理',
        path: '/userManage/auth',
        component: '@/pages/userManage/index',
        routes: [{
          name: '账号管理',
          path: '/account',
          component: '@/pages/userManage/index'
        },{
          name: '角色管理',
          path: '/rile',
          component: '@/pages/userManage/index'
        },{
          name: '组织管理',
          path: '/departmant',
          component: '@/pages/userManage/index'
        }]
      }]
    }, {
      name: '菜单管理',
      path: '/menuManage',
      // component: '@/layout/menuManageLayout',
      // routes: [{
      //   name: '系统管理',
      //   path: '/system',
      //   component: '@/pages/manuManage/index'
      // },{
      //   name: '菜单管理',
      //   path: '/menuList',
      //   component: '@/pages/manuManage/index'
      // }]
    }, {
      name: '流程管理',
      path: '/acticityManage',
      // component: '@/layout/activityManageLayout',
      // routes: [{
      //   name: '流程管理',
      //   path: '/activityList',
      //   component: '@/pages/activityManage/index'
      // },{
      //   name: '流程配置',
      //   path: '/activityConfig',
      //   component: '@/pages/activityManage/index'
      // }]
    }]
  },

]
