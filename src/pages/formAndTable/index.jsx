/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-07-20 14:55:02
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-05 17:14:29
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Tabs, Radio, message, Spin, Modal } from 'antd';
import moment from 'moment';
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer';
import FormDesigner from '../Desinger';
import { tableConfig } from './designerConfig';
import TableSetting from './tableSetting';
import eventBus from '@/utils/eventBus';
import * as formApi from '@/services/formManage';
import FormPreview from '@/pages/formManage/formPreview/formPreview';
const { Group, Button } = Radio;

export default function (props) {
  const [desingerType, setDesingerType] = useState('form');
  const [designer, setDesigner] = useState();
  const [saveDis, setSaveDis] = useState(false); // 表单回显之前不能进行保存
  const [others, setOthers] = useState({});
  const [loading, setLoading] = useState(false);

  // 保存当前设计器的form schema
  const [formilyFormSchema, setFormilyFormSchema] = useState();
  // 保存当前设计器的table schema
  const [formilyTableSchema, setFormilyTableSchema] = useState();
  const [previewVisible, setPreviewVisible] = useState(false);

  const getDesigner = (designer) => {
    setDesigner(designer);
    getSchemaData(designer);
  };

  const formCode = useMemo(() => {
    return props.location.query.formCode;
  });

  useEffect(() => {
    initDesigner();
  }, [desingerType]);

  // 模拟接口获取schem参数
  const getSchemaData = (designer) => {
    setSaveDis(true);
    setLoading(true);
    formApi
      .getFormDetails({ formId: formCode })
      .then((res) => {
        const { formPropertyValue, listPropertyValue, ...others } =
          res.object || null;
        const form = JSON.parse(formPropertyValue);
        const table = JSON.parse(listPropertyValue);
        setFormilyFormSchema(form);
        setFormilyTableSchema(table);
        setOthers(others);
        console.log({ ...others });
        if (form) {
          designer.setCurrentTree(transformToTreeNode(form));
        }
      })
      .finally(() => {
        setSaveDis(false);
        setLoading(false);
      });
  };

  const initDesigner = () => {
    if (!designer) return;
    const schemaJson = transformToSchema(designer.getCurrentTree());
    if (desingerType === 'form') {
      // 保存table schema并将设计器初始化成 form schema
      // setFormilyTableSchema(schemaJson);
      designer.setCurrentTree(transformToTreeNode(formilyFormSchema));
    } else {
      // 保存form schema并将设计器初始化成 table schema
      setFormilyFormSchema(schemaJson);

      // if (!formilyTableSchema) {
      //   const initTableSchema = transformFormToTable(schemaJson);
      //   setFormilyTableSchema(initTableSchema);
      //   designer.setCurrentTree(transformToTreeNode(initTableSchema));
      // } else {
      //   designer.setCurrentTree(transformToTreeNode(formilyTableSchema));
      // }
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

  // 保存
  const onSave = (msg = '') => {
    const schemaJsonStr = transformToSchema(designer.getCurrentTree());
    const formPropertyValue =
      desingerType === 'form' ? schemaJsonStr : formilyFormSchema;
    const listPropertyValue =
      desingerType === 'form' ? formilyTableSchema : schemaJsonStr;

    const data = {
      ...others,
      formPropertyValue: JSON.stringify(formPropertyValue),
      listPropertyValue: JSON.stringify(listPropertyValue),
    };
    formApi.saveForm(data).then((res) => {
      if (!res.success) {
        message.error(res.message);
        return;
      }
      if (msg) {
        message.success(msg);
      }
    });
  };

  // 预览写入localStorage
  const onPreview = () => {
    const schemaJsonStr = transformToSchema(designer.getCurrentTree());
    let formMap =
      (localStorage.getItem('formMap') &&
        JSON.parse(localStorage.getItem('formMap'))) ||
      {};
    if (formCode) {
      formMap[formCode] = {
        'formily-form-schema':
          desingerType === 'form' ? schemaJsonStr : formilyFormSchema,
        'formily-table-schema':
          desingerType === 'form' ? formilyTableSchema : schemaJsonStr,
      };

      // 更新后的mp存到缓存中去
      localStorage.setItem('formMap', JSON.stringify(formMap));
    }
    setPreviewVisible(true);
  };

  return (
    <>
      <Spin spinning={loading} className="default-spin">
        <div style={{ background: '#f0f2f5' }}>
          <Group
            defaultValue={desingerType}
            buttonStyle="solid"
            onChange={(e) => {
              setDesingerType(e?.target?.value || 'form');
              onSave();
            }}
            style={{ padding: '20px 30px' }}
          >
            <Button value="form">表单字段</Button>
            <Button value="table">列表配置</Button>
          </Group>

          {desingerType === 'form' ? (
            <FormDesigner
              type={desingerType}
              saveDis={saveDis}
              getDesigner={getDesigner}
              onSave={() => {
                onSave('保存成功');
              }}
              onPreview={() => {
                onPreview();
              }}
            />
          ) : (
            <TableSetting formCode={formCode} />
          )}
        </div>
      </Spin>
      {/* 弹框: 预览 */}
      {previewVisible ? (
        <Modal
          visible={previewVisible}
          title="表单预览"
          onCancel={() => setPreviewVisible(false)}
          className="form-preview__modal default-modal"
        >
          <FormPreview
            showPageTitle={false}
            isPreview={true}
            formName={others.formName}
          />
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}
