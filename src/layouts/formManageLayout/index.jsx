/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 17:02:36
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-16 15:30:48
 */
import React from 'react';
import CommonLayout from '../index'

export default function IndexPage(props) {
  return (
    <CommonLayout pathPrefix="/formManage">
      { props.children }
    </CommonLayout>
  );
}
