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
  Switch,
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
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { EllipsisTooltip } from '@/components/tablecellEllips.jsx';
import ContentHeader from '@/components/contentHeader';
import { history } from 'umi';

const { Content } = Layout;

import type { ColumnsType } from 'antd/es/table';
import Dialog from './Dialog';
import '@/assets/style/layout.less';
import { nanoid } from 'nanoid';
import { key } from 'localforage';
import { findActivityList } from '@/services/activityManage';

interface DataType {
  /**流程名称*/
  processName: string;
  processId?: string | number;
  /**流程状态*/
  status?: string;
  remarks?: string;
  creatTime?: string;
  updateTime?: string;
}

const selectList = [
  { value: 'enable', label: '启用' },
  { value: 'disabled', label: '停用' },
];

export default function Page() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const formRef: any = useRef(null);
  const flowData = window.localStorage.getItem('flowGroup');
  const _processGroup_ = window.localStorage.getItem('processGroup') || '';
  const _processGroup =
    _processGroup_ != ''
      ? JSON.parse(_processGroup_)
      : [
          {
            key: 1,
            typeIndex: '1',
            typeName: '默认分组',
          },
        ];
  const columns: ColumnsType<DataType> = [
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName',
    },
    {
      title: '分组',
      dataIndex: 'processGroup ',
      key: 'processGroup ',
      render: (processGroup) => {
        return (
          <span>
            {
              _processGroup[
                _processGroup.findIndex((item: any) => {
                  return item.typeIndex === processGroup;
                })
              ]?.typeName
            }
          </span>
        );
      },
    },
    {
      title: '流程编号',
      dataIndex: 'processId',
      key: 'processId',
      align: 'center',
      width: 200,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      align: 'center',
      width: 200,
      render: (text) => {
        return <EllipsisTooltip title={text} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
      sorter: (a: any, b: any) => {
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
      sorter: (a: any, b: any) => {
        return (
          new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime()
        );
      },
      align: 'center',
    },
    {
      title: '流程状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record, index) => {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="停用"
            checked={record?.status === 'enable'}
            onClick={() => handleChangeStatus(record)}
          />
        );
      },
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space size={6}>
          {/*<Button*/}
          {/*  style={{*/}
          {/*    fontSize: '12px',*/}
          {/*    color: '#0D6BFF',*/}
          {/*    borderColor: '#0D6BFF',*/}
          {/*  }}*/}
          {/*  size={'small'}*/}
          {/*  icon={<EyeOutlined />}*/}
          {/*  onClick={() => handleEdit(record)}*/}
          {/*>*/}
          {/*  查看*/}
          {/*</Button>*/}
          <Button
            className="default-table__btn"
            size={'small'}
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            className="default-table__btn"
            size={'small'}
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
      fixed: 'right',
      align: 'center',
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项
  const [listParams, setListParams] = useState([]); //列表查询

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
    history.push(
      `/activityManage/activityConfig?processName=${record.processName}&processId=${record.processId}`,
    );
  };
  // 删除
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确定要删除吗',
      content: '该操作不可逆，请谨慎操作！',
      onOk: () => {
        if (!flowData) return;
        const data = JSON.parse(flowData).filter(
          (item: any) => item.processId !== record.processId,
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
      if (e.processId === record.processId) {
        e.status = status;
      }
      return e;
    });
    setTableData(arr);
    window.localStorage.setItem('flowGroup', JSON.stringify(arr));
  };

  useEffect(() => {
    const flowData = window.localStorage.getItem('flowGroup');

    // if (flowData) {
    //   const data = JSON.parse(flowData).map((x: any, index: number) => {
    //     return {
    //       ...x,
    //       key: index,
    //       sequence: index + 1,
    //     };
    //   });
    //   setTableData(data);
    // }

    tableUpdate();
    // setListParams()
  }, []);

  const addProcess = () => {
    setIsModalVisible(true);
  };
  const handleOk = (id?: any, name?: any) => {
    history.push(
      `/activityManage/activityConfig?isCreate=true&processName=${name}&processId=${id}`,
    );
  };
  // 清除表单检索
  const resetHandler = () => {
    if (!formRef.current) return;
    formRef.current.resetFields();
    tableUpdate();
  };

  // 检索
  const searchHandler = () => {
    const { name, status } = formRef.current.getFieldsValue();
    console.log('name~~~~');
    if (!name && !status) {
      tableUpdate();
      return;
    }

    if (!flowData) return;
    const arr = JSON.parse(flowData).filter((e: any) => {
      console.log(e);
      if (name) {
        return e.processName?.indexOf(name) !== -1;
      } else if (status) {
        return e.status === status;
      } else if (name && status) {
        return e.processName?.indexOf(name) !== -1 && e.status === status;
      }
      return e.processName?.indexOf(name) !== -1 || e.status === status;
    });
    setTableData(arr);
  };

  const tableUpdate = () => {
    let params = {
      pageNum: 0,
      pageSize: 0,
    };
    findActivityList(params).then((res: any) => {
      if (res?.data?.isSuccess > 0) {
        let list = res?.data?.data?.list;
        console.log(res?.data?.data?.list);
        setTableData(list);
      }
    });
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
          data = data.filter((e: any) => e.processId !== item);
        });
        setTableData(data);
        window.localStorage.setItem('flowGroup', JSON.stringify(data));
      },
    });
  };

  /**更改状态*/
  const handleChangeStatus = (data: DataType) => {
    // todo
    // const temp = tableData.map((x) => {
    //   if (x.processId === data.processId) {
    //     x.status = data.status === 'enable' ? 'disabled' : 'enable';
    //   }
    //   return x;
    // });
    // window.localStorage.setItem('flowGroup', JSON.stringify(temp));
    // setTableData(temp);
  };
  return (
    <div className="list">
      <Layout className="list-layout">
        <ContentHeader title="流程管理" />
        <Content className="list-content">
          <Row justify="start" className="list-row">
            <Col>
              <Space size={10}>
                <Button
                  icon={<PlusOutlined />}
                  onClick={addProcess}
                  type="primary"
                >
                  新增流程
                </Button>
                <Button icon={<DeleteOutlined />} onClick={deleteHandler}>
                  删除流程
                </Button>
              </Space>
            </Col>
            <Col style={{ marginLeft: 'auto' }}>
              <Row justify="end">
                <Col>
                  <Form
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    layout="inline"
                    ref={formRef}
                    className="default-form"
                  >
                    <Form.Item label="" name="name">
                      <Input allowClear placeholder="请输入流程名称" />
                    </Form.Item>

                    <Form.Item label="" name="status">
                      <Select allowClear placeholder="请选择流程状态">
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
                      style={{ borderRadius: '5px' }}
                      type="primary"
                    >
                      搜索
                    </Button>
                    <Button
                      icon={<MinusCircleOutlined />}
                      onClick={resetHandler}
                      style={{ borderRadius: '5px' }}
                    >
                      清除
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tableData}
            rowKey={(record: any) => record.processId}
            style={{ marginTop: '20px' }}
            scroll={{ x: '100%' }}
            bordered={false}
            className="default-table"
            pagination={{
              total: tableData?.length || 0,
              showSizeChanger: true,
              // onChange: handlePageChange,
            }}
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
