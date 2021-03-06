/*
 * @Descripttion: 路由配置文件，会根据该文件生成头部一级菜单以及左侧菜单树，左侧菜单树可以不限层级添加（建议最好不要超过两级）
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:14:56
 * @LastEditors: hesisi
 * @LastEditTime: 2022-07-22 10:20:44
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
    redirect: '/userManage',
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
        redirect: '/menuManage/systemManage',
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
        redirect: '/activityManage/activityList',
      },
      {
        name: '流程管理',
        path: '/activityManage/activityList',
        component: '@/pages/activityManage/activityList',
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
      {
        name: '新建表单',
        path: '/formManage/formAdd',
        component: '@/pages/formManage/formDesinger',
        // component: '@/pages/tableManage/formDesinger',
        hidden: true,
      },
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
      },
      {
        name: '动态表单demo',
        path: '/formManage/formPreview',
        component: '@/pages/formManage/formPreview',
      },
      {
        name: 'editor demo',
        path: '/formManage/mdEditor',
        component: '@/pages/formManage/mdEditor',
      },
    ],
  },
];
