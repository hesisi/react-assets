import { Input, Select, Table, Button, Space, message, Modal } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';
import TableHeader from '@/components/tableHeader/index';
import CardHChnage from '@/components/cardHChnage/index';

import './index.less';

const { Option } = Select;
export default function NotificationCenter(props) {
  const [formInitData, setFormInitData] = useState({});
  const [categoryData] = useState([
    { label: '告警中心', key: '0' },
    { label: '防控中心', key: '1' },
  ]);
  const [statusData] = useState([
    { label: '已读', key: '0' },
    { label: '未读', key: '1' },
  ]);
  const [cardData, setCardData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [data] = useState([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ]);

  const initForm = () => {
    return {
      formStructure: [
        {
          name: 'notifiName',
          label: null,
          itemDom: () => {
            return (
              <Input placeholder="请输入消息名称" style={{ width: 266 }} />
            );
          },
        },
        {
          name: 'notifiCategory',
          label: null,
          itemDom: () => {
            return (
              <Select placeholder="请选择消息类别" style={{ width: 266 }}>
                {categoryData.map((item) => (
                  <Option key={item.key}>{item.label}</Option>
                ))}
              </Select>
            );
          },
        },
        {
          name: 'notifiStatus',
          label: null,
          itemDom: () => {
            return (
              <Select placeholder="请选择消息状态" style={{ width: 266 }}>
                {statusData.map((item) => (
                  <Option key={item.key}>{item.label}</Option>
                ))}
              </Select>
            );
          },
        },
      ],
      operateStructure: [<Button onClick={handleMoreDelete}>删除消息</Button>],
    };
  };

  const cardRenderHandler = (item) => {
    return (
      <>
        <div style={{ height: '32px' }}>{item.count}</div>
        <div>
          {item.cateory}
          <span>xxxxx</span>
        </div>
      </>
    );
  };

  const initCard = () => {
    let cardInit = [
      { cateory: '报警相关信息数', count: 1 },
      { cateory: '预警相关信息数', count: 2 },
      { cateory: '待办相关信息数', count: 2 },
      { cateory: '通知相关信息数', count: 21 },
      { cateory: '活动相关信息数', count: 3 },
    ];
    cardInit = cardInit.map((item) => {
      return {
        ...item,
        name: item.cateory,
        cardRender: cardRenderHandler,
      };
    });
    setCardData(cardInit);
  };

  useEffect(() => {
    setFormInitData(initForm());
    initCard();
  }, []);

  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleMoreDelete = () => {};

  const columns = [
    {
      title: '消息名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '消息类别',
      dataIndex: 'age',
      key: 'age',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '消息状态',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '时间',
      key: 'tags',
      dataIndex: 'tags',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>查看</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  return (
    <div className="notification-layout-wrapper">
      <div className="notification-wrapper">
        <div className="welcome-wrapper">
          <p className="welcome-title">欢迎进入消息中心</p>
          <p className="welcome-description">
            消息中心会通知您关于系统的各类消息，让您能及时得到各类信息的进度状态，并及时进行处理。
          </p>
          <div className="link-button-wrapper">
            <span>更多介绍 ></span>
          </div>
        </div>
        <div className="category-wrapper">
          <CardHChnage cardArr={cardData} />
        </div>
        <div className="notificaion-list">
          <h5 className="table-tab-title">消息管理</h5>
          {/* table 查询条件 */}
          <TableHeader formData={formInitData} formValueSubmit={handleSubmit} />

          {/* table 列表 */}
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            rowKey="key"
            dataSource={data}
          />
        </div>
      </div>
    </div>
  );
}
