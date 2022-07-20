/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-16 16:39:48
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-23 10:51:44
 */
import React, { useEffect } from 'react';
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

interface ActionsWidgetProps {
  type: 'form' | 'table';
}

export const ActionsWidget: React.FC<ActionsWidgetProps> = observer((props) => {
  const { type } = props;
  const designer = useDesigner() || Engine;

  useEffect(() => {
    // 初始化
    if (localStorage.getItem('formily-form-schema') && type === 'form') {
      const schemaJsonStr = JSON.stringify(
        transformToSchema(designer.getCurrentTree()),
      );
      localStorage.setItem('formily-table-schema', schemaJsonStr);
      designer.setCurrentTree(
        transformToTreeNode(
          JSON.parse(localStorage.getItem('formily-form-schema')),
        ),
      );
    }

    if (localStorage.getItem('formily-table-schema') && type === 'table') {
      const schemaJsonStr = JSON.stringify(
        transformToSchema(designer.getCurrentTree()),
      );
      localStorage.setItem('formily-form-schema', schemaJsonStr);
      const formSchema = transformToSchema(designer.getCurrentTree());
      const tableSchema = JSON.parse(
        localStorage.getItem('formily-table-schema'),
      );
      const tableItems = {};
      Object.keys(formSchema).forEach((key) => {
        if (key === 'schema') {
          const item = formSchema[key]?.properties;
          let index = 0;
          item &&
            Object.keys(item).forEach((p) => {
              if (item[p]?.title) {
                // 默认列表数据
                const randomStr = Math.random().toString(36).substr(2);
                const randomStrT = Math.random().toString(36).substr(2);
                tableItems[randomStr] = {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: item[p]?.title,
                  },
                  'x-designable-id': randomStrT,
                  'x-index': index,
                };
                index += 1;
              }
            });
        }
      });
      Object.keys(tableSchema['schema']?.properties).forEach((key) => {
        const item = tableSchema['schema']?.properties[key];
        if (item?.type === 'array' && item?.['x-component'] === 'ArrayTable') {
          if (
            tableSchema['schema']?.properties?.[key] &&
            tableSchema['schema']?.properties?.[key]?.['items']
          ) {
            tableSchema['schema'].properties?.[key]?.['items'] = {
              type: 'object',
              'x-designable-id': Math.random().toString(36).substr(2),
              properties: tableItems,
            };
          }
        }
      });
      if (tableSchema) {
        designer.setCurrentTree(transformToTreeNode(tableSchema));
      }
    }
  }, [type]);

  const supportLocales = ['zh-cn', 'en-us', 'ko-kr'];

  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn');
    }
  }, []);
  return (
    <Space style={{ marginRight: 10 }}>
      {/* <Button href="https://designable-fusion.formilyjs.org">
        Alibaba Fusion
      </Button> */}
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
          // { label: '한국어', value: 'ko-kr' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          const schemaJsonStr = JSON.stringify(
            transformToSchema(designer.getCurrentTree()),
          );
          if (type === 'form') {
            localStorage.setItem('formily-form-schema', schemaJsonStr);
          } else {
            localStorage.setItem('formily-table-schema', schemaJsonStr);
          }
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
      {/* <Button
        type="primary"
        onClick={() => {
          saveSchema(designer)
        }}
      >
        <TextWidget>Publish</TextWidget>
      </Button> */}
    </Space>
  );
});
