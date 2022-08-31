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

export default function GroupUser({ groupId = null }) {
  const currentGroupId = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [dataUserSource, setDataUserSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUserRowKeys, setSelectedUserRowKeys] = useState([]);

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
      title: '组别',
      dataIndex: 'userGroup',
      key: 'userGroup',
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
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
      currentGroupId.current = groupId;
      const currentDource = initUserData?.[currentGroupId.current] || [];
      setDataSource(currentDource);
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
      (item) => !currentDourceId.includes(item.id),
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
      initUserData[currentGroupId.current] = initUserData[
        currentGroupId.current
      ].concat(
        initUserListData.filter((item) =>
          selectedUserRowKeys.includes(item.id),
        ),
      );
      localForage.setItem('groupUserList', initUserData);
      setDataSource(initUserData[currentGroupId.current]);
      message.success('添加成功');
    } else {
      message.warn('请先选择分组');
    }
    setIsModalVisible(false);
  };

  const handleBatchDelete = () => {
    handleDelete(selectedRowKeys);
  };

  const handleDelete = async (idArr = []) => {
    if (!currentGroupId?.current) {
      message.error('请先选择分组');
      return;
    }
    const initUserData = await localForage.getItem('groupUserList');
    initUserData[currentGroupId.current] = initUserData[
      currentGroupId.current
    ].filter((item) => !idArr.includes(item.id));
    localForage.setItem('groupUserList', initUserData);
    setDataSource(initUserData[currentGroupId.current]);
    message.success('删除成功');
  };

  return (
    <div className="right-cont">
      <div style={{ padding: 10 }}>
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
            operateStructure: [<Input placeholder="请输入用户名" />],
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
          width={620}
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
              scroll={{ y: 400 }}
              // pagination={{
              //   total,
              //   showSizeChanger: true,
              //   // showQuickJumper: true,
              //   onChange: handlePageChange,
              // }}
              rowKey={(record) => record.id}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
