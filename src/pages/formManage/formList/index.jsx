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
  { value: 'edit', label: '编辑中' },
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
  const formStatusHandler = (record, status) => {
    const arr = dataSource.map((e) => {
      if (e.formCode === record.formCode) {
        e.formStatus = status;
      }
      return e;
    });
    setDataSource(arr);
    saveFormList(arr);
  };

  // 表格配置项
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
      width: 100,
      fixed: 'left',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} size={0}>
          {record.formStatus === 'enable' ? (
            <>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<SendOutlined />}
              >
                发布
              </Button>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<StopOutlined />}
                onClick={() => formStatusHandler(record, 'disabled')}
              >
                停用
              </Button>
              <Button
                type="link"
                onClick={() => handleShowDesigner(record)}
                style={{ padding: 0 }}
                icon={<FormOutlined />}
              >
                编辑
              </Button>
            </>
          ) : (
            <>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<CheckSquareOutlined />}
                onClick={() => formStatusHandler(record, 'enable')}
              >
                启用
              </Button>
              <Button
                type="link"
                onClick={() => handleShowDesigner(record)}
                style={{ padding: 0 }}
                icon={<FormOutlined />}
              >
                编辑
              </Button>
              <Button
                type="link"
                onClick={() => handleDelete(record)}
                style={{ padding: 0 }}
                icon={<CloseOutlined />}
              >
                删除
              </Button>
            </>
          )}
        </Space>
      ),
      align: 'center',
      width: 300,
      fixed: 'left',
    },

    {
      title: '表单编号',
      dataIndex: 'formCode',
      key: 'formCode',
      align: 'center',
    },
    {
      title: '表单名称',
      dataIndex: 'formName',
      key: 'formName',
      align: 'center',
    },
    {
      title: '表单状态',
      key: 'formStatus',
      dataIndex: 'formStatus',
      render: (_, { formStatus }, index) => {
        let color = formStatus === 'enable' ? 'blue' : 'default';
        return (
          <Tag color={color} key={index}>
            {formStatus
              ? selectList.filter((e) => e.value === formStatus)[0]?.label
              : '暂无状态'}
          </Tag>
        );
      },
      align: 'center',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
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

  // 预览
  const handlePreview = (record) => {
    history.push({
      pathname: '/formManage/formPreview',
      search: `formCode=${record.formCode}`,
    });
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
        formStatus: 'enable',
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
    console.log(item);
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
    <div className="list">
      <Layout className="list-layout">
        <Content className="list-content">
          {/* 筛选框 */}
          <Row justify="space-between" className="list-row">
            <Col>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="inline"
                ref={formRef}
              >
                <Form.Item label="表单名称" name="formName">
                  <Input allowClear placeholder="请输入内容" />
                </Form.Item>

                <Form.Item label="表单状态" name="formStatus">
                  <Select
                    style={{
                      width: 180,
                    }}
                    allowClear
                    placeholder="请选择内容"
                  >
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
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={searchHandler}
                >
                  搜索
                </Button>
                <Button icon={<MinusCircleOutlined />} onClick={resetHandler}>
                  清除
                </Button>
              </Space>
            </Col>
          </Row>

          <Row justify="end" style={{ padding: '20px 0' }}>
            <Space size={10}>
              <Button icon={<PlusCircleOutlined />} onClick={handleAdd}>
                添加
              </Button>
              <Button icon={<CloseCircleOutlined />} onClick={deleteHandler}>
                删除
              </Button>
            </Space>
          </Row>

          {/* 列表部分 */}
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => record.formCode}
            rowSelection={rowSelection}
            sticky={true}
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
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="表单名称">
            <Input
              value={formInfo.formName}
              onChange={(e) =>
                onChange({
                  formName: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item label="创建方式">
            <Radio.Group defaultValue="canvas">
              <Radio.Button value="canvas">画布创建</Radio.Button>
              <Radio.Button value="template">模板创建</Radio.Button>
              <Radio.Button value="data">数据创建</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="描述">
            <TextArea
              value={formInfo.formDesc}
              onChange={(e) =>
                onChange({
                  formDesc: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
