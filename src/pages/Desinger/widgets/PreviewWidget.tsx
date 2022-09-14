/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-16 16:40:28
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-05 17:16:31
 */
import React, { useMemo, useImperativeHandle, forwardRef } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button } from 'antd';
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
} from '@formily/antd';

import { Custom } from '../src/components/Custom';

import { Card, Slider, Rate } from 'antd';
import { TreeNode } from '@designable/core';
import { transformToSchema } from '@designable/formily-transformer';

const Text: React.FC<{
  value?: string;
  content?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, value || content);
};

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
    Custom, // 自定义组件
  },
});

export interface IPreviewWidgetProps {
  tree: TreeNode;
  formInitProps: any;
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = forwardRef(
  (props, ref) => {
    const form = useMemo(() => createForm(props.formInitProps), []);
    const { form: formProps, schema } = transformToSchema(props.tree); // treeNode模式 json -> treeNode -> schema

    useImperativeHandle(ref, () => {
      return {
        form: form,
      };
    });

    return (
      <Form {...formProps} form={form}>
        <SchemaField schema={schema} />
      </Form>
    );
  },
);
