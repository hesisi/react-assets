import { Space, Table, Button, Modal, Form, Input, Row, Col } from 'antd';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './preview.less';
import { PreviewWidget } from '@/pages/Desinger/widgets';
import { transformToTreeNode } from '@designable/formily-transformer';
import localForage from 'localforage';
import Icon from '@/utils/icon';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';
import { temp } from './temple';
import { history } from 'umi';
const { Search } = Input;

const tablePreview = React.forwardRef((props, ref) => {
  const {
    tablePreviewClassName = '',
    showTableHeader = true,
    showOperate = true,
    childFormCode = {},
    handleShenPiP,
  } = props;
  const [table, setTable] = useState([]); // 从内存获取的表格
  const [column, setColumn] = useState([]); // 表格的数据项

  const [dataSource, setDataSource] = useState([]); // 表格的数据来源
  const originSource = useRef(null);
  const todoSource = useRef(null);
  const doneSource = useRef(null);

  const curentClickItem = useRef(null);
  const activeKey = useRef(null);

  const [formVisible, setFormVisible] = useState(false);
  const [index, setIndex] = useState(-1);
  const [formTree, setFormTree] = useState(null);
  const [buttons, setButtons] = useState([]); // 操作按钮数组
  const [searchForm] = Form.useForm(); // 检索条件表单
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项

  const formRef = useRef(null);
  const tableRef = useRef(null);
  const formCode = useMemo(() => {
    return props.location?.query?.formCode || props.formCode;
  });

  /*  初始化 */
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
    let initDataIndex = [];
    if (data) {
      setButtons(data.buttonConfig);
      setTable(data.tableConfig);
      initDataIndex = setTableCol(data.tableConfig, data.columns);
    }

    /* 新建保存的source */
    // const tableList = JSON.parse(window.localStorage.getItem('tableList'));
    // if (tableList && tableList[formCode]) {
    //   setDataSource(tableList[formCode]);
    // }
    activeKey.current = '1';
    /* 初始表格数据 */
    initTableLocal(initDataIndex);
  }, []);

  /* 初始表格本地数据 */
  const initTableLocal = async (initDataIndex = []) => {
    let originData = await localForage.getItem('flowCreateMap');
    originData = cloneDeep(originData || {});

    if (!originData?.[childFormCode.id]) {
      originData[childFormCode.id] = {};
    }
    if (!originData[childFormCode.id]['created']) {
      originData[childFormCode.id]['created'] = [];
    }
    if (!originData[childFormCode.id]['toDo']) {
      originData[childFormCode.id]['toDo'] = [];
    }
    if (!originData[childFormCode.id]['done']) {
      originData[childFormCode.id]['done'] = [];
    }

    const initTodoData = {};
    initDataIndex.forEach((item, index) => {
      if (item === 'applyNode') {
        console.log(childFormCode, '98----');
        initTodoData[item] = childFormCode?.approver.name || '';
      } else {
        initTodoData[item] = temp['applyLeave']?.[item] || '';
      }
    });

    originData[childFormCode.id]['toDo'] = [initTodoData];
    todoSource.current = [initTodoData];
    localForage.setItem('flowCreateMap', originData);
    if (activeKey.current === '1') {
      setDataSource(originData[childFormCode.id]['created']);
    }
  };

  const tabChangeControl = async () => {
    let originData = await localForage.getItem('flowCreateMap');
    originData = cloneDeep(originData || {});
    if (activeKey.current === '1') {
      console.log(activeKey.current);
      setDataSource(originData[childFormCode.id]['created']);
    }
    if (activeKey.current === '2') {
      setDataSource(originData[childFormCode.id]['toDo']);
    }
    if (activeKey.current === '3') {
      setDataSource(originData[childFormCode.id]['done']);
    }
  };

  const handleShenPi = (item) => {
    handleShenPiP && handleShenPiP(item);
    curentClickItem.current = item;
  };

  // 设置表格头部
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
                审批
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

    console.log('表头', colsArr);
    const dataIndex = [];
    const cols = colsArr.map((e) => {
      // console.log('表头', e);
      dataIndex.push(e.name);
      if (e.filterEnable) {
        const base = {
          title: e.label,
          dataIndex: e.name || e.id,
          key: e.id,
          sorter: e.sorter || false,
          ...getColumnSearchProps(e.name || e.id, e.label),
        };
        /* 请假业务逻辑 */
        if (e.name === 'applyNode') {
          base['render'] = (text, record) => {
            return (
              <>
                {text === '开始' || text === '结束' ? (
                  text
                ) : (
                  <a
                    onClick={() => handleShenPi(record)}
                    style={{ cursor: 'pointer' }}
                  >
                    {text}
                  </a>
                )}
              </>
            );
          };
        }
        return base;
      } else {
        const base = {
          title: e.label,
          dataIndex: e.name || e.id,
          key: e.id,
          sorter: e.sorter || false,
        };
        /* 请假业务逻辑 */
        if (e.name === 'applyNode') {
          base['render'] = (text, record) => {
            return (
              <>
                {text === '开始' || text === '结束' ? (
                  text
                ) : (
                  <a
                    onClick={() => handleShenPi(record)}
                    style={{ cursor: 'pointer' }}
                  >
                    {text}
                  </a>
                )}
              </>
            );
          };
        }
        return base;
      }
    });

    // 设置表格
    setColumn(cols.concat(showOperate ? operationCol : []));
    return dataIndex;
  };

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
  const formOk = async (formValues = {}) => {
    const originData = await localForage.getItem('flowCreateMap');
    // const form = formRef.current.form;
    // 表单提交
    /* 新建数据 */
    if (activeKey.current !== '2') {
      // 表单提交
      let arr = [...dataSource];
      arr.push({
        ...JSON.parse(JSON.stringify(formValues)),
        id: nanoid(),
        applyNode: '开始',
        oddNumbers: arr.length + 1,
      });
      originData[childFormCode.id]['created'] = arr;
      localForage.setItem('flowCreateMap', originData);
      originSource.current = arr;
      setDataSource(arr);
      return;
    }

    const todoData = cloneDeep(todoSource?.current || []);
    let piItem = {};
    const arr = [];
    todoData.forEach((item) => {
      if (item.id === curentClickItem.current.id) {
        piItem = item;
      } else {
        arr.push(item);
      }
    });
    originData[childFormCode.id]['toDo'] = originData[childFormCode.id][
      'toDo'
    ].filter((item) => item.id !== curentClickItem.current.id);
    console.log(originData, '228----');
    originData[childFormCode.id]['done'] = originData[childFormCode.id][
      'done'
    ].concat([{ ...piItem, applyNode: '结束' }]);

    todoSource.current = arr;
    doneSource.current = cloneDeep(doneSource?.current || []).concat([
      { ...piItem, applyNode: '结束' },
    ]);
    localForage.setItem('flowCreateMap', originData);
    setDataSource(arr);
  };

  /* tab 切换 */
  const tabChange = (tabkey = '1') => {
    activeKey.current = tabkey;
    tabChangeControl();
  };

  React.useImperativeHandle(ref, () => {
    return {
      formOk,
      tabChange,
    };
  });

  // 表格选择修改
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 行选择
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 保存至缓存中
  const saveFormList = (data) => {
    data && localStorage.setItem('tableList', JSON.stringify(data));
  };

  // 只搜索可搜索列
  const onSearch = (str) => {
    if (!str) {
      // 清空搜索值时，重设表格
      const tableList = JSON.parse(window.localStorage.getItem('tableList'));
      setDataSource(tableList[formCode]);
      return;
    }

    const arr1 = table.filter((e) => !e.searchEnable)?.map((e) => e.id); // 可搜索的字段
    const arr2 = dataSource.map((item) => {
      // 过滤表格数据不可搜索字段
      for (let k in item) {
        if (arr1.includes(k)) {
          delete item[k];
        }
      }
      return item;
    });
    const arr3 = [];
    arr2.forEach((item) => {
      // 判断表格数据可搜索字段是否和搜索值有重叠部分
      for (let k in item) {
        if (item[k].toString().indexOf(str) !== -1 && k !== 'id') {
          arr3.push(item);
        }
      }
    });
    const arr4 = [];
    dataSource.forEach((item, index) => {
      // 去重搜索结果，比对id返回正确的行数据
      [...new Set(arr3)].forEach((e, i) => {
        if (e.id === item.id) {
          arr4.push(item);
        }
      });
    });
    setDataSource(arr4);
  };

  return (
    <div className={['table-preview', 'flowCenterTablePrew'].join(' ')}>
      <div className="table-preview__table">
        {/* table 检索区域 */}
        {showTableHeader ? (
          <Row justify="space-between" style={{ padding: '0 40px' }}>
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
                {buttons &&
                  buttons.map((e) => {
                    if (e.icon) {
                      return e.position === 'front' ? (
                        <Button className="default-btn" key={e.id}>
                          <Icon icon={e.icon} />
                          {e.label}
                        </Button>
                      ) : (
                        <Button className="default-btn" key={e.id}>
                          {e.label}
                          <Icon icon={e.icon} />
                        </Button>
                      );
                    }
                    return (
                      <Button className="default-btn" key={e.id}>
                        {e.label}
                      </Button>
                    );
                  })}
              </Space>
            </Col>
            <Col>
              <Search
                placeholder="请输入内容"
                className="default-search"
                onSearch={onSearch}
                allowClear
              />
            </Col>
          </Row>
        ) : null}

        {/* 表格部分 */}
        <Table
          columns={column}
          dataSource={dataSource}
          style={{ marginTop: '20px', padding: '0 40px' }}
          rowKey={(record) => record.id}
          // rowSelection={rowSelection}
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
});

export default tablePreview;
