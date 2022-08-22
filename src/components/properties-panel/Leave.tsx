import { Collapse } from 'antd';
import { Form, Input } from 'antd';
import React from 'react';
const { Panel } = Collapse;

export default function Leave(props: any) {
  const { selectedElements } = props;
  return (
    <>
      <Panel header="申请人" key="5">
        <p>{'dddd'}</p>
      </Panel>
      {selectedElements.length === 1 ? (
        <>
          <Panel header="表单" key="6">
            <a
              onClick={() => {
                alert('创建表单');
              }}
            >
              create form
            </a>
          </Panel>
        </>
      ) : null}
    </>
  );
}
