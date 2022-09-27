import React, { useEffect, useState, useRef, createElement } from 'react';
import {
  Row,
  Col,
  Button,
  Space,
  Tabs,
  Collapse,
  Form,
  Select,
  Input,
  Divider,
  Tag,
  Table,
  Popover,
  Tree,
  Checkbox,
  Modal,
  Radio,
  message,
  Spin,
} from 'antd';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search, TextArea } = Input;

import './tableSetting.less';
import { nanoid } from 'nanoid';
import Icon from '@/utils/icon';
import * as config from './settingConfig';

import { history } from 'umi';
import { PreviewWidget } from '@/pages/Desinger/widgets';
import { transformToTreeNode } from '@designable/formily-transformer';
import { getUUID } from '@/utils/utils.js';

import TablePreview from '@/pages/formManage/formPreview/tablePreview';
import copy from 'copy-to-clipboard';
import Sortable from 'sortablejs';

import * as formApi from '@/services/formManage';

let cols = [];
const tableSetting = (props) => {
  const [table, setTable] = useState([]); // 从内存获取的表格
  const [columnCount, setColumnCount] = useState(5); // 表格的列数计算
  const [buttons, setButtons] = useState([]); // 操作按钮数组
  const [tabsActiveKey, setTabsActiveKey] = useState('table'); // tabs激活key
  const [btnForm] = Form.useForm(); // 按钮属性表单
  const [searchForm] = Form.useForm(); // 检索条件表单
  const [selectBtnId, setSelectBtnId] = useState(null); // 当前选中的操作按钮
  const [column, setColumn] = useState([]); // 表格的数据项
  const [dataSource, setDataSource] = useState([]); // 表格的数据来源
  const [btnPopoverVisible, setBtnPopoverVisible] = useState(false); // 按钮图标popover可见性
  const [treeData, setTreeData] = useState([]); // 大纲树
  const [saveVisible, setSaveVisible] = useState(false);
  // const [formVisible, setFormVisible] = useState(false);
  const [formTree, setFormTree] = useState(null);
  const formRef = useRef(null);
  const [index, setIndex] = useState(-1);
  const [icon, setIcon] = useState('');
  // const [iconPosition, setIconPosition] = useState('front');
  const [iconList, setIconList] = useState(config.iconList);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [urlVisible, setUrlVisible] = useState(false);
  const [url, setUrl] = useState('');

  // 列检索
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [checkboxValue, setCheckBoxValue] = useState([
    'active',
    'saveAsTemplate',
  ]);

  const [loading, setLoading] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [echoArr, setEchoArr] = useState([]);

  /* table 预览 */
  const tablePreviewData = useRef(null);
  const [tableMCode, setTableMCode] = useState(null);
  const tableMobanCode = useRef(null);

  /* tabel configRef */

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

  // 从内存获取表格
  useEffect(() => {
    tableDataFetch();
    columnDrop();
  }, []);

  useEffect(() => {
    cols = column;
  }, [column]);

  // 监听修改，重新渲染表格
  useEffect(() => {
    setTableCol(table);
  }, [table]);

  // 设置表格
  const setTableCol = (arr) => {
    const indexCol = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 80,
        render: (_, record, index) => {
          return <span>{index + 1}</span>;
        },
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
                onClick={() => {
                  rowEdit(_, record, index);
                }}
                className="default-table__btn"
                size={'small'}
                icon={<Icon icon="CloseOutlined" />}
              >
                编辑
              </Button>
              <Button
                onClick={() => {
                  rowDelete(_, record, index);
                }}
                className="default-table__btn"
                size={'small'}
                icon={<Icon icon="FormOutlined" />}
              >
                删除
              </Button>
            </Space>
          );
        },
      },
    ];
    const tableShow = arr.filter((e) => e.isShow);
    const col = tableShow.map((e) => {
      if (e.filterEnable) {
        return {
          title: e.label,
          dataIndex: e.name || e.id,
          key: e.id,
          sorter: e.sorter || false,
          ...getColumnSearchProps(e.name || e.id, e.label),
        };
      } else {
        return {
          title: e.label,
          dataIndex: e.name || e.id,
          key: e.id,
          sorter: e.sorter || false,
        };
      }
    });

    // 设置表格
    setColumn(indexCol.concat(col).concat(operationCol));
  };

  const isArrEqual = (arr1, arr2) => {
    return (
      arr1.length === arr2.length && arr1.every((ele) => arr2.includes(ele))
    );
  };

  // 根据formCode获取存在localStorage的table
  const tableDataFetch = () => {
    setLoading(true);
    tableMobanCode.current = [];
    formApi.getFormDetails({ formId: props.formCode }).then(async (res) => {
      const formDetail = res?.object || {};
      const { formPropertyValue, listPropertyValue, ...others } = formDetail;
      console.log(formPropertyValue, '265----');
      const formItemObj = JSON.parse(formPropertyValue);
      tableMobanCode.current = formDetail.formTableCode;

      setTableMCode(formDetail.formTableCode);

      await tableEcho(formDetail, formItemObj);
    });
  };

  /**
   * 表格回显
   * @description
   * 1. 表头存在顺序的回显
   * 2. 表单新增后切换到列表配置,表头需要增加相应列
   * @param {*} formDetail
   * @param {*} formItemObj
   */
  const tableEcho = (formDetail, formItemObj) => {
    formApi
      .getTableDetails({
        formId: props.formCode,
        formTableCode: formDetail.formTableCode,
      })
      .then((res) => {
        const columnsInit = res.object;
        const tableConfig = columnsInit?.tableConfig || [];
        const buttons = columnsInit?.buttonConfig || [];
        setButtons(buttons);

        if (formItemObj) {
          setFormTree(transformToTreeNode(formItemObj));
        }
        let data = [];

        // 拉平数据
        const objSetFunc = (data, arr) => {
          for (let key in data) {
            if (data[key].properties) {
              // 存在外层布局的时候
              for (let k in data[key].properties) {
                arr.push({
                  ...data[key].properties[k],
                  name:
                    data[key].properties[k].name ||
                    data[key]['x-designable-id'], // name对应的属性名
                  label: data[key].properties[k].title, // 表格列名称（title绝对会有，name不一定有）
                  type: data[key].properties[k]['x-component'],
                  rules: [
                    {
                      required: data[key].properties[k]?.required || false,
                      message: `please input ${data[key].properties[k].title}`,
                    },
                  ],
                  id: data[key].properties[k]['x-designable-id'],
                  ...config.columnInit,
                });
              }
            } else {
              arr.push({
                ...data[key],
                name: data[key].name || data[key]['x-designable-id'], // name对应的属性名
                label: data[key].title, // 表格列名称（title绝对会有，name不一定有）
                type: data[key]['x-component'],
                rules: [
                  {
                    required: data[key]?.required || false,
                    message: `please input ${data[key].title}`,
                  },
                ],
                id: data[key]['x-designable-id'],
                ...config.columnInit,
              });
            }
          }
        };

        const temp = (prop) => {
          if (!prop) return [];
          for (let k in prop) {
            if (prop[k].properties) {
              temp(prop[k].properties);
            } else {
              data.push(prop[k]);
            }
          }
          return data;
        };
        let properties = temp(formItemObj?.schema?.properties);
        let formItem = [];

        objSetFunc(properties, formItem);

        const idArr1 = formItem.map((e) => e.id);
        const idArr2 = tableConfig.map((e) => e.id);

        if (tableConfig) {
          // 存在需要回显的table的时候
          if (isArrEqual(idArr1, idArr2)) {
            formItem = tableConfig;
          } else {
            // 表单配置有新的元素的时候
            let arr = [];
            formItem.forEach((item) => {
              if (!idArr2.some((e) => e === item.id)) {
                arr.push(item);
              }
            });
            formItem = [...tableConfig, ...arr];
          }
        }
        setTable(formItem);
        setColumnCount(formItem.length);
        setTableCol(formItem);
        setUrl(`/formManage/formPreview/table?formCode=${props.formCode}`);

        const children = formItem.map((e) => {
          return {
            title: e.title || e.name,
            key: e.id,
          };
        });

        if (!formDetail) return;
        const tree = [
          {
            title: `${formDetail.formName}    （${children.length}）`,
            key: formDetail.formId,
            children: children,
          },
        ];
        setTreeData(tree);
      })
      .finally(() => setLoading(false));
  };

  // 添加操作按钮
  const buttonAdd = () => {
    const btn = {
      id: nanoid(),
      label: '按钮',
      icon: '',
      method: '',
    };
    setButtons([...buttons, btn]);
  };

  // 删除操作按钮
  const buttonsDelete = (id) => {
    const btn = buttons.filter((e) => e.id !== id);
    setButtons(btn);
    btnForm.resetFields();
  };

  // 选择操作按钮
  const buttonSelect = (e) => {
    setTabsActiveKey('button');
    btnForm.setFieldsValue({ ...e });
    setSelectBtnId(e.id);
    setIcon(btnForm.getFieldValue('icon'));
  };

  // tabs点击时
  const onTabClick = (e) => {
    setTabsActiveKey(e);
  };

  // 表单保存
  const onFinish = (ele, type) => {
    if (type === 'btn') {
      const btns = buttons.map((e) => {
        if (e.id === selectBtnId) {
          e = { ...ele, id: selectBtnId };
        }
        return e;
      });
      setButtons(btns);
      // setIconPosition(ele.position);
      btnFormReset();
    }
  };

  // icon检索
  const onSearch = (str) => {
    if (!str) {
      setIconList(config.iconList);
      return;
    }
    const list = iconList.filter(
      (item) => item.toLowerCase().indexOf(str.toLowerCase()) !== -1,
    );
    setIconList(list);
  };

  // 气泡内容
  const content = (
    <>
      {' '}
      <Search
        placeholder="input iconName"
        onSearch={onSearch}
        style={{
          width: 300,
        }}
        allowClear
        className="default-search"
      />
      <Divider />
      <Space className="button-icon" size={10} wrap>
        {iconList.map((e, i) => {
          return (
            <div
              onClick={() => {
                selectIcon(e);
              }}
              key={i}
            >
              <Icon icon={e} />
            </div>
          );
        })}
      </Space>
    </>
  );

  // 按钮图标选择
  const selectIcon = (icon) => {
    btnForm.setFieldValue('icon', icon);
    setIcon(icon);
    setBtnPopoverVisible(false);
  };

  // 列表配置的下拉框改变的时候
  const selectChange = (ele, e, property) => {
    const tables = table.map((item) => {
      if (ele.id === item.id) {
        item[property] = e;
      }
      return item;
    });
    setTable(tables);
  };

  // 根据拖拽后表头设置表格
  const tableColumnSet = (columns, arr) => {
    let colsArr = [];
    let max = columns.length - 1;
    for (let i = 0; i < arr.length; i++) {
      const index = columns.findIndex((e) => e.key === arr[i].id);
      if (index !== -1) {
        colsArr[index] = arr[i];
      } else {
        max++;
        colsArr[max] = arr[i];
      }
    }

    return colsArr;
  };

  // 列表配置保存
  const handleOk = () => {
    let isTemplate = checkboxValue.includes('saveAsTemplate') ? true : false;

    const data = {
      tableConfig: tableColumnSet(cols.slice(1, -1), table),
      buttonConfig: buttons,
      status: checkboxValue.includes('active') ? 'enable' : 'disabled',
      id: props.formCode, // 表单id
      columns: cols.slice(1, -1),
    };

    setSaveLoading(true);
    formApi
      .tableCreate(data)
      .then((res) => {
        message.success(`${res.message}, 即将返回列表页`);
        setTimeout(() => {
          history.push('/formManage/formList');
        }, 1000);
      })
      .finally(() => {
        setSaveLoading(false);
        setSaveVisible(false);
      });
  };

  // 取消列表配置保存
  const handleCancel = () => {
    setSaveVisible(false);
  };

  // 按钮属性表单清空
  const btnFormReset = () => {
    btnForm?.resetFields();
    setIcon(btnForm.getFieldValue('icon'));
  };

  // 预览
  const previewHandler = () => {
    const obj = window.localStorage.getItem('tableConfig')
      ? JSON.parse(window.localStorage.getItem('tableConfig'))
      : {};
    const data = {
      [`${props.formCode}`]: {
        tableConfig: table,
        buttonConfig: buttons,
        status: status,
        id: props.formCode,
        columns: cols.slice(1, -1),
      },
    };
    window.localStorage.setItem(
      'tableConfig',
      JSON.stringify(Object.assign(obj, data)),
    );
    tablePreviewData.current = null;
    setPreviewVisible(true);
  };

  const saveTableData = (tableData) => {
    tablePreviewData.current = tableData;
  };

  /* 预览保存 */

  // 复制url
  const copyUrl = () => {
    handleOk();
    copy(url);
    message.success('复制成功');
  };

  // 生成Url
  const generateHandler = () => {
    formApi
      .changeFormStatus({ formId: props.formCode, formUrl: url })
      .then(() => {
        setUrlVisible(true);
      });
  };

  // 拖拽
  const columnDrop = () => {
    const tr = document.querySelector('.ant-table-thead tr');
    if (!tr) return;
    Sortable.create(tr, {
      animation: 180,
      delay: 0,
      onEnd: (evt) => {
        const oldItem = cols[evt.oldIndex];
        const arr = [...cols];
        arr.splice(evt.oldIndex, 1);
        arr.splice(evt.newIndex, 0, oldItem);
        cols = arr;
      },
    });
  };

  return (
    <Spin spinning={loading}>
      <div className="table-setting">
        <Row
          justify="end"
          style={{
            padding: '10px 15px 10px',
            background: 'white',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid rgba(225,229,236,1)',
          }}
        >
          <Space size={10}>
            <Button
              icon={<Icon icon="FundProjectionScreenOutlined" />}
              className="primary-btn"
              onClick={generateHandler}
            >
              生成URL
            </Button>
            <Button
              icon={<Icon icon="SaveOutlined" />}
              onClick={previewHandler}
              className="primary-btn"
            >
              预览
            </Button>
            <Button
              icon={<Icon icon="SaveOutlined" />}
              onClick={() => {
                setSaveVisible(true);
              }}
              className="primary-btn"
            >
              保存
            </Button>
            <Button
              icon={<Icon icon="ArrowLeftOutlined" />}
              className="default-btn"
              onClick={() => {
                history.push('/formManage/formList');
              }}
            >
              返回
            </Button>
          </Space>
        </Row>

        <Row>
          {/* 大纲部分 */}
          <Col
            span={4}
            style={{
              border: '1px solid rgba(225,229,236,1)',
              borderRight: 0,
              padding: '10px',
              borderRadius: '5px',
              background: 'white',
            }}
          >
            <p className="table-col__title">大纲</p>
            {treeData.length > 0 ? (
              <Tree
                defaultExpandedKeys={[`${props.formCode}`]}
                defaultExpandAll={true}
                defaultExpandParent
                treeData={treeData}
              />
            ) : (
              <></>
            )}
          </Col>

          {/* 表格部分 */}
          <Col
            span={15}
            style={{
              border: '1px solid rgba(225,229,236,1)',
              borderRight: 0,
              padding: '20px',
              borderRadius: '5px',
              background: 'white',
            }}
          >
            <Button
              icon={<Icon icon="SaveOutlined" />}
              className="primary-btn"
              onClick={buttonAdd}
            >
              添加按钮
            </Button>
            <Divider />
            {/* button和搜索 */}
            <Row justify="space-between">
              <Col span={19}>
                <Space size={10} wrap>
                  <Button
                    icon={<Icon icon="PlusOutlined" />}
                    className="primary-btn"
                  >
                    {/* onClick={formAdd} */}
                    新建
                  </Button>
                  <Button
                    icon={<Icon icon="DeleteOutlined" />}
                    className="primary-btn"
                  >
                    删除
                  </Button>
                  {buttons &&
                    buttons.map((e) => {
                      return (
                        <Tag
                          closable
                          key={e.id}
                          className="button-tag"
                          onClose={() => {
                            buttonsDelete(e.id);
                          }}
                        >
                          {e.icon ? (
                            e.position === 'front' ? (
                              <Button
                                onClick={() => buttonSelect(e)}
                                className="add-btn"
                              >
                                <Icon icon={e.icon} />
                                {e.label}
                              </Button>
                            ) : (
                              <Button
                                onClick={() => buttonSelect(e)}
                                className="add-btn"
                              >
                                {e.label}
                                <Icon icon={e.icon} />
                              </Button>
                            )
                          ) : (
                            <Button
                              onClick={() => buttonSelect(e)}
                              className="add-btn"
                            >
                              {e.label}
                            </Button>
                          )}
                        </Tag>
                      );
                    })}
                </Space>
              </Col>

              <Col span={5} style={{ textAlign: 'right' }}>
                <Search placeholder="请输入内容" />
              </Col>
            </Row>
            <Divider />

            <span className="tab__text" style={{ lineHeight: '20px' }}>
              请先配置表头属性后进行拖拽动作, 否则拖拽顺序无法保存 !
            </span>
            <Table
              columns={column}
              dataSource={[]}
              pagination={{ position: ['none', 'none'] }}
              style={{ marginTop: '20px' }}
              // rowKey={(record) => record.id}
              scroll={{ x: 'max-content' }}
              className="default-table"
            />
          </Col>

          {/* 配置项部分 */}
          <Col
            span={5}
            style={{
              border: '1px solid rgba(225,229,236,1)',
              padding: '10px',
              borderRadius: '5px',
              background: 'white',
            }}
          >
            <Tabs
              tabPosition="top"
              activeKey={tabsActiveKey}
              onTabClick={onTabClick}
            >
              {/* 列表配置 */}
              <TabPane tab="列表配置" key="table">
                <span className="tab__text">
                  列表显示的字段建议不超过7个，当前已显示{columnCount}个。
                </span>
                {/* 字段折叠面板 */}
                <Collapse accordion style={{ background: '#fafafa' }}>
                  {table &&
                    table.map((e) => {
                      return (
                        <Panel header={e.label} key={e.id}>
                          <Form
                            initialValues={{
                              isShow: e.isShow,
                              sorter: e.sorter,
                              searchEnable: e.searchEnable,
                              filterEnable: e.filterEnable,
                            }}
                          >
                            <Form.Item label="在列表显示" name="isShow">
                              <Select
                                onChange={(ele) =>
                                  selectChange(e, ele, 'isShow')
                                }
                                value={e.isShow}
                              >
                                {config.selectList.isShow.map((e) => {
                                  return (
                                    <Select.Option
                                      value={e.value}
                                      key={e.value}
                                    >
                                      {e.label}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>

                            <Form.Item label="是否可排序" name="sorter">
                              <Select
                                onChange={(ele) =>
                                  selectChange(e, ele, 'sorter')
                                }
                                value={e.sorter}
                              >
                                {config.selectList.sortEnable.map((e) => {
                                  return (
                                    <Select.Option
                                      value={e.value}
                                      key={e.value}
                                    >
                                      {e.label}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>

                            <Form.Item label="是否可搜索" name="searchEnable">
                              <Select
                                onChange={(ele) =>
                                  selectChange(e, ele, 'searchEnable')
                                }
                                value={e.searchEnable}
                              >
                                {config.selectList.searchEnable.map((e) => {
                                  return (
                                    <Select.Option
                                      value={e.value}
                                      key={e.value}
                                    >
                                      {e.label}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>

                            <Form.Item label="在筛选栏显示" name="filterEnable">
                              <Select
                                onChange={(ele) =>
                                  selectChange(e, ele, 'filterEnable')
                                }
                                value={e.filterEnable}
                              >
                                {config.selectList.filterEnable.map((e) => {
                                  return (
                                    <Select.Option
                                      value={e.value}
                                      key={e.value}
                                    >
                                      {e.label}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Form>
                        </Panel>
                      );
                    })}
                </Collapse>
              </TabPane>

              {/* 按钮属性 */}
              <TabPane tab="按钮属性" key="button" forceRender={true}>
                <Form
                  initialValues={config.buttonInit}
                  form={btnForm}
                  onFinish={(e) => onFinish(e, 'btn')}
                >
                  <Form.Item label="按钮文本" name="label">
                    <Input />
                  </Form.Item>

                  <Form.Item label="按钮位置" name="position">
                    <Radio.Group>
                      <Radio value="front">前</Radio>
                      <Radio value="end">后</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item label="按钮图标" name="icon">
                    <Space>
                      <Popover
                        content={content}
                        title="icon"
                        visible={btnPopoverVisible}
                        placement="bottom"
                        overlayStyle={{ width: '360px' }}
                      >
                        <Button
                          type="link"
                          style={{ paddingLeft: 0 }}
                          onClick={() => {
                            setBtnPopoverVisible(true);
                          }}
                        >
                          选择图标
                        </Button>
                      </Popover>
                      {icon ? <Icon icon={icon} /> : <></>}
                    </Space>
                  </Form.Item>

                  <Form.Item label="按钮事件" name="method">
                    <TextArea />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                    <Space size={10}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                      <Button htmlType="button" onClick={btnFormReset}>
                        Reset
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Col>
        </Row>

        <Modal
          title="确认保存"
          visible={saveVisible}
          onOk={() => {
            handleOk();
          }}
          onCancel={handleCancel}
          className="default-modal"
          okText="确认"
          cancelText="取消"
          loading={saveLoading}
        >
          <p>是否保存当前表单？</p>
          <Checkbox.Group
            options={config.options}
            defaultValue={['active', 'saveAsTemplate']}
            onChange={(checked) => {
              setCheckBoxValue(checked);
            }}
            value={checkboxValue}
          />
        </Modal>

        {/* 弹框: 预览 */}
        {previewVisible ? (
          <Modal
            visible={previewVisible}
            title="列表预览"
            onCancel={() => setPreviewVisible(false)}
            // onOk={() => {
            //   handlePreviewOk();
            // }}
            width="90%"
            className="table-preview__modal default-modal"
          >
            <TablePreview
              formCode={props.formCode}
              // tableMobanCode={tableMCode}
              // handlePreviewOk={handlePreviewOk}
              column={column}
              showPageTitle={false}
              saveTableData={saveTableData}
            />
          </Modal>
        ) : (
          <></>
        )}

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
    </Spin>
  );
};

export default tableSetting;
