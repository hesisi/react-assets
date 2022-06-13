/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 16:14:56
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-13 18:05:03
 */
export default [
  { 
    path: '/', 
    component: '@/pages/index',
    routes: [{
      name: '用户管理',
      path: '/userManage',
      component: '@/layout/userManageLayout',
      routes: [{
        name: '',
        path: '/roleAdd'
      }]
    },{
      name: '权限管理',
      path: '/authManage',
      component: '@/layout/authManageLayout'
    },{
      name: '菜单管理',
      path: '/menuManage',
      component: '@/layout/menuManageLayout'
    },{
      name: '流程管理',
      path: '/acticityManage',
      component: '@/layout/activityManageLayout'
    }] 
  },
]