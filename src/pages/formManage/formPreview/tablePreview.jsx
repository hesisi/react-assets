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
const { Search } = Input;

const tablePreview = (props) => {
  const [table, setTable] = useState([]); // 从内存获取的表格
  const [column, setColumn] = useState([]); // 表格的数据项
  const [dataSource, setDataSource] = useState([]); // 表格的数据来源
  const [formVisible, setFormVisible] = useState(false);
  const [index, setIndex] = useState(-1);
  const [formTree, setFormTree] = useState(null);
  const [buttons, setButtons] = useState([]); // 操作按钮数组
  const [searchForm] = Form.useForm(); // 检索条件表单
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项
  const [showPageTitle, setShowPageTitle] = useState(true);

  const formRef = useRef(null);
  const tableRef = useRef(null);
  const formCode = useMemo(() => {
    return props.location?.query?.formCode || props.formCode;
  });

  // 列检索
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  // 检索搜索
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // 重置检索
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, label) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${label}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<Icon icon="SearchOutlined" />}
            size="small"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    // 表头的检索按钮
    filterIcon: (filtered) => (
      <Icon
        icon="SearchOutlined"
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        ?.includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  useEffect(() => {
    // 表单
    const formColumn = JSON.parse(window.localStorage.getItem('formMap'));
    if (!formColumn) return;
    const formItemObj = formColumn[formCode]['formily-form-schema'];
    if (formItemObj) {
      formItemObj.form = { ...formItemObj.form, layout: 'vertical' };
      setFormTree(transformToTreeNode(formItemObj));
    }

    // 表格
    const tableConfig = JSON.parse(window.localStorage.getItem('tableConfig'));
    const data = tableConfig && tableConfig[formCode];
    if (data) {
      setButtons(data.buttonConfig);
      setTable(data.tableConfig);
      setTableCol(data.tableConfig, data.columns);
      // setColumn(data.columns);
    }

    // 处理表格数据为表单
    // const properties = formItemObj?.schema?.properties;
    // const idArr = data.tableConfig
    //   .filter((e) => e.filterEnable)
    //   .map((e) => e['x-designable-id']);
    // const proArr = [];
    // for (let k in properties) {
    //   if (idArr.includes(k)) {
    //     proArr.push(properties[k]);
    //   }
    // }
    // const obj = {
    //   form: { labelCol: 0, wrapperCol: 0, layout: 'inline' },
    //   schema: {
    //     ...formItemObj.schema,
    //     properties: { ...proArr },
    //   },
    // };
    // setTable(transformToTreeNode(obj));

    setShowPageTitle(props.showPageTitle);
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
  const setTableCol = (arr, col) => {
    const indexCol = [
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
    ];
    const operationCol = [
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 150,
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
                编辑
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
                删除
              </Button>
            </Space>
          );
        },
      },
    ];
    const tableShow = arr.filter((e) => e.isShow);
    const colsArr = [];
    for (let i = 0; i < col.length; i++) {
      for (let j = 0; j < tableShow.length; j++) {
        if (col[i].dataIndex === tableShow[j].name) {
          colsArr.push(tableShow[j]);
        }
      }
    }
    const cols = colsArr.map((e) => {
      if (e.filterEnable) {
        return {
          title: e.label,
          dataIndex: e.id,
          key: e.id,
          sorter: e.sorter || false,
          ...getColumnSearchProps(e.id, e.label),
        };
      } else {
        return {
          title: e.label,
          dataIndex: e.id,
          key: e.id,
          sorter: e.sorter || false,
        };
      }
    });

    // 设置表格
    setColumn(indexCol.concat(cols).concat(operationCol));
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

  // 批量删除
  const deleteHandler = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '确定要删除吗',
      content: '该操作不可逆，请谨慎操作！',
      onOk: () => {
        let data = dataSource;
        selectedRowKeys.forEach((item) => {
          data = data.filter((e) => e.id !== item);
        });
        setDataSource(data);
        // saveFormList(data);
      },
    });
  };

  // 保存至缓存中
  // const saveFormList = (data) => {
  //   data && localStorage.setItem('formList', JSON.stringify(data));
  // };

  return (
    <div className="table-preview">
      {showPageTitle ? (
        <PageHeader
          className="default-page__header"
          onBack={() => {
            history.goBack();
          }}
          title="返回"
        />
      ) : (
        <></>
      )}

      <div className="table-preview__table">
        <Row justify="space-between" style={{ padding: '0 40px' }}>
          {/* <Col> */}
          {/* 检索条件 */}
          {/* <PreviewWidget key="form" tree={table} /> */}
          {/* <Form form={searchForm} layout="inline" className="default-form">
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
          </Col> */}

          <Col>
            <Space size={10}>
              <Button
                icon={<Icon icon="PlusOutlined" />}
                className="primary-btn"
                onClick={formAdd}
              >
                新建
              </Button>
              <Button
                icon={<Icon icon="DeleteOutlined" />}
                className="default-btn"
                onClick={deleteHandler}
              >
                删除
              </Button>
            </Space>
          </Col>
          <Col>
            <Search placeholder="请输入内容" className="default-search" />
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
          scroll={{ x: 'max-content' }}
          className="default-table"
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
        className="form-preview__modal default-modal"
      >
        {formTree ? (
          <PreviewWidget key="form" tree={formTree} ref={formRef} />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

export default tablePreview;
