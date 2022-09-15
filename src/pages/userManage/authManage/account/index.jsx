import {
  Table,
  Button,
  Layout,
  Input,
  Space,
  Tree,
  Tooltip,
  Select,
  Modal,
  Form,
  message,
  Upload,
  Row,
  Col,
} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import {
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  InboxOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import TableHeader from '@/components/tableHeader';
import localForage from 'localforage';
import { getUUID } from '@/utils/utils';
import {
  getUserList,
  addOneUser,
  deleteUser,
  updateOneUser,
  addUsersToGroups,
} from '@/services/userManager';
import { getUserGroupList } from '@/services/userGroup';
import { REGEXP_MAIL, REGEXP_YD_PHONE } from '@/utils/validate';
import { EllipsisTooltip } from '@/components/tablecellEllips.jsx';
import { cloneDeep } from 'lodash';
import moment from 'moment';

const { Dragger } = Upload;
const { Option } = Select;
const { confirm } = Modal;
// const data = [
//   { name: '耐克', id: getUUID() },
//   { name: '阿迪达斯', id: getUUID() },
//   { name: '李宁', id: getUUID() },
//   { name: '贵人鸟', id: getUUID() },
// ];
const { Search } = Input;
export default function Account({ accountIdenty = 'user' }) {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const eidtIdenty = useRef(null);
  const currentId = useRef(null);
  const goupArr = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [userAddC, setUserAddC] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalGVisible, setIsModalGVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedGRowKeys, setSelectedGRowKeys] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [pageInfo, setPageInfo] = useState({
    pageSize: 10,
    pageNum: 1,
  });
  const [totalSize, setTotalSize] = useState(0);
  const [dataGSource, setDataGSource] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    gender: undefined,
    tel: '',
    email: '',
    job: undefined,
    groupList: undefined,
  });

  const workList = [
    {
      value: '0',
      label: '财务',
    },
    {
      value: '1',
      label: '开发',
    },
  ];

  const columnGs = [
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
      title: '组名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '描述',
      dataIndex: 'tel',
      key: 'tel',
      width: 160,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
  ];

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
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '组别',
      dataIndex: 'groupList',
      key: 'groupList',
      render: (text) => {
        return (
          <span>
            {/* {dataGSource.filter((item) => text.includes(item.id))?.[0]?.name ||
              ''} */}
            {filterGroup(text)}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '14%',
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 290,
      render: (_, record) => (
        <Space size="small">
          <span className="table-button" onClick={() => handleEdit(record.id)}>
            <span style={{ marginRight: '5px' }}>
              <EditOutlined />
            </span>
            编辑
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
          <span className="table-button">
            <span style={{ marginRight: '5px' }}>
              <ReloadOutlined />
            </span>
            密码重置
          </span>
        </Space>
      ),
    },
  ];

  useEffect(async () => {
    // const initUserData = await localForage.getItem('userList');
    getUserListByPage('', pageInfo);
    getGroupList();
    // goupArr.current = (await localForage.getItem('userGroup')) || data;
    // localForage.setItem('userGroup', goupArr.current);
    // setDataSource(initUserData || []);
  }, []);

  const getUserListByPage = async (name, userDTO) => {
    await getUserList({ name: name, userDTO: userDTO }).then((res) => {
      if (res?.data?.isSuccess > 0) {
        const data = res?.data?.data || [];
        // console.log(res.data);
        setPageInfo({
          pageSize: data.pageSize,
          pageNum: data.pageNum,
        });
        setTotalSize(data.totalSize);
        setDataSource(data?.content || []);
      }
    });
  };

  const getGroupList = async () => {
    await getUserGroupList().then((res) => {
      if (res?.data?.isSuccess > 0) {
        const data = res?.data?.data || [];
        console.log(res.data);
        setDataGSource(data || []);
      }
    });
  };

  const filterGroup = (text) => {
    const Group = dataGSource.filter((item) => text.includes(item.id)) || [];
    let arr = [];
    for (let item of Group) {
      arr.push(item.name);
    }
    return arr.join(';');
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onSelectGChange = (newSelectedRowKeys) => {
    setSelectedGRowKeys(newSelectedRowKeys);
  };

  const rowGSelection = {
    selectedGRowKeys,
    onChange: onSelectGChange,
  };

  /* 用户添加， 选择用户 */
  const handleAccountAdd = () => {
    eidtIdenty.current = false;
    setIsModalVisible(true);
  };

  const handleGroup = () => {
    if (!selectedRowKeys?.length) {
      message.warn('请选择至少一条数据');
      return;
    }
    setIsModalGVisible(true);
  };

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleAddC = (identy = true) => {
    setUserAddC(identy);
  };

  /* 一个人挂一个分组下面 */
  // const editGroupInfo = async (groupId, userItem) => {
  //   const initUserData = (await localForage.getItem('groupUserList')) || {};
  //   console.log(initUserData, '222----');
  //   const newUserData = cloneDeep(initUserData);
  //   let copyDataKeys = Object.keys(newUserData);
  //   copyDataKeys.forEach((item) => {
  //     if (newUserData?.[item]) {
  //       console.log(newUserData[item], '226----');
  //       newUserData[item] = newUserData[item].filter(
  //         (itemC) => itemC.id !== userItem.id,
  //       );
  //     }
  //   });
  //   if (groupId) {
  //     console.log(newUserData[groupId], '234----');
  //     newUserData[groupId] = newUserData?.[groupId]
  //       ? newUserData[groupId].concat([userItem])
  //       : [userItem];
  //   }
  //   console.log(newUserData, '239----');
  //   localForage.setItem('groupUserList', newUserData);
  // };

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        if (eidtIdenty.current) {
          //true为编辑，false为新增
          const userItem = {
            ...values,
            id: currentId.current,
            code: values.userName,
            realName: values.userName,
            passwd: '123456',
          };
          console.log('newUser', userItem);
          updateOneUser({ ...userItem }).then((res) => {
            if (res?.data?.isSuccess > 0) {
              message.success('编辑成功');
              getUserListByPage(searchName, pageInfo);
            } else {
              message.error('编辑失败');
            }
          });
        } else {
          const userItem = {
            ...values,
            code: values.userName,
            realName: values.userName,
            passwd: '123456',
          };
          console.log('newUser', userItem);
          addOneUser({ ...userItem }).then((res) => {
            if (res?.data?.isSuccess > 0) {
              message.success('添加成功');
              getUserListByPage(searchName, pageInfo);
            } else {
              message.error('添加失败');
            }
          });
        }
        eidtIdenty.current = false;
        setFormData({
          userName: '',
          gender: undefined,
          phone: '',
          email: '',
          job: undefined,
          groupList: undefined,
        });
        setIsModalVisible(false);
      })
      .catch((reason) => {
        message.warning('请检查');
      });
  };

  const handleGOk = () => {
    if (!selectedGRowKeys?.length) {
      message.warn('请选择至少一条数据');
      return;
    }
    const addUser = [];
    selectedGRowKeys.forEach((group) => {
      selectedRowKeys.forEach((user) => {
        addUser.push({
          groupId: group,
          userId: user,
        });
      });
    });
    console.log(addUser);
    addUsersToGroups(addUser).then((res) => {
      if (res.data.isSuccess > 0) {
        getUserListByPage(searchName, pageInfo);
        message.success('分组成功');
      } else {
        message.error('分组失败');
      }
    });
    setIsModalGVisible(false);
  };

  const handleEdit = async (id) => {
    currentId.current = id;
    eidtIdenty.current = true;
    const currentUser = cloneDeep(dataSource).filter((item) => item.id === id);
    if (currentUser?.[0]) {
      setFormData(
        currentUser?.[0] || {
          userName: '',
          gender: undefined,
          phone: '',
          email: '',
          job: undefined,
          groupList: undefined,
        },
      );
    }
    setIsModalVisible(true);
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
        deleteUser(idArr).then((res) => {
          if (res?.data?.isSuccess > 0) {
            message.success('删除成功');
            getUserListByPage(searchName, pageInfo);
          } else {
            message.success('删除失败');
          }
        });
        // const currentUser = cloneDeep(dataSource).filter(
        //   (item) => !idArr.includes(item.id),
        // );
        // setDataSource(currentUser);
        // localForage.setItem('userList', currentUser);
        // message.success('删除成功');
      },
      onCancel() {},
    });
  };

  const creatSelct = (list = [], place = '') => {
    return (
      <Select placeholder={place}>
        {list.map((x) => {
          return (
            <Option key={x.value || x.id} value={x.value || x.id}>
              {x.label || x.name}
            </Option>
          );
        })}
      </Select>
    );
  };
  const creatMultipleSelect = (list = [], place = '') => {
    return (
      <Select mode="multiple" placeholder={place}>
        {list.map((x) => {
          return (
            <Option key={x.value || x.id} value={x.value || x.id}>
              {x.label || x.name}
            </Option>
          );
        })}
      </Select>
    );
  };

  const handleUserSearch = (value) => {
    setSearchName(value);
    getUserListByPage(value, { ...pageInfo, pageNum: 1 });
  };
  const handleGroupSearch = (value) => {};
  const onFinish = () => {};

  const handlePageChange = (num, pageSize) => {
    const newPageInfo = {
      ...pageInfo,
      pageNum: num,
      pageSize: pageSize,
    };
    setPageInfo(newPageInfo);
    getUserListByPage(searchName, newPageInfo);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div
      style={{
        height: '100%',
        padding: '0 20px 20px 20px',
        backgroundColor: '#f0f2f5',
      }}
    >
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
                          {accountIdenty === 'user' ? '新建用户' : '选择用户'}
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
                  {
                    itemDom: () => {
                      return (
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => handleGroup()}
                        >
                          批量分组
                        </Button>
                      );
                    },
                  },
                ],
              },
              operateStructure: [
                <Search
                  placeholder="请输入关键字"
                  onSearch={handleUserSearch}
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
            // loading={loading}
            scroll={{ y: 340, x: '100%' }}
            // pagination={{
            //   total,
            //   showSizeChanger: true,
            //   // showQuickJumper: true,
            //   onChange: handlePageChange,
            // }}
            rowKey={(record) => record.id}
            pagination={{
              total: totalSize,
              showSizeChanger: true,
              // showQuickJumper: true,
              onChange: handlePageChange,
            }}
          />

          {/* 新建用户、选择用户弹框 */}
          <Modal
            title={eidtIdenty.current ? '编辑用户' : '新增用户'}
            width={620}
            visible={isModalVisible}
            onOk={handleOk}
            destroyOnClose={true}
            onCancel={() => {
              setFormData({
                userName: '',
                gender: undefined,
                phone: '',
                email: '',
                job: undefined,
                groupList: undefined,
              });
              currentId.current = null;
              eidtIdenty.current = false;
              setIsModalVisible(false);
            }}
            className="default-modal"
            cancelText="取消"
            okText="确认"
          >
            <div className="user-wrapper">
              <div className="user-add-wrapper">
                {eidtIdenty.current ? null : (
                  <span>
                    <span
                      className={userAddC ? 'active' : 'normal'}
                      onClick={() => handleAddC(true)}
                    >
                      单个用户
                    </span>{' '}
                    /
                    <span
                      className={!userAddC ? 'active' : 'normal'}
                      onClick={() => handleAddC(false)}
                    >
                      批量添加
                    </span>
                  </span>
                )}
                <div
                  className="user-add-content"
                  style={{
                    paddingTop: '12px',
                  }}
                >
                  {userAddC ? (
                    <Form
                      className="account-add default-form-radios"
                      ref={formRef}
                      // form={form}
                      initialValues={formData}
                      // name="basic"
                      autoComplete="off"
                      layout="vertical"
                      wrapperCol={{ span: 22 }}
                    >
                      <Row>
                        <Col span={12}>
                          <Form.Item
                            label="姓名"
                            name="userName"
                            rules={[{ required: true, message: '请输入姓名!' }]}
                          >
                            <Input placeholder={'请输入姓名'} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="性别" name="gender">
                            {creatSelct(
                              [
                                { value: '男', label: '男' },
                                { value: '女', label: '女' },
                              ],
                              '请选择性别',
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item
                            label="电话"
                            name="phone"
                            rules={[
                              {
                                pattern: REGEXP_YD_PHONE,
                                message: '电话格式不正确!',
                              },
                            ]}
                          >
                            <Input placeholder={'请输入电话'} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                              {
                                pattern: REGEXP_MAIL,
                                message: '邮箱格式不正确!',
                              },
                            ]}
                          >
                            <Input placeholder={'请输入邮箱'} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item label="岗位" name="job">
                            {creatSelct(workList, '请选择岗位')}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="组别" name="groupList">
                            {creatMultipleSelect(
                              dataGSource || [],
                              '请选择组别',
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  ) : (
                    <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        点击或将文件拖拽到这里上传
                      </p>
                      <p className="ant-upload-hint">最大文件大小限制为20MB</p>
                    </Dragger>
                  )}
                </div>
              </div>
            </div>
          </Modal>

          {/* 批量分组 分组展示 */}
          <Modal
            title="选择分组"
            destroyOnClose={true}
            width={800}
            visible={isModalGVisible}
            onOk={handleGOk}
            onCancel={() => {
              setIsModalGVisible(false);
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
                      placeholder="请输入关键字"
                      onSearch={handleGroupSearch}
                    />,
                  ],
                }}
              />
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowGSelection,
                }}
                style={{ marginTop: 20 }}
                dataSource={dataGSource}
                columns={columnGs.filter((item) => item.key !== 'action')}
                // loading={loading}
                scroll={{ y: 340, x: '100%' }}
                pagination={{
                  total: dataGSource?.length || 0,
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
    </div>
  );
}
