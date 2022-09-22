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
  message,
  Spin,
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
import copy from 'copy-to-clipboard';
import { EllipsisTooltip } from '@/components/tablecellEllips.jsx';
import ContentHeader from '@/components/contentHeader';

import * as formApi from '@/services/formManage';

const { TextArea } = Input;

const initFormInfo = {
  formName: '',
  remark: '',
  formId: '',
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
  const formRefNew = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项

  const [urlVisible, setUrlVisible] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取formList
  const getFormList = (hasLoading = true) => {
    // 删除为空的检索条件
    const data = formRef.current.getFieldsValue();
    for (let k in data) {
      if (data[k] === '') {
        delete data[k];
      }
    }
    if (hasLoading) {
      setLoading(true);
    }
    formApi
      .getFormList(data)
      .then((res) => {
        setDataSource(res.object);
      })
      .finally(() => setLoading(false));
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
    const { formId, formStatus } = record;
    formApi
      .changeFormStatus({
        formId,
        formStatus: formStatus === 'enable' ? 'disabled' : 'enable',
      })
      .then((res) => {
        getFormList(false);
      });
    // const arr = dataSource.map((e) => {
    //   if (e.formId === record.formId) {
    //     e.formStatus = record.formStatus === 'enable' ? 'disabled' : 'enable';
    //   }
    //   return e;
    // });
    // setDataSource(arr);
    // saveFormList(arr);

    // if (record.formStatus === 'enable') {
    //   setUrlVisible(true);
    //   const urlStr = `${window.location.protocol}//${window.location.host}/formManage/formPreview/table?formCode=${record.formCode}`;
    //   setUrl(urlStr);
    //   const formList = JSON.parse(window.localStorage.getItem('formList'))?.map(
    //     (e) => {
    //       if (e.formId === record.formId) {
    //         e.formUrl = urlStr;
    //       }
    //       return e;
    //     },
    //   );
    //   window.localStorage.setItem('formList', JSON.stringify(formList));
    // }
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
      dataIndex: 'formId',
      key: 'formId',
      align: 'center',
      width: 200,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
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
      width: 200,
      render: (_, { formStatus, formUrl }, index) => {
        return (
          // formStatus === 'disabled' ? '' :
          <EllipsisTooltip title={formUrl} />
        );
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
            size="large"
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
        formApi.deleteFormById({ formId: record.formId }).then((res) => {
          getFormList();
        });
        // const data = dataSource.filter((item) => item.formId !== record.formId);
        // setDataSource(data);
        // saveFormList(data);
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

  // 新建表单
  const handleOk = () => {
    formRefNew?.current?.validateFields()?.then(() => {
      const data = {
        ...formRefNew.current.getFieldsValue(),
        formStatus: 'disabled', // 默认禁用状态
      };
      formApi.createForm(data).then((res) => {
        setVisible(false);
        history.push(`/formManage/formAndTable?formCode=${res.object}`);
      });
    });
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
      search: `formCode=${record.formId}`,
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
    getFormList();
  };

  // 批量删除
  const deleteHandler = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '确定要删除吗',
      content: '该操作不可逆，请谨慎操作！',
      onOk: () => {
        formApi.batchDeleteForm({ formIdList: selectedRowKeys }).then((res) => {
          getFormList();
        });
        // let data = dataSource;
        // selectedRowKeys.forEach((item) => {
        //   data = data.filter((e) => e.formId !== item);
        // });
        // setDataSource(data);
        // saveFormList(data);
      },
    });
  };

  // 复制url
  const copyUrl = () => {
    copy(url);
    message.success('复制成功');
  };

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a className="default-pagination__Previous">Previous</a>;
    }

    if (type === 'next') {
      return <a className="default-pagination__Next">Next</a>;
    }

    return originalElement;
  };
  const showTotal = (total, range) =>
    `Showing ${range[0]} to ${range[1]} of ${total} entries`;

  return (
    <div className="list" style={{ paddingBottom: '20px' }}>
      <Layout className="list-layout">
        <ContentHeader title="表单管理" />
        <Content className="list-content">
          {/* 筛选框 */}
          <Row justify="space-between">
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
                  className="default-btn"
                >
                  删除表单
                </Button>
              </Space>
            </Col>

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
          </Row>

          <Divider style={{ margin: '30px 0 22px' }} />

          {/* <Row justify="end" style={{ padding: '20px 0' }}></Row> */}

          {/* 列表部分 */}
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey={(record) => record.formId}
              rowSelection={rowSelection}
              sticky={true}
              scroll={{ x: '100%' }}
              className="default-table"
              pagination={{
                itemRender,
                showSizeChanger: false,
                showTotal,
              }}
            />
          </Spin>
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
        <Form
          layout="vertical"
          ref={formRefNew}
          name="basic"
          initialValues={{ createType: 'canvas' }}
        >
          <Form.Item
            label="表单名称"
            name="formName"
            rules={[
              { required: true, message: '请输入表单名称!' },
              {
                type: 'string',
                whitespace: true,
                message: '请输入流程名称',
              },
            ]}
          >
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

          <Form.Item label="创建方式" name="createType">
            <Radio.Group className="default-radio">
              <Radio value="canvas">画布创建</Radio>
              <Radio value="template">模板创建</Radio>
              <Radio value="data">数据创建</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea
              onChange={(e) =>
                onChange({
                  remark: e.target.value,
                })
              }
              placeholder="请输入"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 弹框: 生成url */}
      <Modal
        visible={urlVisible}
        title="生成URL"
        onCancel={() => setUrlVisible(false)}
        okText="复制地址"
        cancelText="取消"
        onOk={copyUrl}
        className="default-modal"
      >
        <Input addonBefore="当前的URL地址：" value={url} />
      </Modal>
    </div>
  );
}
