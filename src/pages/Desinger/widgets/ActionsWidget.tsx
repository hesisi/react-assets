/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-16 16:39:48
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-04 16:16:14
 */
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
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
import { history } from 'umi';
import Icon from '@/utils/icon';
interface ActionsWidgetProps {
  type: 'form' | 'table';
  getDesigner: (e: any) => {};
  onSave: () => {};
}

export const ActionsWidget: React.FC<ActionsWidgetProps> = observer((props) => {
  const { type, getDesigner, onSave } = props;
  const designer = useDesigner() || Engine;

  useEffect(() => {
    getDesigner(designer);
  }, []);

  const supportLocales = ['zh-cn', 'en-us', 'ko-kr'];

  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn');
    }
  }, []);
  return (
    <Space style={{ marginRight: 10, padding: '10px 0' }}>
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
          onSave();
        }}
        icon={<Icon icon="SaveOutlined" />}
        className="ant-btn-primary"
      >
        保存
        {/* <TextWidget>保存</TextWidget> */}
      </Button>

      <Button
        onClick={() => {
          history.push('/formManage/formList');
        }}
        icon={<Icon icon="ArrowLeftOutlined" />}
        className="ant-btn-default"
      >
        返回
        {/* <TextWidget>返回</TextWidget> */}
      </Button>
    </Space>
  );
});
