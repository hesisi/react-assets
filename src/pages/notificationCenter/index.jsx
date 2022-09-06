import { Input, Select, Table, Button, Space, message, Tooltip } from 'antd';
import { useEffect, useRef, useState, useCallback } from 'react';
import TableHeader from '@/components/tableHeader/index';
import CardHChnage from '@/components/cardHChnage/index';
import {
  QuestionCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import {
  getMessageType,
  getMessageList,
  deleteMessage,
  deleteBtchMessage,
} from '@/services/messageCenter';

import './index.less';

const { Option } = Select;
export default function NotificationCenter(props) {
  const [formInitData, setFormInitData] = useState({});
  const [categoryData, setCategoryData] = useState([
    { label: '流程中心', key: '1' },
    { label: '告警中心', key: '2' },
    { label: '系统通知', key: '3' },
  ]);
  const [statusData] = useState([
    { label: '未读', key: '0' },
    { label: '已读', key: '1' },
  ]);
  const [cardData, setCardData] = useState([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const selectedRowKeysRef = useRef(null);
  const [searchValue, setSearchValue] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const initForm = () => {
    return {
      formStructure: [
        {
          name: 'messageTitle',
          label: null,
          itemDom: () => {
            return (
              <Input placeholder="请输入消息名称" style={{ width: 180 }} />
            );
          },
        },
        {
          name: 'messageType',
          label: null,
          itemDom: () => {
            return (
              <Select placeholder="请选择消息类别" style={{ width: 180 }}>
                {categoryData.map((item) => (
                  <Option key={item.key}>{item.label}</Option>
                ))}
              </Select>
            );
          },
        },
        {
          name: 'messageStatus',
          label: null,
          itemDom: () => {
            return (
              <Select placeholder="请选择消息状态" style={{ width: 180 }}>
                {statusData.map((item) => (
                  <Option key={item.key}>{item.label}</Option>
                ))}
              </Select>
            );
          },
        },
      ],
      operateStructure: [
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          onClick={handleMoreDelete}
        >
          删除消息
        </Button>,
      ],
      formValueSubmit: handleSubmit,
    };
  };

  const cardRenderHandler = (item, index) => {
    return (
      <>
        <div className={['count', item.colorClass].join(' ')}>
          {item.count}
          <span style={{ opacity: '0' }}>
            <QuestionCircleOutlined />
          </span>
        </div>
        <div className="category">
          {item.cateory}
          <span>
            <Tooltip placement="top" title={item.messageTip}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        </div>
      </>
    );
  };

  const initCard = async () => {
    const cardInitR = await getMessageType();
    let cardInit = cardInitR?.data?.data || [];
    if (!cardInit.length) {
      return;
    }
    // let cardInit = [
    //   { cateory: '报警相关信息数', count: 1, colorClass: 'color1' },
    //   { cateory: '预警相关信息数', count: 2, colorClass: 'color2' },
    //   { cateory: '待办相关信息数', count: 2, colorClass: 'color3' },
    //   { cateory: '通知相关信息数', count: 21, colorClass: 'color4' },
    //   { cateory: '活动相关信息数', count: 3, colorClass: 'color5' },
    // ];
    // const [infoText]
    let countNum = 0;
    cardInit = cardInit.map((item, index) => {
      countNum = countNum + item.count * 1;
      return {
        ...item,
        cateory: item.messageDesc,
        colorClass: `color${index + 1}`,
        cardRender: cardRenderHandler,
      };
    });
    setCardData(cardInit);
    setCount(countNum);
    setCategoryData(
      cardInit.map((item) => ({
        label: item.messageDesc,
        key: item.messageType,
      })),
    );
  };

  const initTable = async (params = {}) => {
    const requetData = {
      ...params,
    };
    setLoading(true);
    const tableData = await getMessageList(params);
    const dataBack = tableData?.data?.data?.content || [];
    setTotal(tableData?.data?.data?.totalSize || 0);
    setData(dataBack);
    setLoading(false);
  };

  useEffect(() => {
    initCard();
    setFormInitData(initForm());
    // initTable()
  }, []);

  useEffect(() => {
    initTable({
      ...searchValue,
      pageSize,
      pageNum,
    });
  }, [searchValue, pageSize, pageNum]);

  const handleSubmit = (values) => {
    setSearchValue(values);
    // initTable({
    //   values,
    //   pageSize,
    //   pageNum,
    // });
  };

  const handleMoreDelete = () => {
    if (!selectedRowKeysRef?.current?.length) {
      message.warn('请先选择数据');
      return;
    }
    handleDelete(selectedRowKeysRef?.current);
  };

  const handleDelete = async (idArrs = []) => {
    if (idArrs?.length && idArrs?.length > 0) {
      await deleteBtchMessage(idArrs.join());
    } else {
      await deleteMessage(idArrs.join());
    }
    initTable({
      ...searchValue,
      pageSize,
      pageNum,
    });
    message.success('删除成功!');
  };

  const columns = [
    {
      title: '消息名称',
      dataIndex: 'messageTitle',
      key: 'messageTitle',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '消息类别',
      dataIndex: 'messageType',
      key: 'messageType',
      align: 'center',
      render: (text) => {
        const textType = categoryData.find((item) => {
          return item.key === text + '';
        });
        return textType ? textType.label : text;
      },
    },
    {
      title: '消息状态',
      dataIndex: 'messageStatus',
      key: 'messageStatus',
      align: 'center',
      render: (text) => {
        return text === 1 ? '已读' : '未读';
      },
    },
    {
      title: '时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        return text ? new Date(text).toLocaleString() : '';
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span className="table-button">
            <span style={{ marginRight: '5px' }}>
              <EyeOutlined />
            </span>
            查看
          </span>
          <span
            className="table-button"
            onClick={() => handleDelete([record.id])}
          >
            <span style={{ marginRight: '5px' }}>
              <DeleteOutlined />
            </span>
            删除
          </span>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys, '248-----');
    selectedRowKeysRef.current = newSelectedRowKeys;
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

  const handlePageChange = (num, pageSize) => {
    setPageNum(num);
    setPageSize(pageSize);
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
          {/* <div className="count-num">
            <span>消息总数</span>
            <p>{count}</p>
          </div> */}
        </div>
        <div className="category-wrapper">
          <CardHChnage cardArr={cardData} />
        </div>
        <div className="notificaion-list">
          <h5 className="table-tab-title">消息管理</h5>
          {/* table 查询条件 */}
          <TableHeader formData={formInitData} />

          {/* table 列表 */}
          <Table
            loading={loading}
            scroll={{ y: 400 }}
            //  total={total}
            rowSelection={rowSelection}
            pagination={{
              total,
              showSizeChanger: true,
              // showQuickJumper: true,
              onChange: handlePageChange,
            }}
            // onShowSizeChange={onShowSizeChange}

            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
          />
        </div>
      </div>
    </div>
  );
}
