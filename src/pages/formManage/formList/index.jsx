/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-03 14:59:15
 */
import {
  Col,
  Row,
  Table,
  Form,
  Input,
  Button,
  Space,
  Modal,
  Select,
  Tag,
  Divider,
  Layout,
  Radio,
  Switch,
} from 'antd';
const { Content } = Layout;
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'umi';
// import { initFormListData } from './dataJson'
import { getUUID } from '@/utils/utils.js';
import moment from 'moment';
import { timeFormat } from '@/utils/constants.js';
import { cloneDeep } from 'lodash';
import Styles from './index.less';
import {
  SearchOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  CheckSquareOutlined,
  StopOutlined,
  FormOutlined,
  CloseOutlined,
  SendOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import '@/assets/style/layout.less';

const { TextArea } = Input;

const initFormInfo = {
  formName: '',
  formDesc: '',
  formCode: '',
  createTime: '',
  updateTime: '',
  formStatus: 'enable',
};
const selectList = [
  { value: 'enable', label: '已启用' },
  // { value: 'edit', label: '编辑中' },
  { value: 'disabled', label: '已停用' },
];

export default function FormList() {
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [operateType, setOperateType] = useState('add'); // 区分新建还是编辑表单
  const [formInfo, setFormInfo] = useState(initFormInfo);
  const history = useHistory();
  const formRef = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项

  // 获取formList
  const getFormList = () => {
    const data =
      (localStorage.getItem('formList') &&
        JSON.parse(localStorage.getItem('formList'))) ||
      [];

    setDataSource(data);
  };

  useEffect(() => {
    getFormList(); // 初始化dataSource
  }, []);

  // 表格选择修改
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 行选择
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 设置表单的状态
  const formStatusHandler = (record) => {
    const arr = dataSource.map((e) => {
      if (e.formCode === record.formCode) {
        e.formStatus = record.formStatus === 'enable' ? 'disabled' : 'enable';
      }
      return e;
    });
    setDataSource(arr);
    saveFormList(arr);
  };

  // 表格配置项
  const columns = [
    {
      title: '表单名称',
      dataIndex: 'formName',
      key: 'formName',
    },
    {
      title: '表单编号',
      dataIndex: 'formCode',
      key: 'formCode',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => {
        return (
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
        );
      },
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a, b) => {
        return (
          new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime()
        );
      },
      align: 'center',
    },
    {
      title: 'URL地址',
      dataIndex: 'formUrl',
      key: 'formUrl',
      align: 'center',
      render: (_, { formStatus, formUrl }, index) => {
        return formStatus === 'disabled' ? '' : formUrl;
      },
    },
    {
      title: '表单状态',
      key: 'formStatus',
      dataIndex: 'formStatus',
      render: (_, record, index) => {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={record.formStatus === 'enable'}
            onClick={() => formStatusHandler(record)}
          />
        );
      },
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size={6}>
          <Button
            className="default-table__btn"
            onClick={() => handleShowDesigner(record)}
            size={'small'}
            icon={<FormOutlined />}
            disabled={record.formStatus === 'enable'}
          >
            编辑
          </Button>
          <Button
            className="default-table__btn"
            onClick={() => handleDelete(record)}
            size={'small'}
            icon={<CloseOutlined />}
            disabled={record.formStatus === 'enable'}
          >
            删除
          </Button>
        </Space>
      ),
      fixed: 'right',
      align: 'center',
    },
  ];

  // 保存至缓存中
  const saveFormList = (data) => {
    data && localStorage.setItem('formList', JSON.stringify(data));
  };

  // 删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确定要删除吗',
      content: '该操作不可逆，请谨慎操作！',
      onOk: () => {
        const data = dataSource.filter(
          (item) => item.formCode !== record.formCode,
        );
        setDataSource(data);
        saveFormList(data);
      },
    });
  };

  // 修改
  const handleUpdate = (record) => {
    setOperateType('update');
    setVisible(true);
    setFormInfo(record);
  };

  // 弹窗表单修改
  const onChange = (value) => {
    setFormInfo({
      ...formInfo,
      ...value,
    });
  };

  const handleOk = () => {
    let item = null;
    const currentTime = moment().format(timeFormat);
    if (operateType === 'add') {
      item = {
        formName: formInfo.formName,
        formDesc: formInfo.formDesc,
        formCode: getUUID(),
        createTime: currentTime,
        updateTime: currentTime,
        formStatus: 'disabled',
        formUrl: '',
      };

      const data = cloneDeep(dataSource);
      data.unshift(item);
      setDataSource(data);
      saveFormList(data);
    } else {
      item = {
        formStatus: 'enable',
        ...formInfo,
        updateTime: currentTime,
      };
      const data =
        dataSource &&
        dataSource.map((i) => {
          if (i.formCode === formInfo.formCode) {
            i = item;
          }
          return i;
        });
      setDataSource(data);
      saveFormList(data);
    }

    setVisible(false);
    setFormInfo(initFormInfo); // 清空

    history.push(`/formManage/formAndTable?formCode=${item.formCode}`);
  };

  // 取消表单
  const handleCancel = () => {
    setVisible(false);
    setFormInfo(initFormInfo);
  };

  // 新增表单
  const handleAdd = () => {
    setVisible(true);
    setOperateType('add');
  };

  // 点击跳转到设计器页面
  const handleShowDesigner = (record) => {
    // 页面跳转方法
    history.push({
      pathname: '/formManage/formAndTable',
      search: `formCode=${record.formCode}`,
    });
  };

  // 清除表单检索
  const resetHandler = () => {
    if (!formRef.current) return;
    formRef.current.resetFields();
    getFormList();
  };

  // 检索
  const searchHandler = () => {
    const { formName, formStatus } = formRef.current.getFieldsValue();
    if (!formName && !formStatus) {
      getFormList();
      return;
    }

    const source =
      dataSource.length > 0
        ? dataSource
        : JSON.parse(localStorage.getItem('formList'));
    const data = source.filter((e) => {
      if (formName && formStatus) {
        return (
          e.formName.indexOf(formName) !== -1 && e.formStatus === formStatus
        );
      }
      if (formName) {
        return e.formName.indexOf(formName) !== -1;
      }
      if (formStatus) {
        return e.formStatus === formStatus;
      }

      return e.formName.indexOf(formName) !== -1 || e.formStatus === formStatus;
    });
    setDataSource(data);
  };

  // 批量删除
  const deleteHandler = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '确定要删除吗',
      content: '该操作不可逆，请谨慎操作！',
      onOk: () => {
        let data = dataSource;
        selectedRowKeys.forEach((item) => {
          data = data.filter((e) => e.formCode !== item);
        });
        setDataSource(data);
        saveFormList(data);
      },
    });
  };

  return (
    <div className="list" style={{ paddingBottom: '20px' }}>
      <Layout className="list-layout">
        <Content className="list-content">
          {/* 筛选框 */}
          <Row justify="space-between">
            <Col>
              <Row justify="flex-start">
                <Col>
                  <Form
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    layout="inline"
                    ref={formRef}
                    className="default-form"
                  >
                    <Form.Item label="" name="formName">
                      <Input allowClear placeholder="请输入表单名称" />
                    </Form.Item>

                    <Form.Item label="" name="formStatus">
                      <Select allowClear placeholder="请选择表单状态">
                        {selectList.map((e) => {
                          return (
                            <Select.Option value={e.value} key={e.value}>
                              {e.label}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Form>
                </Col>

                <Col>
                  <Space size={10}>
                    <Button
                      icon={<SearchOutlined />}
                      onClick={searchHandler}
                      className="primary-btn"
                    >
                      搜索
                    </Button>
                    <Button
                      icon={<MinusCircleOutlined />}
                      onClick={resetHandler}
                      className="default-btn"
                    >
                      清除
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>

            <Col>
              <Space size={10}>
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={handleAdd}
                  className="primary-btn"
                >
                  新增表单
                </Button>
                <Button
                  icon={<CloseCircleOutlined />}
                  onClick={deleteHandler}
                  className="primary-btn"
                >
                  删除表单
                </Button>
              </Space>
            </Col>
          </Row>

          <Divider style={{ margin: '30px 0 22px' }} />

          {/* <Row justify="end" style={{ padding: '20px 0' }}></Row> */}

          {/* 列表部分 */}
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => record.formCode}
            rowSelection={rowSelection}
            sticky={true}
            className="default-table"
          />
        </Content>
      </Layout>

      {/* 弹框 */}
      <Modal
        title={`${operateType === 'add' ? '新建' : '修改'}表单`}
        destroyOnClose
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="default-modal"
        cancelText="取消"
        okText="确认"
      >
        <Form layout="vertical">
          <Form.Item label="表单名称">
            <Input
              value={formInfo.formName}
              onChange={(e) =>
                onChange({
                  formName: e.target.value,
                })
              }
              placeholder="请输入"
            />
          </Form.Item>

          <Form.Item label="创建方式">
            <Radio.Group defaultValue="canvas" className="default-radio">
              <Radio value="canvas">画布创建</Radio>
              <Radio value="template">模板创建</Radio>
              <Radio value="data">数据创建</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="备注">
            <TextArea
              value={formInfo.formDesc}
              onChange={(e) =>
                onChange({
                  formDesc: e.target.value,
                })
              }
              placeholder="请输入"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
