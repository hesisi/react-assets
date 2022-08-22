/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-07-20 14:55:02
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-05 17:14:29
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Tabs, Radio } from 'antd';
import moment from 'moment';
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer';
import FormDesigner from '../Desinger';
import { tableConfig } from './designerConfig';
import TableSetting from './tableSetting';

const { Group, Button } = Radio;

export default function (props) {
  const [desingerType, setDesingerType] = useState('form');
  const [designer, setDesigner] = useState();

  // 保存当前设计器的form schema
  const [formilyFormSchema, setFormilyFormSchema] = useState();
  // 保存当前设计器的table schema
  const [formilyTableSchema, setFormilyTableSchema] = useState();

  const getDesigner = (designer) => {
    setDesigner(designer);

    getSchemaData(designer);
  };

  const formCode = useMemo(() => {
    return props.location.query.formCode;
  });

  // useEffect(() => {
  //   const formCode = props.location.query.formCode
  //   setFormCode(formCode)
  // }, [])

  useEffect(() => {
    initDesigner();
  }, [desingerType]);

  // 模拟接口获取schem参数
  const getSchemaData = (designer) => {
    const timer = setTimeout(() => {
      const formMap =
        (localStorage.getItem('formMap') &&
          JSON.parse(localStorage.getItem('formMap'))) ||
        {};
      const curretnItem = formMap[formCode];

      const formilyFormSchema =
        (curretnItem && curretnItem['formily-form-schema']) || null;
      const formilyTableSchema =
        (curretnItem && curretnItem['formily-table-schema']) || null;
      setFormilyFormSchema(formilyFormSchema);
      setFormilyTableSchema(formilyTableSchema);

      if (formilyFormSchema) {
        designer.setCurrentTree(transformToTreeNode(formilyFormSchema));
      }
      clearTimeout(timer);
    }, 1000);
  };

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

    // 修改
    let formList =
      (localStorage.getItem('formList') &&
        JSON.parse(localStorage.getItem('formList'))) ||
      [];
    let formMap =
      (localStorage.getItem('formMap') &&
        JSON.parse(localStorage.getItem('formMap'))) ||
      {};
    if (formCode) {
      formList = formList.map((item) => {
        if (item.formCode === formCode) {
          item.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
          item.updateName = 'admin';
        }
        return item;
      });
      // 将更新后的list保存在缓存中
      localStorage.setItem('formList', JSON.stringify(formList));

      formMap[formCode] = {
        'formily-form-schema':
          desingerType === 'form' ? schemaJsonStr : formilyFormSchema,
        'formily-table-schema':
          desingerType === 'form' ? formilyTableSchema : schemaJsonStr,
      };

      // 更新后的mp存到缓存中去
      localStorage.setItem('formMap', JSON.stringify(formMap));
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
        style={{ padding: '20px' }}
      >
        <Button value="form">表单字段</Button>
        <Button value="table">列表配置</Button>
      </Group>

      {desingerType === 'form' ? (
        <FormDesigner
          type={desingerType}
          getDesigner={getDesigner}
          onSave={onSave}
        />
      ) : (
        <TableSetting formCode={formCode} />
      )}
    </>
  );
}
