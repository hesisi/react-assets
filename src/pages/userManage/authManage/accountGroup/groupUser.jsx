import { Table, Button, Input, Space, Modal, message } from 'antd';
import {
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import TableHeader from '@/components/tableHeader';
import localForage from 'localforage';
import { EllipsisTooltip } from '@/components/tablecellEllips.jsx';

const { Search } = Input;
export default function GroupUser({ groupId = null }) {
  const currentGroupId = useRef(null);
  const currentGoupeData = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [dataUserSource, setDataUserSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUserRowKeys, setSelectedUserRowKeys] = useState([]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
      width: 80,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '组别',
      dataIndex: 'cate',
      key: 'cate',
      render: (text) => {
        const item = currentGoupeData?.current
          ? currentGoupeData.current.filter((itemF) => itemF.id === text)
          : [];
        return <span>{item?.[0] ? item[0].name : ''}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '120',
      render: (_, record) => (
        <Space size="middle">
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

  /* 初始化 */
  useEffect(async () => {
    if (groupId) {
      const initUserData = await localForage.getItem('groupUserList');
      console.log(initUserData, '90------');
      console.log(currentGroupId.current, '91------');
      const userGroup = await localForage.getItem('userGroup');
      currentGroupId.current = groupId;
      const currentDource = initUserData?.[groupId] || [];
      currentGoupeData.current = userGroup;
      console.log(currentDource, '109-----');
      setDataSource(currentDource);
      setSelectedRowKeys([]);
    }
  }, [groupId]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const rowUserSelection = {
    selectedUserRowKeys,
    onChange: setSelectedUserRowKeys,
  };

  /* 用户添加， 选择用户 */
  const handleAccountAdd = async () => {
    if (!currentGroupId?.current) {
      message.error('请先选择分组');
      return;
    }
    const initUserData = await localForage.getItem('groupUserList');
    const currentDource = initUserData?.[currentGroupId.current] || [];
    const currentDourceId = currentDource.map((item) => {
      return item.id;
    });
    let initUserListData = (await localForage.getItem('userList')) || [];
    initUserListData = initUserListData.filter(
      (item) => !currentDourceId.includes(item.id) && !item?.cate,
      // (item?.cate && item?.cate === currentGroupId.current) ||
    );
    setDataUserSource(initUserListData || []);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (currentGroupId.current) {
      if (!selectedUserRowKeys?.length) {
        setIsModalVisible(false);
        return;
      }
      const initUserData = (await localForage.getItem('groupUserList')) || {};
      const initUserListData = (await localForage.getItem('userList')) || [];
      initUserData[currentGroupId.current] =
        initUserData[currentGroupId.current] || [];

      const newItems = [];
      const newUserListData = [];
      initUserListData.forEach((item) => {
        if (selectedUserRowKeys.includes(item.id)) {
          newItems.push({ ...item, cate: currentGroupId.current });
          newUserListData.push({ ...item, cate: currentGroupId.current });
        } else {
          newUserListData.push(item);
        }
      });
      initUserData[currentGroupId.current] =
        initUserData[currentGroupId.current].concat(newItems);
      localForage.setItem('groupUserList', initUserData);
      localForage.setItem('userList', newUserListData);
      setDataSource(initUserData[currentGroupId.current]);
      message.success('添加成功');
    } else {
      message.warn('请先选择分组');
    }
    setIsModalVisible(false);
  };

  const handleBatchDelete = () => {
    if (!selectedRowKeys?.length) {
      message.warn('请选择一条数据');
      return;
    }
    handleDelete(selectedRowKeys);
  };

  const handleDelete = async (idArr = []) => {
    if (!currentGroupId?.current) {
      message.error('请先选择分组');
      return;
    }
    const initUserData = await localForage.getItem('groupUserList');
    let initUserListData = (await localForage.getItem('userList')) || [];
    initUserData[currentGroupId.current] = initUserData[
      currentGroupId.current
    ].filter((item) => !idArr.includes(item.id));
    initUserListData = initUserListData.map((item) => {
      if (idArr.includes(item.id)) {
        return {
          ...item,
          cate: undefined,
        };
      } else {
        return item;
      }
    });
    localForage.setItem('groupUserList', initUserData);
    localForage.setItem('userList', initUserListData);
    setDataSource(initUserData[currentGroupId.current]);
    message.success('删除成功');
  };

  return (
    <div className="right-cont user-layout">
      <div style={{ padding: '10px 0' }}>
        {/* table header */}
        <TableHeader
          formData={{
            formButton: {
              showButton: true,
              ButtonStructure: [
                {
                  itemDom: () => {
                    return (
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => handleAccountAdd()}
                      >
                        添加用户
                      </Button>
                    );
                  },
                },
                {
                  itemDom: () => {
                    return (
                      <Button
                        onClick={() => handleBatchDelete()}
                        icon={<DeleteOutlined />}
                      >
                        删除用户
                      </Button>
                    );
                  },
                },
              ],
            },
            operateStructure: [<Search placeholder="请输入用户名" />],
          }}
        />
        {/* table */}
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          style={{ marginTop: 20 }}
          dataSource={dataSource}
          columns={columns}
          // loading={loading}
          scroll={{ y: 400 }}
          // pagination={{
          //   total,
          //   showSizeChanger: true,
          //   // showQuickJumper: true,
          //   onChange: handlePageChange,
          // }}
          rowKey={(record) => record.id}
        />

        {/* 选择用户弹框 */}
        <Modal
          title="添加用户"
          destroyOnClose={true}
          width={800}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => {
            setIsModalVisible(false);
          }}
          className="default-modal"
          cancelText="取消"
          okText="确认"
        >
          <div className="user-wrapper">
            <TableHeader
              formData={{
                formButton: {
                  showButton: false,
                  ButtonStructure: [],
                },
                operateStructure: [<Input placeholder="请输入关键字" />],
              }}
            />
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowUserSelection,
              }}
              style={{ marginTop: 20 }}
              dataSource={dataUserSource}
              columns={columns.filter((item) => item.key !== 'action')}
              // loading={loading}
              scroll={{ y: 340, x: '100%' }}
              pagination={{
                total: dataUserSource?.length || 0,
                showSizeChanger: true,
                // showQuickJumper: true,
                // onChange: handlePageChange,
              }}
              rowKey={(record) => record.id}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
