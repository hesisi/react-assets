import { Form, Input, Button, Select, Checkbox, Table, Col, Row } from 'antd';
const { Option } = Select;
import { PlusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import FieldTable from '@/components/properties-panel/FieldTable';
export default function Approver(props: any) {
  const approverList = [
    {
      key: 11222,
      id: 12345,
      name: '张三',
      tel: 18823452222,
      email: 'xxx@email.com',
      creatTime: '2022-8-26',
    },
    {
      key: 12344,
      id: 20082,
      name: 'jansen',
      tel: 1882345111,
      email: 'xxx@email.com',
      creatTime: '2022-8-26',
    },
  ];
  const {
    addApprover,
    approver,
    flowMsg,
    forms,
    updateFlowMsg,
    element,
    fromRef,
  } = props;

  const approverNode = flowMsg?.approverGroup.find(
    (x: any) => x.id === element.id,
  );
  // console.log('-----------------getnode')
  console.log(approverNode);

  const [nodeMsg, setNodeMsg] = useState(approverNode);

  const [approverForm, setApproverForm] = useState(approverNode.approverForm);

  useEffect(() => {
    console.log('改变节点');
    fromRef?.current.setFieldValue(
      'sameApprove',
      approverNode.sameApprove || '',
    );
    fromRef?.current.setFieldValue('noApprove', approverNode.noApprove || '');
    fromRef?.current.setFieldValue('appForm', approverNode.approverForm || '');
    setNodeMsg(approverNode);
    setApproverForm(approverNode.approverForm);
  }, [element]);

  const updateNode = (data: any) => {
    const list = flowMsg?.approverGroup || [];
    if (list.length > 0) {
      const temp = list.map((x: any) => {
        if (x.id === data.id) {
          return data;
        }
        return x;
      });
      flowMsg.approverGroup = temp;
      updateFlowMsg(flowMsg);
    }
  };
  const appFormChange = (value: any) => {
    const temp = { ...nodeMsg };
    temp.approverForm = value;
    setNodeMsg(temp);
    updateNode(temp);
    setApproverForm(value);
  };
  const handleJump = (value: any) => {
    const temp = { ...nodeMsg };
    temp.sameApprove = value;
    setNodeMsg(temp);
    updateNode(temp);
  };
  const handleNone = (value: any) => {
    const temp = { ...nodeMsg };
    temp.noApprove = value;
    setNodeMsg(temp);
    updateNode(temp);
  };
  const setTargetForm = (data: any) => {
    const temp = { ...nodeMsg };
    temp.formSetting = data;
    setNodeMsg(temp);
    updateNode(temp);
  };

  return (
    <>
      <Form.Item label="审批人">
        <Form.Item name="approver" noStyle>
          <Select value={approver?.id} style={{ width: 120 }} disabled>
            {approverList.map((x) => {
              return (
                <Option key={x.id} value={x.id}>
                  {x.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Button
          type={'primary'}
          style={{ marginLeft: 10 }}
          onClick={() => addApprover()}
        >
          选择审批人
        </Button>
      </Form.Item>
      <Form.Item label="相同人" name="sameApprove">
        <Select
          value={nodeMsg.sameApprove}
          style={{ width: 120 }}
          onChange={handleJump}
        >
          <Option value="jump">跳过相同审批人</Option>
          <Option value="none">仍需审批</Option>
        </Select>
      </Form.Item>
      <Form.Item label="无审批人" name="noApprove">
        <Select
          value={nodeMsg.noApprove}
          style={{ width: 120 }}
          onChange={handleNone}
        >
          <Option value="jump">跳过此步骤</Option>
          <Option value="none">拦截提示</Option>
        </Select>
      </Form.Item>
      <Form.Item label="审批表单">
        <Form.Item name="appForm" noStyle>
          <Select
            style={{ width: 120 }}
            onChange={(value) => {
              appFormChange(value);
            }}
            value={nodeMsg.approverForm}
          >
            {forms.map((item: any) => {
              return (
                item.formStatus === 'enable' && (
                  <Option value={item.formCode} key={item.formCode}>
                    {item.formName}
                  </Option>
                )
              );
            })}
          </Select>
        </Form.Item>
        <Button style={{ marginLeft: 10 }} icon={<PlusCircleOutlined />}>
          创建
        </Button>
      </Form.Item>
      <Row style={{ paddingBottom: 20 }}>
        <Col
          span={6}
          style={{
            textAlign: 'right',
            color: ' rgba(0, 0, 0, 0.85)',
            fontWeight: 'bold',
          }}
        >
          字段权限：
        </Col>
        <Col span={24}>
          <FieldTable
            form={nodeMsg.approverForm}
            flowId={flowMsg.id}
            setTargetForm={setTargetForm}
            targetFormSet={nodeMsg.formSetting}
          ></FieldTable>
        </Col>
      </Row>
    </>
  );
}
