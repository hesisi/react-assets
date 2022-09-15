import { Table, Button, Input, Space, Modal, message } from 'antd';
import {
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import TableHeader from '@/components/tableHeader';
import moment from 'moment';
import localForage from 'localforage';
import { EllipsisTooltip } from '@/components/tablecellEllips.jsx';
import {
  deleteGroupUser,
  addGroupUser,
  getGroupUserList,
  getGroupUserAddList,
} from '@/services/userGroup';

const { Search } = Input;
const { confirm } = Modal;
export default function GroupUser({ groupId = null, groupData = null }) {
  const currentGroupId = useRef(null);
  const currentGoupeData = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [dataUserSource, setDataUserSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUserRowKeys, setSelectedUserRowKeys] = useState([]);

  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const [userTotal, setUserTotal] = useState(0);
  const [searchUserValue, setSearchUserValue] = useState('');
  const [pageUserSize, setPageUserSize] = useState(10);
  const [pageUserNum, setPageUserNum] = useState(1);
  const [userLoading, setUserLoading] = useState(false);

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
      dataIndex: 'realName',
      key: 'realName',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 100,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '组别',
      dataIndex: 'owningGroup',
      key: 'owningGroup',
      // width: 80,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
      // render: (text) => {
      //   const item = currentGoupeData?.current
      //     ? currentGoupeData.current.filter((itemF) => itemF.id === text)
      //     : [];
      //   return <span>{item?.[0] ? item[0].name : ''}</span>;
      // },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
      render: (text) => {
        return (
          <EllipsisTooltip
            title={
              text ? moment(`${text}`).format('YYYY-MM-DD HH:mm:ss') : text
            }
          />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 100,
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
  useEffect(() => {
    if (groupId) {
      currentGoupeData.current = groupData;
      currentGroupId.current = groupId;
      setSelectedRowKeys([]);
      fechGroupUserList({
        groupId,
        realName: searchValue,
        pageSize,
        pageNum,
      });
    }
  }, [groupId, searchValue, pageSize, pageNum, groupData]);

  useEffect(() => {
    if (isModalVisible && groupId) {
      setSelectedUserRowKeys([]);
      fechUserList({
        groupId,
        realName: searchUserValue,
        pageSize: pageUserSize,
        pageNum: pageUserNum,
      });
    }
    if (!isModalVisible) {
      setPageUserSize(10);
      setPageUserNum(1);
    }
  }, [isModalVisible, groupId, searchUserValue, pageUserSize, pageUserNum]);

  const fechGroupUserList = async (params = {}) => {
    const requetData = {
      ...params,
    };
    setLoading(true);
    try {
      const tableData = await getGroupUserList(requetData);
      const dataBack = tableData?.data?.data?.content || [];
      setTotal(tableData?.data?.data?.totalSize || 0);
      setDataSource(dataBack);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fechUserList = async (params = {}) => {
    const requetData = {
      ...params,
    };
    setUserLoading(true);
    try {
      const tableData = await getGroupUserAddList(requetData);
      const dataBack = tableData?.data?.data?.content || [];
      setUserTotal(tableData?.data?.data?.totalSize || 0);
      setDataUserSource(dataBack);
      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
    }
  };

  // useEffect(async () => {
  //   if (groupId) {
  // const initUserData = await localForage.getItem('groupUserList');
  // const userGroup = await localForage.getItem('userGroup');
  // currentGroupId.current = groupId;
  // const currentDource = initUserData?.[groupId] || [];
  // currentGoupeData.current = userGroup;
  // setDataSource(currentDource);
  //     setSelectedRowKeys([]);
  //   }
  // }, [groupId]);

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
    // const initUserData = await localForage.getItem('groupUserList');
    // const currentDource = initUserData?.[currentGroupId.current] || [];
    // const currentDourceId = currentDource.map((item) => {
    //   return item.id;
    // });
    // let initUserListData = (await localForage.getItem('userList')) || [];
    // initUserListData = initUserListData.filter(
    //   (item) => !currentDourceId.includes(item.id) && !item?.cate,
    //   // (item?.cate && item?.cate === currentGroupId.current) ||
    // );
    // setDataUserSource(initUserListData || []);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (currentGroupId.current) {
      if (!selectedUserRowKeys?.length) {
        setIsModalVisible(false);
        return;
      }
      const addUser = [];
      selectedUserRowKeys.forEach((item) => {
        addUser.push({
          groupId: currentGroupId.current,
          userId: item,
        });
      });
      const daddResult = await addGroupUser(addUser);
      if (daddResult?.data?.code === 200) {
        message.success('添加成功');
        fechGroupUserList({
          groupId,
          realName: searchValue,
          pageSize,
          pageNum,
        });
      }
      // const initUserData = (await localForage.getItem('groupUserList')) || {};
      // const initUserListData = (await localForage.getItem('userList')) || [];
      // initUserData[currentGroupId.current] =
      //   initUserData[currentGroupId.current] || [];

      // const newItems = [];
      // const newUserListData = [];
      // initUserListData.forEach((item) => {
      //   if (selectedUserRowKeys.includes(item.id)) {
      //     newItems.push({ ...item, cate: currentGroupId.current });
      //     newUserListData.push({ ...item, cate: currentGroupId.current });
      //   } else {
      //     newUserListData.push(item);
      //   }
      // });
      // initUserData[currentGroupId.current] =
      //   initUserData[currentGroupId.current].concat(newItems);
      // localForage.setItem('groupUserList', initUserData);
      // localForage.setItem('userList', newUserListData);
      // setDataSource(initUserData[currentGroupId.current]);
      // message.success('添加成功');
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
    confirm({
      title: '确认删除吗',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        if (!currentGroupId?.current) {
          message.error('请先选择分组');
          return;
        }
        const deleteItemsArr = [];
        idArr.forEach((item) => {
          deleteItemsArr.push({
            groupId,
            userId: item,
          });
        });
        const deleteResult = await deleteGroupUser(deleteItemsArr);
        if (deleteResult?.data?.code === 200) {
          message.success('删除成功');
          fechGroupUserList({
            groupId,
            realName: searchValue,
            pageSize,
            pageNum,
          });
        }
        // const initUserData = await localForage.getItem('groupUserList');
        // let initUserListData = (await localForage.getItem('userList')) || [];
        // initUserData[currentGroupId.current] = initUserData[
        //   currentGroupId.current
        // ].filter((item) => !idArr.includes(item.id));
        // initUserListData = initUserListData.map((item) => {
        //   if (idArr.includes(item.id)) {
        //     return {
        //       ...item,
        //       cate: undefined,
        //     };
        //   } else {
        //     return item;
        //   }
        // });
        // localForage.setItem('groupUserList', initUserData);
        // localForage.setItem('userList', initUserListData);
        // setDataSource(initUserData[currentGroupId.current]);
      },
      onCancel() {},
    });
  };

  const handlePageChange = (num, pageSize) => {
    setPageNum(num);
    setPageSize(pageSize);
  };

  const handleUserPageChange = (num, pageSize) => {
    setPageUserNum(num);
    setPageUserSize(pageSize);
  };

  const onSearch = (values) => {
    setPageNum(1);
    setSearchValue(values);
  };

  const onUserSearch = (values) => {
    setPageUserNum(1);
    setSearchUserValue(values);
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
            operateStructure: [
              <Search
                placeholder="请输入用户名"
                onSearch={onSearch}
                allowClear
              />,
            ],
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
          loading={loading}
          scroll={{ y: 360 }}
          pagination={{
            total,
            showSizeChanger: true,
            // showQuickJumper: true,
            onChange: handlePageChange,
          }}
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
                operateStructure: [
                  <Search
                    placeholder="请输入用户名"
                    onSearch={onUserSearch}
                    allowClear
                  />,
                ],
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
              loading={userLoading}
              scroll={{ y: 280, x: '100%' }}
              pagination={{
                total: userTotal || 0,
                showSizeChanger: true,
                // showQuickJumper: true,
                onChange: handleUserPageChange,
              }}
              rowKey={(record) => record.id}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
