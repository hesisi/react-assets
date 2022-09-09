import React from 'react';
import { getUUID } from '@/utils/utils';
import localForage from 'localforage';

import { LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const munuDefault = [
  {
    name: '主页',
    path: '/homeIndex',
    meta: { showMenu: false, showHeader: true },
    key: 'default-1',
  },
  {
    name: '消息中心',
    path: '/notificationCenter',
    meta: { showMenu: false, showHeader: true },
    key: 'default-2',
  },
  {
    name: '用户管理',
    path: '/userManage',
    key: 'default-3',
  },
  // {
  //   name: '权限管理',
  //   icon: React.createElement(LaptopOutlined),
  //   path: '/userManage/authManage',
  //   key: 'default-3-1',
  // },
  {
    name: '用户管理',
    path: '/userManage/authManage/account',
    key: 'default-3-1-1',
  },
  {
    title: '分组管理',
    address: '/userManage/authManage/accountGroup',
    key: 'default-3-1-2',
  },
  {
    name: '角色管理',
    path: '/userManage/authManage/role',
    key: 'default-3-1-3',
  },
  // {
  //   name: '组织管理',
  //   icon: React.createElement(NotificationOutlined),
  //   path: '/userManage/orginationManage',
  //   meta: { showMenu: false, showHeader: true },
  //   key: 'default-3-2',
  // },
  {
    name: '菜单管理',
    path: '/menuManage',
    key: 'default-4',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '流程管理',
    key: 'default-5',
    path: '/activityManage',
  },
  {
    name: '流程列表',
    key: 'default-5-1',
    path: '/activityManage/activityList',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '流程配置',
    key: 'default-5-2',
    path: '/activityManage/activityConfig',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '表单管理',
    key: 'default-6',
    path: '/formManage',
  },
  {
    name: '新建表单/列表',
    key: 'default-6-1',
    path: '/formManage/formAndTable',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '动态表单',
    key: 'default-6-2',
    path: '/formManage/formList',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '动态表单demo',
    key: 'default-6-3',
    path: '/formManage/formPreview/table',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '主页管理',
    key: 'default-7',
    path: '/pageManage',
  },
  {
    name: '首页管理',
    path: '/pageManage/homePage',
    key: 'default-7-1',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '动态报表',
    path: '/dyformManage',
    key: 'default-8',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '首页',
    key: 'default-8-1',
    path: '/dyformManage/formCreate',
    meta: { showMenu: false, showHeader: true },
  },
  {
    name: '流程中心',
    key: 'default-9',
    path: '/activityCenter',
  },
];

export const munuDefaultTree = [
  {
    title: '全部菜单',
    key: '00-top',
    children: [
      {
        title: '主页',
        address: '/homeIndex',
        children: [],
        key: 'default-1',
        meta: { showMenu: false, showHeader: true },
      },
      {
        title: '消息中心',
        address: '/notificationCenter',
        children: [],
        key: 'default-2',
        meta: { showMenu: false, showHeader: true },
      },
      {
        title: '用户管理',
        address: '/userManage',
        key: 'default-3',
        children: [
          // {
          //   title: '权限管理',
          //   address: '/userManage/authManage',
          //   key: 'default-3-1',
          //   children: [
          //   ],
          // },
          {
            title: '用户管理',
            address: '/userManage/authManage/account',
            key: 'default-3-1-1',
            children: [],
          },
          {
            title: '分组管理',
            address: '/userManage/authManage/accountGroup',
            key: 'default-3-1-2',
            children: [],
          },
          {
            title: '角色权限管理',
            address: '/userManage/authManage/role',
            key: 'default-3-1-3',
            children: [],
          },
          // {
          //   title: '组织管理',
          //   address: '/userManage/orginationManage',
          //   key: 'default-3-2',
          //   children: [],
          //   meta: { showMenu: false, showHeader: true },
          // },
        ],
      },
      {
        title: '菜单管理',
        address: '/menuManage',
        meta: { showMenu: false, showHeader: true },
        key: 'default-4',
        children: [],
      },
      {
        title: '流程管理',
        address: '/activityManage',
        key: 'default-5',
        children: [],
      },
      {
        title: '表单管理',
        address: '/formManage',
        key: 'default-6',
        children: [],
      },
      // {
      //   name: '新建表单/列表',
      //   path: '/formManage/formAndTable',
      //   meta: { showMenu: false, showHeader: true },
      // },
      // {
      //   name: '动态表单',
      //   path: '/formManage/formList',
      //   meta: { showMenu: false, showHeader: true },
      // },
      // {
      //   name: '动态表单demo',
      //   path: '/formManage/formPreview',
      //   meta: { showMenu: false, showHeader: true },
      // },
      {
        title: '主页管理',
        address: '/pageManage',
        key: getUUID(),
        children: [],
      },
      // {
      //   name: '首页管理',
      //   path: '/pageManage/homePage',
      //   meta: { showMenu: false, showHeader: true },
      // },
      {
        title: '动态报表',
        address: '/dyformManage',
        key: 'default-8',
        children: [],
        // meta: { showMenu: false, showHeader: true },
      },
      {
        title: '流程中心',
        key: 'default-9',
        address: '/activityCenter',
        children: [],
      },
      // {
      //   name: '首页',
      //   path: '/dyformManage/formCreate',
      //   meta: { showMenu: false, showHeader: true },
      // },
    ],
    isTop: true,
  },
];

/* 获取最新的菜单配置 */
export const dealMenuList = () => {
  let newMenuList = JSON.parse(localStorage.getItem('munuListTreeData'));
  newMenuList =
    newMenuList && newMenuList.length ? newMenuList : munuDefaultTree;
  // localForage.setItem('menuTree', munuDefaultTree);
  // localStorage.setItem('munuListData', JSON.stringify(newMenuList));
  localStorage.setItem('munuListTreeData', JSON.stringify(newMenuList));
  return newMenuList[0].children;
};
