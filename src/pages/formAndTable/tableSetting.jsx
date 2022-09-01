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

  const tableEcho = (formInit, columnsInit) => {
    const tableConfig = columnsInit?.tableConfig;
    const columns = columnsInit?.columns;
    const buttons = columnsInit?.buttonConfig;
    // if (JSON.stringify(formInit) !== JSON.stringify(tableConfig)) {
    const arr = [...formInit];
    console.log('===echo', formInit, tableConfig);

    formInit.forEach((item, index) => {
      tableConfig.forEach((e, i) => {
        if (e && e.id === item.id) {
          const { filterEnable, isShow, sorter, searchEnable, ...others } =
            item;
          arr[index] = {
            ...e,
            ...others,
          };
        }
      });
    });

    let colsArr = [];
    let max = columns.length - 1;
    for (let i = 0; i < arr.length; i++) {
      // for (let j = 0; j< columns.length;j++) {
      const index = columns.findIndex((e) => e.key === arr[i].id);
      if (index !== -1) {
        colsArr[index] = arr[i];
      } else {
        max++;
        colsArr[max] = arr[i];
      }
      //  else {
      //   colsArr[count] = arr[i];
      // }
      //  else {
      //   // colsArr[count] = arr[i];
      //   // colsArr[columns.length] = arr[i];
      // }
      // }
    }
    // console.log('最大', max);

    console.log('更新后', arr, colsArr);

    // if (columns === arr.length) {
    //   for (let i = 0; i < columns.length; i++) {
    //     for (let j = 0; j < arr.length; j++) {
    //       if (
    //         columns[i].dataIndex === arr[j].name ||
    //         columns[i].dataIndex === arr[j].id
    //       ) {
    //         colsArr.push({ ...arr[j], ...columns[i] });
    //       }
    //     }
    //   }
    // } else {
    //   // TODO:会造成拖动的顺序被还原，暂未想到解决方案
    //   colsArr = arr;
    // }

    setTable(colsArr);
    setButtons(buttons);

    // }
  };

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
    // let colsArr = [];
    // if (columnInit) {
    //   for (let i = 0; i < columnInit.length; i++) {
    //     for (let j = 0; j < tableShow.length; j++) {
    //       if (columnInit[i].dataIndex === tableShow[j].name) {
    //         colsArr.push(tableShow[j]);
    //       }
    //     }
    //   }
    // } else {
    //   colsArr = tableShow;
    // }

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

  // 根据formCode获取存在localStorage的table
  const tableDataFetch = () => {
    const formColumn = JSON.parse(window.localStorage.getItem('formMap'));
    if (!formColumn) return;
    const formItemObj = formColumn[props.formCode]['formily-form-schema'];
    if (formItemObj) {
      setFormTree(transformToTreeNode(formItemObj));
    }

    let data = [];
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
    const objSetFunc = (data, arr) => {
      for (let key in data) {
        if (data[key].properties) {
          // 存在外层布局的时候
          for (let k in data[key].properties) {
            arr.push({
              ...data[key].properties[k],
              name:
                data[key].properties[k].name || data[key]['x-designable-id'], // name对应的属性名
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
    objSetFunc(properties, formItem);

    setTable(formItem);
    setColumnCount(formItem.length);

    const formList = JSON.parse(window.localStorage.getItem('formList'));
    const formTree = formList.filter((e) => e.formCode === props.formCode)[0];
    const children = formItem.map((e) => {
      return {
        title: e.title || e.name,
        key: e.id,
      };
    });
    setTableCol(formItem);

    if (!formTree) return;
    const tree = [
      {
        title: `${formTree.formName}    （${children.length}）`,
        key: formTree.formCode,
        children: children,
      },
    ];
    setTreeData(tree);

    setUrl(
      `${window.location.protocol}//${window.location.host}/formManage/formPreview/table?formCode=${props.formCode}`,
    );

    // 如果有值回显
    const tableConfig = window.localStorage.getItem('tableConfig');
    const arr = tableConfig && JSON.parse(tableConfig);
    if (arr && arr[props.formCode]) {
      tableEcho(formItem, arr[props.formCode]);
    }
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
        console.log('button操作', e);
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
    console.log('列表配置的下拉框改变的时候', tables);
    setTable(tables);
  };

  // 列表配置保存
  const handleOk = () => {
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
    setSaveVisible(false);

    if (checkboxValue.includes('active')) {
      const formList = JSON.parse(window.localStorage.getItem('formList'))?.map(
        (e) => {
          if (e.formCode === props.formCode) {
            e.formStatus = 'enable';
            e.formUrl = url;
          }
          return e;
        },
      );
      window.localStorage.setItem('formList', JSON.stringify(formList));
    }
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

  // 查看
  const previewHandler = () => {
    handleOk();
    setPreviewVisible(true);
  };

  // 复制url
  const copyUrl = () => {
    handleOk();
    copy(url);
    message.success('复制成功');
  };

  const generateHandler = () => {
    setUrlVisible(true);
    const formList = JSON.parse(window.localStorage.getItem('formList'))?.map(
      (e) => {
        if (e.formCode === props.formCode) {
          e.formUrl = url;
        }
        return e;
      },
    );
    window.localStorage.setItem('formList', JSON.stringify(formList));
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

          <Table
            columns={column}
            dataSource={dataSource}
            pagination={{ position: ['none', 'none'] }}
            style={{ marginTop: '20px' }}
            rowKey={(record) => record.id}
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
                    console.log('操作面板', e);
                    return (
                      <Panel header={e.label} key={e.id}>
                        <Form initialValues={config.columnInit}>
                          <Form.Item label="在列表显示" name="isShow">
                            <Select
                              onChange={(ele) => selectChange(e, ele, 'isShow')}
                              value={e.isShow}
                            >
                              {config.selectList.isShow.map((e) => {
                                return (
                                  <Select.Option value={e.value} key={e.value}>
                                    {e.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>

                          <Form.Item label="是否可排序" name="sorter">
                            <Select
                              onChange={(ele) => selectChange(e, ele, 'sorter')}
                              value={e.sorter}
                            >
                              {config.selectList.sortEnable.map((e) => {
                                return (
                                  <Select.Option value={e.value} key={e.value}>
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
                                  <Select.Option value={e.value} key={e.value}>
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
                                  <Select.Option value={e.value} key={e.value}>
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
          message.success('保存成功');
        }}
        onCancel={handleCancel}
        className="default-modal"
        okText="确认"
        cancelText="取消"
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
          width="90%"
          className="table-preview__modal default-modal"
        >
          <TablePreview formCode={props.formCode} showPageTitle={false} />
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
  );
};

export default tableSetting;
