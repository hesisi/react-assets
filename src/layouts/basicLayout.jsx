/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:48:59
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-14 22:12:35
 */
import { Breadcrumb, Layout, Menu } from 'antd';
import { Link } from 'umi';
import React from 'react';
import { ConfigProvider } from 'antd';
import { useModel } from 'umi';

const BasicLayout = (props) => {
  const { theme } = useModel('tabMenu');

  ConfigProvider.config({
    theme: {
      primaryColor: theme,
    },
  });
  // return <>{props.children}</>;
  <ConfigProvider>{props.children}</ConfigProvider>;
};

export default BasicLayout;
