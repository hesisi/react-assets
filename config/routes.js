/*
 * @Descripttion: 路由配置文件，会根据该文件生成头部一级菜单以及左侧菜单树，左侧菜单树可以不限层级添加（建议最好不要超过两级）
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:14:56
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-08 10:05:37
 */
import React from 'react';
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';

export default [
  {
    path: '/',
    redirect: '/homeIndex',
  },
  {
    name: '主页',
    path: '/homeIndex',
    component: '@/layouts/homeIndex/index',
    meta: { showMenu: false, showHeader: true },
    routes: [
      {
        name: '首页',
        path: '/homeIndex',
        component: '@/pages/homeIndex/index',
      },
    ],
  },
  {
    name: '用户管理',
    path: '/userManage',
    component: '@/layouts/userManageLoyout/index',
    routes: [
      {
        path: '/userManage',
        redirect: '/userManage/authManage',
      },
      {
        name: '权限管理',
        icon: React.createElement(LaptopOutlined),
        path: '/userManage/authManage',
        component: '@/layouts/basicLayout',
        routes: [
          {
            path: '/userManage/authManage',
            redirect: '/userManage/authManage/account',
          },
          {
            name: '账号管理',
            path: '/userManage/authManage/account',
            component: '@/pages/userManage/authManage/account',
            exact: true,
          },
          {
            name: '角色管理',
            path: '/userManage/authManage/role',
            component: '@/pages/userManage/authManage/role',
          },
        ],
      },
      {
        name: '组织管理',
        icon: React.createElement(NotificationOutlined),
        path: '/userManage/orginationManage',
        component: '@/pages/userManage/orginationManage/index',
      },
    ],
  },
  {
    name: '菜单管理',
    path: '/menuManage',
    component: '@/layouts/menuManageLayout',
    routes: [
      {
        path: '/menuManage',
        redirect: '/menuManage/menuList',
      },
      {
        name: '系统管理',
        path: '/menuManage/systemManage',
        component: '@/pages/menuManage/systemManage',
      },
      {
        name: '菜单管理',
        path: '/menuManage/menuList',
        component: '@/pages/menuManage/menuList',
      },
    ],
  },
  {
    name: '流程管理',
    path: '/activityManage',
    component: '@/layouts/activityManageLayout',
    routes: [
      {
        path: '/activityManage',
        redirect: '/activityManage/activityConfig',
      },
      {
        name: '流程管理',
        path: '/activityList/',
        component: '@/pages/activityManage/activityList/activityList',
      },
      {
        name: '流程配置2',
        path: '/activityManage/activitConfig2',
        component: '@/pages/activityManage/activitConfig2',
      },
      {
        name: '流程配置',
        path: '/activityManage/activityConfig',
        component: '@/pages/activityManage/activityConfig',
      },
    ],
  },
  {
    name: '表单管理',
    path: '/formManage',
    component: '@/layouts/formManageLayout',
    routes: [
      {
        path: '/formManage',
        redirect: '/formManage/formAdd',
      },
      // {
      //   name: '新建表单',
      //   path: '/formManage/formAdd',
      //   component: '@/pages/formManage/formDesinger',
      //   hidden: true,
      // },
      {
        name: '新建表单/列表',
        path: '/formManage/formAndTable',
        component: '@/pages/formAndTable',
        hidden: true,
      },
      {
        name: '动态表单',
        path: '/formManage/formList',
        component: '@/pages/formManage/formList',
        meta: { showMenu: false, showHeader: false },
      },
      {
        name: '动态表单demo',
        path: '/formManage/formPreview',
        component: '@/pages/formManage/formPreview',
        meta: { showMenu: false, showHeader: false },
      },
    ],
  },
  {
    name: '主页管理',
    path: '/pageManage',
    component: '@/layouts/pageManageLayout/index',
    routes: [
      {
        path: '/pageManage',
        redirect: '/pageManage/homePage',
      },
      {
        name: '首页管理',
        path: '/pageManage/homePage',
        component: '@/pages/pageManage/homePage/index',
        meta: { showMenu: false, showHeader: true },
      },
    ],
  },
  {
    name: '菜单预览',
    path: '/previewPage/menuPreview',
    component: '@/pages/previewPage/menuPreview',
    meta: { navHidden: true },
  },
  {
    name: '页面预览',
    path: '/previewPage/pagePreview',
    component: '@/pages/previewPage/pagePreview',
    meta: { navHidden: true },
  },
  {
    name: '首页预览',
    path: '/previewPage/homePage',
    component: '@/pages/previewPage/homePage',
    meta: { navHidden: true },
  },
  {
    name: '动态报表',
    // path: 'http://www.baidu.com',
    // component: '@/layouts/formManageLayout',
  },
];
