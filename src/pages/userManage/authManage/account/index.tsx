import {
  Table,
  Button,
  Layout,
  Col,
  Form,
  Input,
  Select,
  Space,
  Row,
} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  SearchOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef } from 'react';

export default function IndexPage() {
  const formRef: any = useRef(null);

  const data = [
    { name: 'nike', label: '耐克' },
    { name: 'adidas', label: '阿迪达斯' },
    { name: 'grn', label: '贵人鸟' },
  ];
  const List = (props: any) => {
    const { data } = props;
    return (
      <div className={'list-cont'}>
        <div className={'header-u'}>
          <h3 className={'title'}>用户分组管理</h3>
          <InfoCircleOutlined />
          <a style={{ color: '#85BD25', marginLeft: 'auto' }}>
            <PlusCircleOutlined />
          </a>
        </div>
        {data.map((x: any) => (
          <div className={'list-item'} key={x.name}>
            {x.label}
            <FormOutlined />
            <DeleteOutlined />
          </div>
        ))}
      </div>
    );
  };

  const dataSource: any[] = [];

  const columns = [
    {
      title: '序号',
      dataIndex: 'sequence',
      key: 'sequence',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div style={{ height: '100%', padding: 20, backgroundColor: '#f0f2f5' }}>
      <Layout className={'user-cont list-layout'}>
        <Sider className={'user-sider'} width={300}>
          <List data={data}></List>
        </Sider>
        <Content style={{ paddingLeft: 10 }}>
          <div className="right-cont">
            <div className="header-u">
              <h3 className={'title'}>用户列表</h3>
              <InfoCircleOutlined />
            </div>

            <div style={{ padding: 10 }}>
              <Row
                justify="start"
                className="list-row"
                style={{ marginTop: 20 }}
              >
                <Col>
                  <Form
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    layout="inline"
                    ref={formRef}
                  >
                    <Form.Item label="" name="name">
                      <Input allowClear placeholder="请输入用户名称" />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                style={{ marginTop: 20 }}
                dataSource={dataSource}
                columns={columns}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
