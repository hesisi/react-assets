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
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import TableHeader from '@/components/tableHeader';
import localForage from 'localforage';
import { getUUID } from '@/utils/utils';
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
export default function Account({ accountIdenty = 'user' }) {
  const formRef = useRef(null);
  const eidtIdenty = useRef(null);
  const currentId = useRef(null);
  const goupArr = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [userAddC, setUserAddC] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sex: '',
    tel: '',
    email: '',
    work: '',
    cate: '',
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
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '120',
      render: (_, record) => (
        <Space size="middle">
          <span className="table-button" onClick={() => handleEdit(record.id)}>
            <span style={{ marginRight: '5px' }}>
              <EyeOutlined />
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

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        let oldSource = cloneDeep(dataSource);
        if (eidtIdenty.current) {
          oldSource = oldSource.map((item) => {
            if (item.id === currentId.current) {
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
          oldSource.push(userItem);
        }
        setDataSource(oldSource);
        localForage.setItem('userList', oldSource);
        message.success(eidtIdenty.current ? '编辑成功' : '添加成功');
        currentId.current = null;
        eidtIdenty.current = false;
        setFormData({
          name: '',
          sex: '',
          tel: '',
          email: '',
          work: '',
          cate: '',
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
    console.log(currentUser?.[0], '233-----');
    if (currentUser?.[0]) {
      setFormData(
        currentUser?.[0] || {
          name: '',
          sex: '',
          tel: '',
          email: '',
          work: '',
          cate: '',
        },
      );
    }
    setIsModalVisible(true);
  };

  const handleBatchDelete = () => {
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
  return (
    <div className="right-cont">
      <div className="header-u">
        <h3 className={'title'}>用户列表</h3>
        <InfoCircleOutlined />
      </div>
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
            operateStructure: [<Input placeholder="请输入关键字" />],
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

        {/* 新建用户、选择用户弹框 */}
        <Modal
          title={eidtIdenty.current ? '编辑用户' : '新增用户'}
          width={620}
          visible={isModalVisible}
          onOk={handleOk}
          destroyOnClose={true}
          onCancel={() => {
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
              <div className="user-add-content">
                {userAddC ? (
                  <Form
                    ref={formRef}
                    initialValues={formData}
                    name="basic"
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
                        <Form.Item label="电话" name="tel">
                          <Input placeholder={'请输入电话'} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="邮箱" name="email">
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
  );
}
