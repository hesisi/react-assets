/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-07-20 14:55:02
 * @LastEditors: hesisi
 * @LastEditTime: 2022-07-21 15:31:32
 */
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Radio } from 'antd';
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer';
import FormDesigner from '../tableManage/formDesinger';
import { tableConfig } from './designerConfig';

const { Group, Button } = Radio;

export default function (props) {
  const [desingerType, setDesingerType] = useState('form');
  const [designer, setDesigner] = useState();

  // form schema
  const [formilyFormSchema, setFormilyFormSchema] = useState();
  // table schema
  const [formilyTableSchema, setFormilyTableSchema] = useState();

  const getDesigner = (designer) => {
    setDesigner(designer);

    getSchemaData(designer);
  };

  // 模拟接口获取schem参数
  const getSchemaData = (designer) => {
    // return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const formilyFormSchema =
        (localStorage.getItem('formily-form-schema') &&
          JSON.parse(localStorage.getItem('formily-form-schema'))) ||
        null;
      const formilyTableSchema =
        (localStorage.getItem('formily-table-schema') &&
          JSON.parse(localStorage.getItem('formily-table-schema'))) ||
        null;

      setFormilyFormSchema(formilyFormSchema);
      setFormilyTableSchema(formilyTableSchema);

      if (formilyFormSchema) {
        designer.setCurrentTree(transformToTreeNode(formilyFormSchema));
      }
      clearTimeout(timer);
    }, 1000);

    // })
  };

  useEffect(() => {
    initDesigner();
  }, [desingerType]);

  const initDesigner = () => {
    if (!designer) return;
    const schemaJson = transformToSchema(designer.getCurrentTree());
    if (desingerType === 'form') {
      // 保存table schema并将设计器初始化成 form schema
      setFormilyTableSchema(schemaJson);
      designer.setCurrentTree(transformToTreeNode(formilyFormSchema));
    } else {
      // 保存form schema并将设计器初始化成 table schema
      setFormilyFormSchema(schemaJson);

      if (!formilyTableSchema) {
        const initTableSchema = transformFormToTable(schemaJson);
        setFormilyTableSchema(initTableSchema);
        designer.setCurrentTree(transformToTreeNode(initTableSchema));
      } else {
        designer.setCurrentTree(transformToTreeNode(formilyTableSchema));
      }
    }
  };

  // transformFormToTable: 如果table schema为空则，讲form的字段转成table的列
  const transformFormToTable = (schemaJson) => {
    const tableSchema = tableConfig;
    const tableItems = {};
    if (schemaJson) {
      Object.keys(schemaJson).forEach((key) => {
        if (key === 'schema') {
          const item = schemaJson[key]?.properties;
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
          tableSchema['schema'].properties[key]['items'] = {
            type: 'object',
            'x-designable-id': Math.random().toString(36).substr(2),
            properties: tableItems,
          };
        }
      });
    }

    return tableSchema;
  };

  // 保存，暂时保存至localStorage中
  const onSave = () => {
    const schemaJsonStr = transformToSchema(designer.getCurrentTree());
    if (desingerType === 'form') {
      localStorage.setItem(
        'formily-form-schema',
        JSON.stringify(schemaJsonStr),
      );
      localStorage.setItem(
        'formily-table-schema',
        JSON.stringify(formilyTableSchema),
      );
    } else {
      localStorage.setItem(
        'formily-form-schema',
        JSON.stringify(formilyFormSchema),
      );
      localStorage.setItem(
        'formily-table-schema',
        JSON.stringify(schemaJsonStr),
      );
    }
  };

  return (
    <>
      <Group
        defaultValue={desingerType}
        buttonStyle="solid"
        onChange={(e) => {
          setDesingerType(e?.target?.value || 'form');
        }}
      >
        <Button value="form">表单设计</Button>
        <Button value="table">列表设计</Button>
      </Group>

      <FormDesigner
        type={desingerType}
        getDesigner={getDesigner}
        onSave={onSave}
      />
    </>
  );
}
