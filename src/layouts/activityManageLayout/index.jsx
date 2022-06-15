/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 17:02:36
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 11:08:01
 */
import React from 'react';
import CommonLayout from '../index'

export default function IndexPage(props) {
  return (
    <CommonLayout pathPrefix="/activityManage">
      { props.children }
    </CommonLayout>
  );
}
