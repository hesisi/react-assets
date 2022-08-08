/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 17:02:36
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-08 09:58:41
 */
import React from 'react';
import CommonLayout from '../index'

export default function IndexPage(props) {
  console.log("===props:",props)
  return (
    <CommonLayout pathPrefix="/userManage">
      { props.children }
    </CommonLayout>
  );
}
