import { Form, Input, Button, Select, Checkbox, Table, Col, Row } from 'antd';
const { Option } = Select;
import { PlusCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import FieldTable from '@/components/properties-panel/FieldTable';
export default function Approver(props: any) {
  const data = [
    {
      key: '1',
      fieldName: '审批意见',
      edit: false,
      readOnly: false,
      hide: false,
    },
  ];
  const { addApprover } = props;
  const [dataSource, setDataSource] = useState(data);

  const onChange = (e: any, record: any) => {
    console.log(e);
    console.log(record);
    console.log(`checked = ${e.target.checked}`);
    const temp = dataSource.map((x) => {
      if (x.fieldName === record.name) {
        x.edit = !x.edit;
      }
      return x;
    });
    setDataSource(temp);
  };
  const columns = [
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: '可编辑',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: any) => {
        return <Checkbox onChange={(e) => onChange(e, record)}></Checkbox>;
      },
    },
    {
      title: '仅可见',
      dataIndex: 'readOnly',
      key: 'readOnly',
      render: (_: any, record: any) => {
        return <Checkbox onChange={(e) => onChange(e, record)}></Checkbox>;
      },
    },
    {
      title: '隐藏',
      dataIndex: 'disable',
      key: 'disable',
      render: (_: any, record: any) => {
        return <Checkbox onChange={(e) => onChange(e, record)}></Checkbox>;
      },
    },
  ];
  return (
    <>
      <Form.Item label="审批人">
        <Form.Item name="approver" noStyle>
          <Select style={{ width: 120 }} disabled>
            <Option value="approver1">审批人一</Option>
            <Option value="approver2">审批人二</Option>
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
        <Select style={{ width: 120 }}>
          <Option value="jump">跳过审批人</Option>
          <Option value="none">任需审批</Option>
        </Select>
      </Form.Item>
      <Form.Item label="无审批人" name="noApprove">
        <Select style={{ width: 120 }}>
          <Option value="jump">跳过审批人</Option>
          <Option value="none">任需审批</Option>
        </Select>
      </Form.Item>
      <Form.Item label="审批表单">
        <Form.Item name="targetForm" noStyle>
          <Select style={{ width: 120 }}>
            <Option value="form1">表单一</Option>
            <Option value="form2">表单二</Option>
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
          <Table
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            style={{ marginTop: 10 }}
          />
        </Col>
      </Row>
    </>
  );
}
