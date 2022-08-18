import React, { useEffect, useState } from 'react';
import './activityList.less';
import { Space, Table, Input, Button, Divider, Breadcrumb, Layout } from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { history } from 'umi';

const { Header, Content, Sider } = Layout;

import type { ColumnsType } from 'antd/es/table';
import Dialog from './Dialog';
interface DataType {
  key?: string | number;
  name: string;
  id?: string | number;
  status?: string;
  remarks?: string;
  creatTime?: string;
  updateTime?: string;
  sequence?: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '序号',
    dataIndex: 'sequence',
    key: 'sequence',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>发布</a>
        <a>启用</a>
        <a>停用</a>
        <a>编辑</a>
        <a>删除</a>
      </Space>
    ),
  },
  {
    title: '流程编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '流程状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
  },
  {
    title: '创建时间',
    dataIndex: 'creatTime',
    key: 'creatTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

export default function Page() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState<DataType[]>([]);
  useEffect(() => {
    const flowData = window.localStorage.getItem('flowGroup');
    if (flowData) {
      const data = JSON.parse(flowData).map((x: any, index: number) => {
        return {
          key: index,
          name: x.name,
          id: '',
          status: '启用中',
          creatTime: '2022-8-17',
          updateTime: '2022-8-17',
          remarks: x.remarks,
          sequence: index + 1,
        };
      });
      setTableData(data);
    }
  }, []);

  const addProcess = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    history.push('/activityManage/activityConfig');
  };
  return (
    <>
      <Layout style={{ padding: '10px', backgroundColor: '#f2f2f2' }}>
        <Header style={{ paddingLeft: '10px', backgroundColor: '#fff' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>流程管理</Breadcrumb.Item>
            <Breadcrumb.Item>流程列表</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Layout
          style={{
            padding: '0 10px',
            backgroundColor: '#ffffff',
            marginTop: 10,
          }}
        >
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <div className={'search-cont'}>
              <div className={'fieldset'}>
                <label>流程编号</label>
                <Input placeholder="Basic usage" />
              </div>
              <div className={'fieldset'}>
                <label>流程名称</label>
                <Input placeholder="Basic usage" />
              </div>
              <div className={'fieldset'}>
                <label>流程状态</label>
                <Input placeholder="Basic usage" />
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  style={{ marginRight: '20px' }}
                >
                  搜索
                </Button>
                <Button type="primary" icon={<MinusOutlined />}>
                  清除
                </Button>
              </div>
            </div>
            <Divider></Divider>
            <div style={{ textAlign: 'right', padding: '0 10px 20px' }}>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                style={{ marginRight: '20px' }}
                onClick={addProcess}
              >
                新建
              </Button>
              <Button type="primary" icon={<MinusCircleOutlined />}>
                删除
              </Button>
            </div>
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              columns={columns}
              dataSource={tableData}
            />
          </Content>
        </Layout>
      </Layout>
      <Dialog
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleOk={handleOk}
      ></Dialog>
    </>
  );
}
