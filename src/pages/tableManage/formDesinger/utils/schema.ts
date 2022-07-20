/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-17 14:35:52
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-17 14:38:37
 */
import { Engine } from '@designable/core';
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer';
import { message } from 'antd';

export const saveSchema = (designer: Engine) => {
  // localStorage.setItem(
  //   'formily-schema',
  //   JSON.stringify(transformToSchema(designer.getCurrentTree()))
  // )
  // message.success('Save Success')

  const schemaJsonStr = transformToSchema(designer.getCurrentTree());
  return schemaJsonStr;
};

export const loadInitialSchema = (designer: Engine) => {
  try {
    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema'))),
    );
  } catch {}
};
