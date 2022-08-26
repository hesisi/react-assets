import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Divider,
  PageHeader,
} from 'antd';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './preview.less';
import { PreviewWidget } from '@/pages/Desinger/widgets';
import { transformToTreeNode } from '@designable/formily-transformer';
import Icon from '@/utils/icon';
import { nanoid } from 'nanoid';
import { history } from 'umi';

const Preview = (props) => {
  const [table, setTable] = useState([]); // 从内存获取的表格
  const [column, setColumn] = useState([]); // 表格的数据项
  const [dataSource, setDataSource] = useState([]); // 表格的数据来源
  const [formVisible, setFormVisible] = useState(false);
  const [index, setIndex] = useState(-1);
  const [formTree, setFormTree] = useState(null);
  const [buttons, setButtons] = useState([]); // 操作按钮数组
  const [searchForm] = Form.useForm(); // 检索条件表单
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项

  const formRef = useRef(null);
  const formCode = useMemo(() => {
    return props.location.query.formCode;
  });

  useEffect(() => {
    // 表格
    const tableConfig = JSON.parse(window.localStorage.getItem('tableConfig'));
    const data = tableConfig && tableConfig[formCode];
    if (data) {
      console.log(data);
      setButtons(data.buttonConfig);
      setTable(data.tableConfig);
      setTableCol(data.tableConfig);
    }
    // 表单
    const formColumn = JSON.parse(window.localStorage.getItem('formMap'));
    if (!formColumn) return;
    const formItemObj = formColumn[formCode]['formily-form-schema'];
    if (formItemObj) {
      formItemObj.form = { ...formItemObj.form, layout: 'vertical' };
      console.log('---formItemObj', formItemObj);
      setFormTree(transformToTreeNode(formItemObj));
    }
  }, []);

  // 行删除
  const rowDelete = (_, record, index) => {
    const data =
      dataSource.length > 0
        ? dataSource
        : JSON.parse(window.localStorage.getItem('dataSource'));

    if (index === 0 && data.length === 1) {
      setDataSource([]);
      window.localStorage.setItem('dataSource', []);
    } else {
      const arr = data.filter((e, i) => i !== index);
      setDataSource(arr);
      window.localStorage.setItem('dataSource', JSON.stringify(arr));
    }
  };

  // 行编辑
  const rowEdit = (_, record, index) => {
    setFormVisible(true);
    setIndex(index);
    const form = formRef.current.form;
    form.setValues(record);
  };

  // 设置表格
  const setTableCol = (arr) => {
    const indexCol = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        render: (_, record, index) => {
          return <span>{index + 1}</span>;
        },
      },
    ];
    const operationCol = [
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record, index) => {
          return (
            <Space size={6}>
              <Button
                type="link"
                onClick={() => {
                  rowEdit(_, record, index);
                }}
                size={'small'}
                className="default-table__btn"
                icon={<Icon icon="FormOutlined" />}
              >
                Edit
              </Button>
              <Button
                type="link"
                onClick={() => {
                  rowDelete(_, record, index);
                }}
                size={'small'}
                className="default-table__btn"
                icon={<Icon icon="CloseOutlined" />}
              >
                Delete
              </Button>
            </Space>
          );
        },
      },
    ];
    const tableShow = arr.filter((e) => e.isShow);
    const col = tableShow.map((e) => {
      return {
        title: e.label,
        dataIndex: e.name,
        key: e.id,
        sorter: e.sorter || false,
      };
    });

    // 设置表格
    setColumn(indexCol.concat(col).concat(operationCol));
  };

  // 取消列表配置保存
  const handleCancel = () => {
    setSaveVisible(false);
  };

  // 表单添加
  const formAdd = () => {
    setFormVisible(true);
    setIndex(-1);
  };

  // 表单取消
  const formCancel = () => {
    setFormVisible(false);
    formRef.current.form.reset();
  };

  // 确认添加
  const formOk = () => {
    const form = formRef.current.form;
    form.validate().then(() => {
      // 表单提交
      let arr = [...dataSource];
      if (index === -1) {
        arr.push({
          ...JSON.parse(JSON.stringify(form.values)),
          id: nanoid(),
        });
      } else {
        // 编辑
        arr[index] = {
          ...JSON.parse(JSON.stringify(form.values)),
          id: arr[index].id,
        };
      }
      setDataSource(arr);
      // 数据有异步问题，暂存localStorage
      window.localStorage.setItem('dataSource', JSON.stringify(arr));
      formCancel();
    });
  };

  // 表格选择修改
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 行选择
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="form-preview">
      <PageHeader
        className="default-page__header"
        onBack={() => {
          history.goBack();
        }}
        title="返回"
      />

      <div className="form-preview__table">
        <Row justify="space-between" style={{ padding: '0 40px' }}>
          <Col>
            {/* 检索条件 */}
            <Form form={searchForm} layout="inline" className="default-form">
              {table.map((e) => {
                if (e.filterEnable) {
                  return (
                    <Form.Item name={e.name} key={e.id}>
                      <Input placeholder={`请输入${e.label}`} />
                    </Form.Item>
                  );
                }
                return <div key={e.id}></div>;
              })}
            </Form>
          </Col>

          <Col>
            <Space size={10}>
              <Button
                icon={<Icon icon="PlusOutlined" />}
                className="ant-btn-primary"
                onClick={formAdd}
              >
                新建
              </Button>
              <Button
                icon={<Icon icon="DeleteOutlined" />}
                className="ant-btn-default"
              >
                删除
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: '30px 0 22px' }} />

        {/* 表格部分 */}
        <Table
          columns={column}
          dataSource={dataSource}
          style={{ marginTop: '20px', padding: '0 40px' }}
          rowKey={(record) => record.id}
          rowSelection={rowSelection}
        />
      </div>

      {/* 弹框: 表格 */}
      <Modal
        visible={formVisible}
        title="新增"
        onCancel={formCancel}
        onOk={formOk}
        cancelText="取消"
        okText="确认"
        className="default-modal"
      >
        <PreviewWidget
          key="form"
          tree={formTree}
          ref={formRef}
          layout="vertical"
        />
      </Modal>
    </div>
  );
};

export default Preview;
