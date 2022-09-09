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
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import TableHeader from '@/components/tableHeader';
import localForage from 'localforage';
import { getUUID } from '@/utils/utils';
import { REGEXP_MAIL, REGEXP_YD_PHONE } from '@/utils/validate';
import { EllipsisTooltip } from '@/components/tablecellEllips.jsx';
import { cloneDeep } from 'lodash';
import moment from 'moment';

const { Dragger } = Upload;
const { Option } = Select;
const data = [
  { name: '耐克', id: getUUID() },
  { name: '阿迪达斯', id: getUUID() },
  { name: '李宁', id: getUUID() },
  { name: '贵人鸟', id: getUUID() },
];
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sex: undefined,
    tel: '',
    email: '',
    work: undefined,
    cate: undefined,
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
      width: 120,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel',
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
      dataIndex: 'cate',
      key: 'cate',
      render: (text) => {
        return (
          <span>
            {goupArr?.current?.filter((item) => item.id === text)?.[0]?.name ||
              ''}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
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
        <Space size="middle">
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
    const initUserData = await localForage.getItem('userList');
    goupArr.current = (await localForage.getItem('userGroup')) || data;
    localForage.setItem('userGroup', goupArr.current);
    setDataSource(initUserData || []);
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
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

  /* 用户添加， 选择用户 */
  const handleAccountAdd = () => {
    eidtIdenty.current = false;
    setIsModalVisible(true);
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
  const editGroupInfo = async (groupId, userItem) => {
    const initUserData = (await localForage.getItem('groupUserList')) || {};
    const newUserData = cloneDeep(initUserData);
    let copyDataKeys = Object.keys(newUserData);
    copyDataKeys.forEach((item) => {
      newUserData[item] = newUserData[item].filter(
        (itemC) => itemC.id !== userItem.id,
      );
    });
    if (groupId) {
      newUserData[groupId] = newUserData?.[groupId]
        ? newUserData[groupId].push(userItem)
        : [userItem];
    }
    localForage.setItem('groupUserList', newUserData);
  };

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        let oldSource = cloneDeep(dataSource);
        let currentItem = null;
        if (eidtIdenty.current) {
          oldSource = oldSource.map((item) => {
            if (item.id === currentId.current) {
              currentItem = {
                ...item,
                ...values,
              };
              return {
                ...item,
                ...values,
              };
            }
            return item;
          });
        } else {
          const userItem = {
            ...values,
            id: getUUID(),
            creatTime: moment(`${new Date()}`).format('YYYY-MM-DD HH:mm:ss'),
          };
          currentItem = userItem;
          oldSource.push(userItem);
        }
        if (currentItem) {
          editGroupInfo(values.cate, currentItem);
        }
        setDataSource(oldSource);
        localForage.setItem('userList', oldSource);
        message.success(eidtIdenty.current ? '编辑成功' : '添加成功');
        currentId.current = null;
        eidtIdenty.current = false;
        setFormData({
          name: '',
          sex: undefined,
          tel: '',
          email: '',
          work: undefined,
          cate: undefined,
        });
        setIsModalVisible(false);
      })
      .catch((reason) => {
        message.warning('请检查');
      });
  };

  const handleEdit = async (id) => {
    currentId.current = id;
    eidtIdenty.current = true;
    const currentUser = cloneDeep(dataSource).filter((item) => item.id === id);
    if (currentUser?.[0]) {
      setFormData(
        currentUser?.[0] || {
          name: '',
          sex: undefined,
          tel: '',
          email: '',
          work: undefined,
          cate: undefined,
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
    const currentUser = cloneDeep(dataSource).filter(
      (item) => !idArr.includes(item.id),
    );
    setDataSource(currentUser);
    localForage.setItem('userList', currentUser);
    message.success('删除成功');
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

  const handleUserSearch = (value) => {
    console.log(value, '298-----');
  };

  const onFinish = () => {};

  const handlePageChange = (num, pageSize) => {
    // setPageNum(num);
    // setPageSize(pageSize);
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
                      return <Button icon={<PlusOutlined />}>批量分组</Button>;
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
              total: dataSource?.length || 0,
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
                name: '',
                sex: undefined,
                tel: '',
                email: '',
                work: undefined,
                cate: undefined,
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
                            name="name"
                            rules={[{ required: true, message: '请输入姓名!' }]}
                          >
                            <Input placeholder={'请输入姓名'} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="性别" name="sex">
                            {creatSelct(
                              [
                                { value: '1', label: '男' },
                                { value: '2', label: '女' },
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
                            name="tel"
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
                          <Form.Item label="岗位" name="work">
                            {creatSelct(workList, '请选择岗位')}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="组别" name="cate">
                            {creatSelct(goupArr.current || [], '请选择组别')}
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
        </div>
      </div>
    </div>
  );
}
