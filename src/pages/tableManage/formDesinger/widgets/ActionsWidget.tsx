/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-16 16:39:48
 * @LastEditors: hesisi
 * @LastEditTime: 2022-07-21 15:32:05
 */
import React, { useEffect,useImperativeHandle, forwardRef } from 'react';
import { Space, Button, Radio } from 'antd';
import { useDesigner, TextWidget } from '@designable/react';
import { GlobalRegistry } from '@designable/core';
import { observer } from '@formily/react';
// import { loadInitialSchema, saveSchema } from '../utils'
import { Engine } from '@designable/core';
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer';
import { onFormSubmitValidateEnd } from '@formily/core';

interface ActionsWidgetProps {
  type: 'form' | 'table';
  getDesigner: (e:any) => {},
  onSave: () => {}
}

export const ActionsWidget: React.FC<ActionsWidgetProps> = observer((props) => {
  const { type, getDesigner,onSave } = props;
  const designer = useDesigner() || Engine;

  useEffect(() => {
    console.log("33333designer:",designer)
    getDesigner(designer)
  }, []) 

  const supportLocales = ['zh-cn', 'en-us', 'ko-kr'];

  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn');
    }
  }, []);
  return (
    <Space style={{ marginRight: 10 }}>
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          onSave()
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
    </Space>
  );
})
