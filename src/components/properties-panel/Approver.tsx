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
  const { addApprover, approver } = props;
  console.log(approver);
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
        <Select defaultValue={'jump'} style={{ width: 120 }}>
          <Option value="jump">跳过相同审批人</Option>
          <Option value="none">仍需审批</Option>
        </Select>
      </Form.Item>
      <Form.Item label="无审批人" name="noApprove">
        <Select defaultValue={'jump'} style={{ width: 120 }}>
          <Option value="jump">跳过此步骤</Option>
          <Option value="none">拦截提示</Option>
        </Select>
      </Form.Item>
      <Form.Item label="审批表单">
        <Form.Item name="targetForm" noStyle>
          <Select style={{ width: 120 }}>
            <Option value="form1">请假</Option>
            <Option value="form2">报销</Option>
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
