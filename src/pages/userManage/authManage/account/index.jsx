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
  resetPasswd,
  addUserByUpload,
  getTemplate,
} from '@/services/userManager';
import { getUserGroupList } from '@/services/userGroup';
import { REGEXP_MAIL, REGEXP_YD_PHONE } from '@/utils/validate';
import {
  EllipsisTooltip,
  TimeEllipsisTooltip,
} from '@/components/tablecellEllips.jsx';
import { cloneDeep } from 'lodash';
import moment from 'moment';

const { Dragger } = Upload;
const { Option } = Select;
const { confirm } = Modal;
const { Search } = Input;
export default function Account({ accountIdenty = 'user' }) {
  const formRef = useRef(null);
  const groupFormRef = useRef(null);
  const eidtIdenty = useRef(null);
  const currentId = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [userAddC, setUserAddC] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalGVisible, setIsModalGVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [fileList, setFileList] = useState([]);
  const [showErrReport, setShowErrReport] = useState(false);
  const [errExcel, setErrExcel] = useState('');
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
      value: '财务',
      label: '财务',
    },
    {
      value: '开发',
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
      align: 'center',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '描述',
      dataIndex: 'tel',
      key: 'tel',
      align: 'center',
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
      align: 'center',
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      width: 160,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: 200,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '组别',
      dataIndex: 'groupList',
      key: 'groupList',
      align: 'center',
      width: 200,
      render: (text) => {
        return <EllipsisTooltip title={filterGroup(text)} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      align: 'center',
      width: 200,
      render: (text) => {
        return <TimeEllipsisTooltip title={text} />;
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
          <span
            className="table-button"
            onClick={() => {
              handleReset(record.id);
            }}
          >
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
    getUserListByPage('', pageInfo);
    getGroupList();
  }, []);

  //分页获取用户列表
  const getUserListByPage = async (name, userDTO) => {
    await getUserList({ name: name, ...userDTO }).then((res) => {
      if (res?.data?.isSuccess > 0) {
        const data = res?.data?.data || [];
        // console.log(res.data);
        setPageInfo({
          pageSize: data.pageSize,
          pageNum: data.pageNum,
        });
        setTotalSize(data.totalSize);
        setDataSource(data?.content || []);
        setSelectedRowKeys([]);
      }
    });
  };

  //获取分组列表信息
  const getGroupList = async () => {
    await getUserGroupList().then((res) => {
      if (res?.data?.isSuccess > 0) {
        const data = res?.data?.data || [];
        console.log(res.data);
        setDataGSource(data || []);
      }
    });
  };

  //用户列表分组信息显示处理
  const filterGroup = (text) => {
    const Group = dataGSource.filter((item) => text.includes(item.id)) || [];
    let arr = [];
    for (let item of Group) {
      arr.push(item.name);
    }
    return arr.join('; ');
  };

  //获取已选用户
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /* 用户添加，选择用户 */
  const handleAccountAdd = () => {
    eidtIdenty.current = false;
    setIsModalVisible(true);
  };

  //获取已选择分组
  const handleGroup = () => {
    if (!selectedRowKeys?.length) {
      message.warn('请选择至少一条数据');
      return;
    }
    setIsModalGVisible(true);
  };

  //批量新增模板的下载
  const downloadTemplate = () => {
    getTemplate().then((res) => {
      if (res) {
        const blob = new Blob([res.data]); //处理文档流
        const fileName = `template.xls`;
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
  };

  //批量新增文档上传
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('excelFile', file);
    });
    console.log('uplodefile', fileList);
    addUserByUpload(formData).then((res) => {
      // if (res.data.isSuccess>0) {
      //   setFileList([]);
      //   message.success('添加成功');
      //   setIsModalVisible(false);
      //   getUserListByPage(searchName, pageInfo);
      // } else {
      message.success('上传完成，上传结果请查看结果文档');
      setShowErrReport(true);
      console.log(res);
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }); //处理文档流
      const fileName = `result.xls`;
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
      // }
    });
  };

  //上传属性配置
  const props = {
    name: 'file',
    multiple: false,
    accept: '.xls,.xlsx',
    maxCount: 1,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log('fileinfo-----------------', info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      setShowErrReport(false);
      return false;
    },
  };

  const handleAddC = (identy = true) => {
    setUserAddC(identy);
  };

  //新增or编辑确认
  const handleOk = () => {
    if (userAddC) {
      //true为单个，false为批量
      formRef.current
        .validateFields()
        .then((values) => {
          if (eidtIdenty.current) {
            //true为编辑，false为新增
            const userItem = {
              ...values,
              id: currentId.current,
            };
            console.log('newUser', userItem);
            updateOneUser({ ...userItem }).then((res) => {
              if (res?.data?.isSuccess > 0) {
                message.success('编辑成功');
                getUserListByPage(searchName, pageInfo);
                setIsModalVisible(false);
                eidtIdenty.current = false;
                setFormData({
                  userName: '',
                  gender: undefined,
                  phone: '',
                  email: '',
                  job: undefined,
                  groupList: undefined,
                });
              }
            });
          } else {
            const userItem = {
              ...values,
            };
            console.log('newUser', userItem);
            addOneUser({ ...userItem }).then((res) => {
              if (res?.data?.isSuccess > 0) {
                message.success('添加成功');
                getUserListByPage(searchName, pageInfo);
                setPageInfo({
                  ...pageInfo,
                  pageNum: 1,
                });
                getUserListByPage(searchName, { ...pageInfo, pageNum: 1 });
                setIsModalVisible(false);
                eidtIdenty.current = false;
                setFormData({
                  userName: '',
                  gender: undefined,
                  phone: '',
                  email: '',
                  job: undefined,
                  groupList: undefined,
                });
              } else {
                // message.error(res.data.message);
              }
            });
          }
        })
        .catch((reason) => {});
    } else {
      handleUpload();
    }
  };

  //批量分组确认
  const handleGOk = () => {
    groupFormRef.current.validateFields().then((values) => {
      if (!values?.groupList?.length) {
        message.warn('请选择至少一条数据');
        return;
      }
      const addUser = [];
      values.groupList.forEach((group) => {
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
    });
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

  //批量删除
  const handleBatchDelete = () => {
    if (!selectedRowKeys?.length) {
      message.warn('请选择一条数据');
      return;
    }
    handleDelete(selectedRowKeys);
  };

  //单个删除
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
      },
      onCancel() {},
    });
  };

  //密码重置
  const handleReset = (id) => {
    resetPasswd(id).then((res) => {
      if (res?.data?.isSuccess > 0) {
        message.success('密码重置成功');
      } else {
        message.success('密码重置失败');
      }
    });
  };

  //生成单选选择框
  const creatSelect = (list = [], place = '') => {
    return (
      <Select placeholder={place} allowClear>
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

  //生成多选选择框
  const creatMultipleSelect = (list = [], place = '') => {
    return (
      <Select mode="multiple" placeholder={place} maxTagCount={3}>
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

  //通过用户名获取用户列表
  const handleUserSearch = (value) => {
    setPageInfo({
      ...pageInfo,
      pageNum: 1,
    });
    setSearchName(value);
    getUserListByPage(value, { ...pageInfo, pageNum: 1 });
  };

  //翻页，页面跳转
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
                  allowClear
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
              current: pageInfo.pageNum,
              total: totalSize,
              showSizeChanger: true,
              // showQuickJumper: true,
              onChange: handlePageChange,
              showTotal: (total) => `共${total}条`,
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
              setUserAddC(true);
              setIsModalVisible(false);
              setFileList([]);
              setShowErrReport(false);
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
                      style={{ cursor: 'pointer' }}
                    >
                      单个用户
                    </span>
                    {' / '}
                    <span
                      className={!userAddC ? 'active' : 'normal'}
                      onClick={() => handleAddC(false)}
                      style={{ cursor: 'pointer' }}
                    >
                      批量添加
                    </span>
                    {!userAddC && (
                      <a
                        onClick={() => {
                          downloadTemplate();
                        }}
                        style={{ fontSize: '12px', float: 'right' }}
                      >
                        模板下载
                      </a>
                    )}
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
                            rules={[
                              { required: true, message: '请输入姓名!' },
                              { pattern: /^[^\s]*$/, message: '禁止输入空格' },
                            ]}
                          >
                            <Input placeholder={'请输入姓名'} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="性别" name="gender">
                            {creatSelect(
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
                            {creatSelect(workList, '请选择岗位')}
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
                    <>
                      <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          点击或将文件拖拽到这里上传
                        </p>
                        <p className="ant-upload-hint">
                          最大文件大小限制为20MB
                        </p>
                      </Dragger>
                      {showErrReport && (
                        <a
                          onClick={() => {
                            downloadTemplate();
                          }}
                          style={{
                            fontSize: '12px',
                            color: 'var(--ant-primary-color)',
                          }}
                        >
                          上传完成，请查看结果报告
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Modal>

          {/* 批量分组 分组展示 */}
          <Modal
            title="批量分组"
            destroyOnClose={true}
            width={400}
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
              <Form
                className="account-add default-form-radios"
                ref={groupFormRef}
                autoComplete="off"
                layout="vertical"
                wrapperCol={{ span: 22 }}
              >
                <Form.Item label="组别" name="groupList">
                  {creatMultipleSelect(dataGSource || [], '请选择组别')}
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
