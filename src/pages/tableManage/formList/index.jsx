/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-24 17:46:13
 */
import { Col, Row, Table, Form, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { initFormListData } from './dataJson';

const columns = [
  {
    title: '表单名称',
    dataIndex: 'formName',
    key: 'formName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '表单code',
    dataIndex: 'formCode',
    key: 'formCode',
  },
  {
    title: '创建人名称',
    dataIndex: 'createName',
    key: 'createName',
  },
  {
    title: '创建人code',
    dataIndex: 'createCode',
    key: 'createCode',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: 'Action',
    key: 'action',
    // render: (_, record) => (
    //   <Space size="middle">
    //     <a>Invite {record.name}</a>
    //     <a>Delete</a>
    //   </Space>
    // ),
  },
];

export default function FormList() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    // 初始化dataSource
    const data =
      (localStorage.getItem('formList') &&
        JSON.parse(localStorage.getItem('formList'))) ||
      initFormListData;
    setDataSource(data);
  }, []);

  return (
    <div>
      {/* 筛选框 */}
      <div>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Row>
            <Col span={6}>
              <Form.Item label="表单名称">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="表单code">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建人名称">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建人code">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* 列表部分 */}
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}
