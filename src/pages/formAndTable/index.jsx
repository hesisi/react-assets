import React, { useState } from 'react';
import { Tabs, Radio } from 'antd';
import { useDesigner, TextWidget } from '@designable/react';
import { Engine } from '@designable/core';
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer';
// import FormDesigner from '../formManage/formDesinger';
import FormDesigner from '../tableManage/formDesinger';
import { tableConfig } from './designerConfig';

const { TabPane } = Tabs;
const { Group, Button } = Radio;

export default function (props) {
  const designer = useDesigner() || Engine;
  const [desingerType, setDesingerType] = useState('form');

  return (
    // <Tabs defaultActiveKey="form" centered>
    //   <TabPane tab="表单设计" key="form">
    //     <FormDesigner type='form' />
    //   </TabPane>
    //   <TabPane tab="列表设计" key="table">
    //     <FormDesigner type='table' />
    //   </TabPane>
    // </Tabs>

    <>
      <Group
        defaultValue={desingerType}
        buttonStyle="solid"
        onChange={(e) => {
          if (e?.target?.value === 'table') {
            // console.log("===========designer:", useDesigner());
            // if(designer.getCurrentTree()){
            //   const schemaJsonStr = JSON.stringify(transformToSchema(designer.getCurrentTree()))
            //   localStorage.setItem('formily-form-schema', schemaJsonStr);
            // }
            localStorage.setItem(
              'formily-table-schema',
              JSON.stringify(tableConfig),
            );
          }

          setDesingerType(e?.target?.value || 'form');
        }}
      >
        <Button value="form">表单设计</Button>
        <Button value="table">列表设计</Button>
      </Group>
      <FormDesigner type={desingerType} />
    </>
  );
}
