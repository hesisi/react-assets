import React, { useEffect, useState, useRef } from 'react';
import './activityList.less';
import {
  Space,
  Table,
  Input,
  Button,
  Layout,
  Row,
  Form,
  Col,
  Select,
  Divider,
  Tag,
  Modal,
} from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  FormOutlined,
  SendOutlined,
  CheckSquareOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { history } from 'umi';

const { Content } = Layout;

import type { ColumnsType } from 'antd/es/table';
import Dialog from './Dialog';
import '@/assets/style/layout.less';
import { nanoid } from 'nanoid';

interface DataType {
  key?: string | number;
  name: string;
  id?: string | number;
  status?: string;
  remarks?: string;
  creatTime?: string;
  updateTime?: string;
  sequence?: string;
}

const selectList = [
  { value: 'enable', label: '已启用' },
  { value: 'edit', label: '编辑中' },
  { value: 'disabled', label: '已停用' },
];

export default function Page() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const formRef: any = useRef(null);
  const flowData = window.localStorage.getItem('flowGroup');
  const columns: ColumnsType<DataType> = [
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
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} size={0}>
          {record.status === 'enable' ? (
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
                onClick={() => statusHandler(record, 'disabled')}
              >
                停用
              </Button>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<FormOutlined />}
                onClick={() => handleOk(record.id)}
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
                onClick={() => statusHandler(record, 'enable')}
              >
                启用
              </Button>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<FormOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={<CloseOutlined />}
                onClick={() => handleDelete(record)}
              >
                删除
              </Button>
            </>
          )}
        </Space>
      ),
      width: 300,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '流程编号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '流程名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '流程状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, { status }, index) => {
        let color = status === 'enable' ? 'blue' : 'default';
        return (
          <Tag color={color} key={index}>
            {status
              ? selectList.filter((e) => e.value === status)[0]?.label
              : '暂无状态'}
          </Tag>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项

  // 表格选择修改
  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 行选择
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  /**编辑*/
  const handleEdit = (record: any) => {
    history.push(`/activityManage/activityConfig?flowID=${record.id}`);
  };
  // 删除
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确定要删除吗',
      content: '该操作不可逆，请谨慎操作！',
      onOk: () => {
        if (!flowData) return;
        const data = JSON.parse(flowData).filter(
          (item: any) => item.id !== record.id,
        );
        setTableData(data);
        window.localStorage.setItem('flowGroup', JSON.stringify(data));
      },
    });
  };
  // 设置表单的状态
  const statusHandler = (record: any, status: string) => {
    if (!flowData) return;
    const arr = JSON.parse(flowData).map((e: any) => {
      if (e.id === record.id) {
        e.status = status;
      }
      return e;
    });
    setTableData(arr);
    window.localStorage.setItem('flowGroup', JSON.stringify(arr));
  };

  useEffect(() => {
    const flowData = window.localStorage.getItem('flowGroup');
    if (flowData) {
      const data = JSON.parse(flowData).map((x: any, index: number) => {
        return {
          ...x,
          key: index,
          sequence: index + 1,
        };
      });
      setTableData(data);
    }
  }, []);

  const addProcess = () => {
    setIsModalVisible(true);
  };
  const handleOk = (id?: any) => {
    history.push(`/activityManage/activityConfig?flowID=${id}`);
  };
  // 清除表单检索
  const resetHandler = () => {
    if (!formRef.current) return;
    formRef.current.resetFields();
    tableUpdate();
  };

  // 检索
  const searchHandler = () => {
    const { id, name, status } = formRef.current.getFieldsValue();
    if (!id && !name && !status) {
      tableUpdate();
      return;
    }

    if (!flowData) return;
    const arr = JSON.parse(flowData).filter((e: any) => {
      if (id && name) {
        return e.id.indexOf(id) !== -1 && e.name.indexOf(name) !== -1;
      } else if (id && status) {
        return e.id.indexOf(id) !== -1 && e.status === status;
      } else if (name && status) {
        return e.name.indexOf(name) !== -1 && e.status === status;
      }
      return (
        e.id.indexOf(id) !== -1 ||
        e.name.indexOf(name) !== -1 ||
        e.status === status
      );
    });
    setTableData(arr);
  };

  const tableUpdate = () => {
    const flowData: any = window.localStorage.getItem('flowGroup');
    setTableData(JSON.parse(flowData));
  };

  // 弹窗消失后更新列表
  useEffect(() => {
    tableUpdate();
  }, [isModalVisible]);

  // 批量删除
  const deleteHandler = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '确定要删除吗',
      content: '该操作不可逆，请谨慎操作！',
      onOk: () => {
        if (!flowData) return;
        let data = JSON.parse(flowData);
        selectedRowKeys.forEach((item) => {
          data = data.filter((e: any) => e.id !== item);
        });
        setTableData(data);
        window.localStorage.setItem('flowGroup', JSON.stringify(data));
      },
    });
  };

  return (
    <div className="list">
      <Layout className="list-layout">
        <Content className="list-content">
          <Row justify="space-between" className="list-row">
            <Col>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="inline"
                ref={formRef}
              >
                <Form.Item label="流程编号" name="id">
                  <Input allowClear placeholder="请输入内容" />
                </Form.Item>

                <Form.Item label="流程名称" name="name">
                  <Input allowClear placeholder="请输入内容" />
                </Form.Item>

                <Form.Item label="流程状态" name="status">
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
              <Button icon={<PlusCircleOutlined />} onClick={addProcess}>
                添加
              </Button>
              <Button icon={<CloseCircleOutlined />} onClick={deleteHandler}>
                删除
              </Button>
            </Space>
          </Row>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tableData}
            rowKey={(record: any) => record.id}
          />
        </Content>
      </Layout>
      <Dialog
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleOk={handleOk}
      ></Dialog>
    </div>
  );
}
