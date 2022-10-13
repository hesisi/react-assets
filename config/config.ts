/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-01 11:16:35
 */
import { defineConfig } from 'umi';
import routes from './routes.js';

import postCssPxToViewport from 'postcss-px-to-viewport';

const baosanIp = '10.173.88.85:9201/';
const liqingIp = '10.173.73.4:9202/';
const liuyangIp = '10.173.89.142:9202/';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // mode: 'history',//去掉#号
  routes,
  dva: {},
  fastRefresh: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: false,
  },
  proxy: {
    '/assets/messageData': {
      // target: config.infraApiOrigin, // 头部infra配置地址
      // target: 'http://10.173.73.250:9202/', // 韩振宇
      target: `http://${liqingIp}`, // 田宝山
    },
    '/assets/': {
      // target: config.infraApiOrigin, // 头部infra配置地址
      // target: 'http://10.173.73.250:9202/', // 韩振宇
      target: `http://${baosanIp}`, // 田宝山
    },
    '/department/': {
      // target: config.infraApiOrigin, // 头部infra配置地址
      // target: 'http://10.173.73.250:9202/', // 韩振宇
      target: `http://${liuyangIp}`, // 田宝山
    },
    // '/role': {
    //   target: `http://${baosanIp}`, // 田宝山
    // },
    // '/userRole': {
    //   target: `http://${baosanIp}`, // 田宝山
    // },
    // '/rolePermission': {
    //   target: `http://${baosanIp}`, // 田宝山
    // },
  },
  // publicPath: '/',

  extraPostCSSPlugins: [
    postCssPxToViewport({
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 1920, // UI设计稿的宽度
      viewportHeight: 1015,
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [
        /node_modules/,
        /activityCenter/,
        /activityManage/,
        /formManage/,
        /userManage/,
        /menuManage/,
        /layouts/,
        /previewPage/,
        /notificationCenter/,
        /components/,
        /assets/,
      ], // 设置忽略文件，用正则做目录名匹配
      include: [/homeIndex/], // 设置需要使用的文件
      landscape: false, // 是否处理横屏情况
    }),
  ],
  mock: {},
});
