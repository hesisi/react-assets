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
    redirect: '/login',
  },
  {
    name: '主页',
    path: '/homeIndex',
    component: '@/layouts/homeIndex/index',
    meta: { showMenu: false, showHeader: true },
    key: 'default-1',
    routes: [
      {
        name: '首页',
        path: '/homeIndex',
        component: '@/pages/homeIndex/home',
      },
    ],
  },
  {
    name: '消息中心',
    path: '/notificationCenter',
    component: '@/layouts/homeIndex/index',
    key: 'default-2',
    meta: { showMenu: false, showHeader: true },
    routes: [
      {
        path: '/notificationCenter',
        redirect: '/notificationCenter/notificationList',
      },
      {
        name: '消息列表',
        path: '/notificationCenter/notificationList',
        component: '@/pages/notificationCenter/index',
        meta: { showMenu: false, showHeader: true },
      },
    ],
  },
  {
    name: '用户管理',
    path: '/userManage',
    component: '@/layouts/userManageLoyout/index',
    key: 'default-3',
    meta: { showMenu: false, showHeader: true },
    routes: [
      {
        path: '/userManage',
        redirect: '/userManage/authManage',
        meta: { showMenu: true, showHeader: true },
      },
      {
        name: '权限管理',
        icon: React.createElement(LaptopOutlined),
        path: '/userManage/authManage',
        component: '@/layouts/basicLayout',
        key: 'default-3-1',
        routes: [
          {
            path: '/userManage/authManage',
            redirect: '/userManage/authManage/account',
          },
          {
            name: '用户管理',
            path: '/userManage/authManage/account',
            component: '@/pages/userManage/authManage/account/index.jsx',
            exact: true,
            key: 'default-3-1-1',
            meta: { showMenu: true, showHeader: true },
          },
          {
            name: '分组管理',
            path: '/userManage/authManage/accountGroup',
            component: '@/pages/userManage/authManage/accountGroup/index.jsx',
            exact: true,
            key: 'default-3-1-2',
            meta: { showMenu: true, showHeader: true },
          },
          {
            name: '角色管理',
            path: '/userManage/authManage/role',
            component: '@/pages/userManage/authManage/role',
            key: 'default-3-1-3',
            meta: { showMenu: true, showHeader: true },
          },
        ],
      },
      // {
      //   name: '组织管理',
      //   key: 'default-3-2',
      //   icon: React.createElement(NotificationOutlined),
      //   path: '/userManage/orginationManage',
      //   component: '@/pages/userManage/orginationManage/index',
      //   meta: { showMenu: false, showHeader: true },
      // },
    ],
  },
  {
    name: '菜单管理',
    key: 'default-3-4',
    path: '/menuManage',
    component: '@/layouts/menuManageLayout',
    routes: [
      {
        path: '/menuManage',
        redirect: '/menuManage/menuList',
      },
      // {
      //   name: '系统管理',
      //   path: '/menuManage/systemManage',
      //   component: '@/pages/menuManage/systemManage',
      // },
      {
        name: '菜单管理',
        path: '/menuManage/menuList',
        component: '@/pages/menuManage/menuList',
        meta: { showMenu: false, showHeader: true },
      },
    ],
  },
  {
    name: '流程管理',
    path: '/activityManage',
    component: '@/layouts/activityManageLayout',
    key: 'default-5',
    routes: [
      {
        path: '/activityManage',
        redirect: '/activityManage/activityList',
      },
      {
        name: '流程列表',
        path: '/activityManage/activityList',
        component: '@/pages/activityManage/activityList/activityList.tsx',
        meta: {
          showMenu: false,
          showHeader: true,
          breadcrumb: [{ label: '流程管理' }],
        },
      },
      {
        name: '流程配置',
        path: '/activityManage/activityConfig',
        component: '@/pages/activityManage/activityConfig',
        meta: { showMenu: false, showHeader: true },
      },
    ],
  },
  {
    name: '表单管理',
    path: '/formManage',
    component: '@/layouts/formManageLayout',
    key: 'default-6',
    routes: [
      {
        path: '/formManage',
        redirect: '/formManage/formList',
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
        meta: {
          showMenu: false,
          showHeader: true,
        },
      },
      {
        name: '动态表单',
        path: '/formManage/formList',
        component: '@/pages/formManage/formList',
        meta: {
          showMenu: false,
          showHeader: true,
          breadcrumb: [{ label: '表单管理' }, { label: '表单列表' }],
        },
      },
      {
        name: '动态表单demo',
        path: '/formManage/formPreview',
        component: '@/pages/formManage/formPreview/preview',
        meta: { showMenu: false, showHeader: true },
      },
    ],
  },
  {
    name: '主页管理',
    path: '/pageManage',
    key: 'default-7',
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
    name: '登录页',
    path: '/login',
    component: '@/pages/login/login',
    meta: { navHidden: true },
  },
  {
    name: '动态报表',
    path: '/dyformManage',
    key: 'default-8',
    component: '@/layouts/homeIndex/index',
    meta: { showMenu: false, showHeader: true },
    routes: [
      {
        path: '/dyformManage',
        redirect: '/dyformManage/formCreate',
      },
      {
        name: '首页',
        path: '/dyformManage/formCreate',
        component: '@/pages/dyFormCreate/index',
        meta: { showMenu: false, showHeader: true },
      },
    ],
  },
];
