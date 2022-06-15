
/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-14 21:01:38
 */
import { defineConfig } from 'umi';
import routes from './routes.js'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // mode: 'history',//去掉#号
  routes,
  fastRefresh: {},
});
