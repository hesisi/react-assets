/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-07-22 15:17:27
 */
import { defineConfig } from 'umi';
import routes from './routes.js';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // mode: 'history',//去掉#号
  routes,
  // copy: [{
  //   form: 'lib',
  //   to: 'lib'
  // }],
  // headScripts: [
  //   {src: './lib/ueditor/ueditor.config.js'},
  //   {src: './lib/ueditor/ueditor.all.js'},
  //   {src: './lib/ueditor/lang/zh-cn/zh-cn.js'}
  // ],
  fastRefresh: {},
  publicPath: '/',
});
