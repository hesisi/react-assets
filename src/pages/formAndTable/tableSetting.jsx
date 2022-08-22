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
} from 'antd';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;
import {
  SaveOutlined,
  CheckSquareOutlined,
  StopOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import './tableSetting.less';
import { nanoid } from 'nanoid';
import Icon from '@/utils/icon';

const selectList = {
  isShow: [
    { label: '是', value: true },
    { label: '否', value: false },
  ],
  sortEnable: [
    { label: '不可排序', value: false },
    { label: '可排序', value: true },
  ],
  searchEnable: [
    { label: '可搜索', value: true },
    { label: '不可搜索', value: false },
  ],
  filterEnable: [
    { label: '显示', value: true },
    { label: '不显示', value: false },
  ],
};

// 列表配置初始化
const columnInit = {
  isShow: true,
  sortEnable: false,
  searchEnable: true,
  filterEnable: true,
};

// 按钮配置初始化
const buttonInit = {
  id: null,
  label: '',
  icon: null,
  method: '',
  iconName: '',
};

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

  useEffect(() => {
    tableDataFetch(); // 从内存获取表格
  }, []);

  // 根据formCode获取存在localStorage的table
  const tableDataFetch = () => {
    const formColumn = JSON.parse(window.localStorage.getItem('formMap'));
    if (!formColumn) return;
    const formItemObj = formColumn[props.formCode]['formily-form-schema'];
    const properties = formItemObj?.schema?.properties;
    const formItem = [];
    const objSetFunc = (data, arr) => {
      for (let key in data) {
        arr.push({
          ...data[key],
          name: data[key].title || data[key].name,
          label: data[key].title,
          type: data[key]['x-component'],
          rules: [
            {
              required: data[key]?.required || false,
              message: `please input ${data[key].title}`,
            },
          ],
          id: data[key]['x-designable-id'],
          ...columnInit,
        });
      }
    };
    objSetFunc(properties, formItem);
    setTable(formItem);
    setColumnCount(formItem.length);
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
    const col = formItem.map((e) => {
      switch (e.type) {
        default:
          return {
            title: e.label,
            dataIndex: e.name,
            key: e.id,
            sorter: (a, b) => {},
          };
      }
    });
    console.log('===formItem', formItem);

    // 设置表格
    setColumn(indexCol.concat(col));
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
    }
  };

  // 气泡内容
  const iconList = [
    'EditOutlined',
    'FormOutlined',
    'CopyOutlined',
    'ScissorOutlined',
    'DeleteOutlined',
    'SnippetsOutlined',
    'QuestionOutlined',
    'QuestionCircleOutlined',
    'PlusOutlined',
    'PlusCircleOutlined',
    'PauseOutlined',
  ];
  const content = (
    <Space className="button-icon">
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
  );

  // 按钮图标选择
  const selectIcon = (icon) => {
    btnForm.setFieldValue('icon', icon);
    setBtnPopoverVisible(false);
  };

  const selectChange = (ele, e, property) => {
    const tables = table.map((item) => {
      if (ele.id === item.id) {
        item[property] = e;
      }
      return item;
    });
    setTable(tables);
    console.log(tables.map((e) => e.filterEnable));
  };

  return (
    <>
      <Row justify="end" style={{ padding: '10px 15px 10px' }}>
        <Space size={10}>
          <Button icon={<SaveOutlined />} type="primary">
            保存
          </Button>
          <Button icon={<CheckSquareOutlined />} type="primary" ghost>
            启用
          </Button>
          <Button icon={<StopOutlined />} type="primary" ghost>
            停用
          </Button>
          <Button icon={<CloseOutlined />} type="primary" ghost>
            删除
          </Button>
        </Space>
      </Row>

      <Row style={{ height: '100%' }}>
        <Col
          span={4}
          style={{ border: '1px solid #d9d9d9', borderRight: 0 }}
        ></Col>
        <Col
          span={16}
          style={{
            border: '1px solid #d9d9d9',
            borderRight: 0,
            padding: '20px',
          }}
        >
          <Button icon={<SaveOutlined />} type="primary" onClick={buttonAdd}>
            添加按钮
          </Button>

          <Divider />

          {/* button和搜索 */}
          <Row justify="space-between">
            <Col span={19}>
              <Space size={10} wrap>
                <Button icon={<PlusOutlined />} type="primary">
                  新建
                </Button>
                <Button icon={<DeleteOutlined />} type="primary">
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
                          <Button
                            icon={<Icon icon={e.icon} />}
                            type="primary"
                            ghost
                            onClick={() => buttonSelect(e)}
                          >
                            {e.label}
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            ghost
                            onClick={() => buttonSelect(e)}
                          >
                            {e.label}
                          </Button>
                        )}
                      </Tag>
                    );
                  })}
              </Space>
            </Col>

            <Col span={5}>
              <Search
                placeholder="请输入内容"
                style={{
                  width: 200,
                }}
              />
            </Col>
          </Row>

          <Divider />

          <Form form={searchForm} layout="inline">
            {table.map((e) => {
              if (e.filterEnable) {
                return (
                  <Form.Item label={e.label} name={e.name} key={e.id}>
                    <Input />
                  </Form.Item>
                );
              }
              return <div key={e.id}></div>;
            })}
          </Form>

          {/* 表格部分 */}
          <Table
            columns={column}
            dataSource={dataSource}
            pagination={{ position: ['none', 'none'] }}
            style={{ marginTop: '20px' }}
          />
        </Col>
        <Col span={4} style={{ border: '1px solid #d9d9d9', padding: '10px' }}>
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
                      <Panel header={e.name} key={e.id}>
                        <Form initialValues={columnInit}>
                          <Form.Item label="在列表显示" name="isShow">
                            <Select>
                              {selectList.isShow.map((e) => {
                                return (
                                  <Select.Option value={e.value} key={e.value}>
                                    {e.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>

                          <Form.Item label="是否可排序" name="sortEnable">
                            <Select
                              onChange={(ele) =>
                                selectChange(e, ele, 'sortEnable')
                              }
                              value={e.sortEnable}
                            >
                              {selectList.sortEnable.map((e) => {
                                return (
                                  <Select.Option value={e.value} key={e.value}>
                                    {e.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>

                          <Form.Item label="是否可搜索" name="searchEnable">
                            <Select>
                              {selectList.searchEnable.map((e) => {
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
                              {selectList.filterEnable.map((e) => {
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
                initialValues={buttonInit}
                form={btnForm}
                onFinish={(e) => onFinish(e, 'btn')}
              >
                <Form.Item label="按钮文本" name="label">
                  <Input />
                </Form.Item>
                <Form.Item label="按钮图标" name="icon">
                  <Space>
                    <Popover
                      content={content}
                      title="icon"
                      visible={btnPopoverVisible}
                      placement="bottom"
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
                    {btnForm && btnForm.getFieldValue('icon') ? (
                      <Icon icon={btnForm.getFieldValue('icon')} />
                    ) : (
                      <></>
                    )}
                  </Space>

                  {/* {btnForm && btnForm.getFieldValue('icon') ? (
                    <Icon icon={btnForm.getFieldValue('icon')} />
                  ) : (
                  )} */}
                </Form.Item>
                <Form.Item label="按钮事件" name="method">
                  <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                  <Space size={10}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => btnForm.current.resetFields()}
                    >
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default tableSetting;
