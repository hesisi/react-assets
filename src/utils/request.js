/*
 * @Descripttion: 公共请求方法，封装了错误统一处理，参数处理，请求/响应拦截等
 * @version: 1.0
 * @Author: hesisi
 * @Date: 2022-06-15 11:21:33
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 19:32:25
 */
import axios from 'axios';
import Cookies from 'js-cookie';
import { message } from 'antd';

// 请求
const http = axios.create({
  baseUrl: '',
  timeout: 100000 * 1000,
});

// 请求拦截
http.interceptors.request.use(
  (config) => {
    // 设置请求头
    // let token =
    //   (Cookies.get('Token') && JSON.parse(Cookies.get('Token'))) || '';
    let token = window.localStorage.getItem('loginToken') || '';
    config.headers.Authorization = `${token}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

// 响应拦截
http.interceptors.response.use(
  (res) => {
    // 登录失效后
    const codeArr = ['200401', '200402', '200403'];
    if (codeArr.includes(res.data.code)) {
      window.location.pathname = '/login';
      return;
    }
    if (res.request.responseType === 'blob') {
      return res;
    } else {
      if (res?.data?.isSuccess === -1) {
        message.error(res?.data?.message || '系统错误');
      }
      return res;
    }
  },
  (err) => {
    message.error(err.message);
    return Promise.reject(err);
  },
);

const request = http;
export default request;
