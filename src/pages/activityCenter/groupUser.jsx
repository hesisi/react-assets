import { Table, Button, Input, Space, Modal, message, Tabs } from 'antd';
import {
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  BarsOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import TableHeader from '@/components/tableHeader';
import localForage from 'localforage';
import { PreviewWidget } from '@/pages/Desinger/widgets';
import { transformToTreeNode } from '@designable/formily-transformer';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import TablePreview from './tablePreview';
import { temp } from './temple';

const { TabPane } = Tabs;
export default function GroupUser({
  groupId = ['shouye'],
  childFormCode = {},
}) {
  const tableRef = useRef(null);
  const formRef = useRef(null);
  const formRefS = useRef(null);
  const currentGroupId = useRef(null);
  const currentFormCode = useRef(null);
  // const [showFormTable, setShowFormTable] = useState(false);
  const originSource = useRef(null);
  const curentClickItem = useRef(null);
  const [activeIdenty, setActiveIdenty] = useState('新建');
  const [activeKey, setActiveKey] = useState('1');
  const [dataSource, setDataSource] = useState([]);
  const [dataToDoSource, setTodoSource] = useState([]);
  const [dataDoneSource, setDataDoneSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUserRowKeys, setSelectedUserRowKeys] = useState([]);
  const [formTree, setFormTree] = useState(null);
  const [formCode, setFormCode] = useState(null);
  const [formTreeShenpi, setFormTreeShenpi] = useState(null);
  const [totalData, setTotalData] = useState({
    created: 0,
    toDo: 0,
    done: 0,
  });

  const columns = [
    {
      title: '申请单号',
      dataIndex: 'oddNumbers',
      key: 'oddNumbers',
    },
    {
      title: '申请人',
      dataIndex: 'applyPeople',
      key: 'applyPeople',
    },
    {
      title: '流程节点',
      dataIndex: 'applyNode',
      key: 'applyNode',
    },
    {
      title: '类型',
      dataIndex: 'groupType',
      key: 'groupType',
    },
    // {
    //   title: '开始日期',
    //   dataIndex: 'startTime',
    //   key: 'startTime',
    // },
    // {
    //   title: '结束日期',
    //   dataIndex: 'endTime',
    //   key: 'endTime',
    // },
    // {
    //   title: '请假天数',
    //   dataIndex: 'applyDays',
    //   key: 'applyDays',
    // },
  ];

  const getCreateForm = () => {
    const targetFormCode = childFormCode.targetForm;
    currentFormCode.current = targetFormCode;
    const formData = localStorage.getItem('formMap')
      ? JSON.parse(localStorage.getItem('formMap'))
      : {};
    const formilyData = formData[targetFormCode];
    setFormCode(targetFormCode || null);
    return formilyData;
  };

  const getShenpiForm = () => {
    const targetFormCode = childFormCode.approverGroup[0].approverForm;
    const formData = JSON.parse(localStorage.getItem('formMap') || {});
    const formilyData = formData[targetFormCode];
    /* 假数据 暂定取formMap的最后一条数据 需要在表单管理新建审批表单并保证新建的审批表单是最新创建的*/
    return formilyData;
  };

  /* 初始化 */
  useEffect(async () => {
    let tableSource = await localForage.getItem('flowCreateMap');

    console.log(childFormCode, '109-----');
    if (childFormCode) {
      if (groupId?.[0] !== 'shouye') {
        const formilyData = getCreateForm();
        if (formilyData) {
          setFormTree(transformToTreeNode(formilyData['formily-form-schema']));
        }
        setActiveKey('1');
        // setShowFormTable(childFormCode?.targetForm);
      }
    } else {
      if (!groupId || groupId?.[0] === 'shouye') {
        const totalTableSource = Object.values(tableSource || []);
        const totoalNum = [0, 0, 0];
        const totoalSource = [[], [], []];
        totalTableSource.forEach((item) => {
          totoalNum[0] += item?.created?.length || 0;
          totoalNum[1] += item?.toDo?.length || 0;
          totoalNum[2] += item?.done?.length || 0;
          totoalSource[0] = totoalSource[0].concat(item?.created || []);
          totoalSource[1] = totoalSource[1].concat(item?.toDo || []);
          totoalSource[2] = totoalSource[2].concat(item?.done || []);
        });
        setTotalData({
          created: totoalNum[0],
          toDo: totoalNum[1],
          done: totoalNum[2],
        });
        originSource.current = totoalSource[0];
        setDataSource(totoalSource[0]);
        setTodoSource(totoalSource[1]);
        setDataDoneSource(totoalSource[2]);
        setActiveKey('1');
        // setShowFormTable(false);
      }
    }
  }, [groupId, childFormCode]);

  /* 用户添加， 选择用户 */
  const handleAccountAdd = async () => {
    if (!childFormCode) {
      message.error('请先选择流程');
      return;
    }
    const formilyData = getCreateForm();
    if (formilyData?.['formily-form-schema']) {
      setFormTree(transformToTreeNode(formilyData['formily-form-schema']));
    }
    setActiveIdenty('新建');
    setIsModalVisible(true);
    setTimeout(() => {
      handleAddFormAuthority();
    }, 0);
  };

  const authorityRuleControl = (ruleItems = [], formDom = null) => {
    const formItemSettingDisTrue = [];
    const formItemSettingDisFalse = [];
    const formItemSettingVisFalse = [];
    ruleItems.forEach((item) => {
      if (item.edit === 'readOnly') {
        formItemSettingDisTrue.push(item.name);
      }
      if (item.edit === 'edit') {
        // 编辑
        formItemSettingDisFalse.push(item.name);
      }
      if (item.edit === 'hide') {
        // 隐藏
        formItemSettingVisFalse.push(item.name);
      }
    });
    if (formDom) {
      formItemSettingDisTrue.forEach((item) => {
        formDom.setFieldState(`${item}`, (state) => {
          state.disabled = true;
        });
      });
      formItemSettingDisFalse.forEach((item) => {
        formDom.setFieldState(`${item}`, (state) => {
          state.disabled = false;
        });
      });
      formItemSettingVisFalse.forEach((item) => {
        formDom.setFieldState(`${item}`, (state) => {
          state.visible = false;
        });
      });
    }
  };

  /* 申请表单显隐控制 */
  const handleAddFormAuthority = () => {
    const form = formRef?.current?.form;
    const formSetting = childFormCode?.targetFormSet?.formField || [];
    if (form) {
      /* 控制formItem 的显示隐藏 */
      if (!formSetting?.length) {
        const unVisible = ['oddNumbers', 'applyNode'];
        unVisible.forEach((item) => {
          form.setFieldState(`${item}`, (state) => {
            state.visible = false;
          });
        });
        return;
      }
      authorityRuleControl(formSetting, form);
    }
  };

  const handleShenPi = (item) => {
    // curentClickItem.current = item;
    const formilyData = getShenpiForm();
    if (formilyData) {
      setFormTreeShenpi(
        transformToTreeNode(formilyData['formily-form-schema']),
      );
    }
    setActiveIdenty('审批');
    setIsModalVisible(true);
    setTimeout(() => {
      const form = formRef?.current?.form;
      if (form) {
        form.setValues({
          ...item,
        });

        form.setPattern('disabled');

        /* 控制formItem 的显示隐藏 */
        if (Object.keys(item)?.length) {
          Object.keys(item).forEach((itemK) => {
            form.setFieldState(`${itemK}`, (state) => {
              // state.visible = false;
              state.disabled = true;
            });
          });
        }
      }
    }, 0);
    setTimeout(() => {
      /* 控制审批人的显隐 */
      handleShenPiFormAuthority(item);
    }, 0);
  };

  const handleShenPiFormAuthority = (item) => {
    const formS = formRefS?.current?.form;
    const formSetting =
      childFormCode?.approverGroup?.[0]?.formSetting?.formField || [];
    if (formS) {
      formS.setValues({
        approvePeople:
          item?.applyNode ||
          childFormCode?.approverGroup?.[0]?.approver?.name ||
          '张总',
      });
      authorityRuleControl(formSetting, formS);
    }
  };

  // 确认添加
  const handleOk = async () => {
    const form = formRef.current.form;
    form.validate().then(async () => {
      if (activeKey === '2') {
        if (tableRef && tableRef.current) {
          console.log(tableRef.current, '291----');
          tableRef.current.formOk(form.values);
        }
        message.success('审批成功');
        setIsModalVisible(false);
        return;
      }

      if (tableRef && tableRef.current) {
        console.log(tableRef.current, '291----');
        tableRef.current.formOk(form.values);
      }
      // 表单提交
      message.success('添加成功');
      setActiveKey('1');
      setIsModalVisible(false);
    });
  };

  const onTabChange = async (key) => {
    if (groupId && groupId[0] === 'shouye') {
      setActiveKey(key);
      if (key === '1') {
        setDataSource(cloneDeep(originSource?.current || []));
        return;
      }
      if (key === '2') {
        setDataSource(cloneDeep(dataToDoSource || []));
        return;
      }
      if (key === '3') {
        setDataSource(cloneDeep(dataDoneSource || []));
        return;
      }
    } else {
      if (tableRef && tableRef.current) {
        tableRef.current.tabChange(key);
      }
      setActiveKey(key);
    }
  };

  return (
    <div className="right-cont" style={{ overflow: 'auto' }}>
      <div style={{ padding: 10 }}>
        {/* table header */}
        {groupId ? (
          groupId[0] === 'shouye' ? (
            <div className="list-category">
              <div className="list-category-item">
                <div className="img-wrapper" style={{ color: '#0d6bff' }}>
                  <PlusCircleOutlined />
                </div>
                <p>创建流程</p>
                <p>{totalData.created}</p>
              </div>
              <div className="list-category-item">
                <div className="img-wrapper" style={{ color: '#faad14' }}>
                  <BarsOutlined />
                </div>
                <p>待办流程</p>
                <p>{totalData.toDo}</p>
              </div>
              <div className="list-category-item">
                <div className="img-wrapper" style={{ color: '#47ac16' }}>
                  <CheckCircleOutlined />
                </div>
                <p>已办流程</p>
                <p>{totalData.done}</p>
              </div>
            </div>
          ) : childFormCode ? (
            <TableHeader
              formData={{
                formButton: {
                  showButton: true,
                  ButtonStructure: [
                    {
                      itemDom: () => {
                        return (
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAccountAdd()}
                          >
                            新建
                          </Button>
                        );
                      },
                    },
                  ],
                },
                operateStructure: [<Input placeholder="请输入用户名" />],
              }}
            />
          ) : null
        ) : null}
        {(groupId && groupId[0] !== 'shouye' && !childFormCode) || !groupId ? (
          !groupId ? (
            <div> 暂无数据</div>
          ) : (
            <div>请选择一个流程</div>
          )
        ) : (
          <>
            <Tabs
              defaultActiveKey="1"
              activeKey={activeKey}
              onChange={onTabChange}
            >
              <TabPane tab="我发起的" key="1" />
              <TabPane tab="我的待办" key="2" />
              <TabPane tab="我的已办" key="3" />
            </Tabs>
            {/* table */}
            {groupId && groupId[0] === 'shouye' ? (
              <Table
                // rowSelection={{
                //   type: 'checkbox',
                //   ...rowSelection,
                // }}
                style={{ marginTop: 20 }}
                dataSource={dataSource}
                columns={columns}
                // loading={loading}
                scroll={{ y: 400 }}
                pagination={{
                  total: dataSource?.length || 0,
                  showSizeChanger: true,
                  // onChange: handlePageChange,
                }}
                rowKey={(record) => record.id}
              />
            ) : null}

            {groupId && groupId[0] !== 'shouye' && childFormCode && formCode ? (
              <TablePreview
                ref={tableRef}
                handleShenPiP={handleShenPi}
                childFormCode={childFormCode}
                activeKey={activeKey}
                formCode={formCode}
                showOperate={false}
                showTableHeader={false}
                showPageTitle={false}
                tablePreviewClassName="flowCenterTablePrew"
              />
            ) : null}
          </>
        )}

        {/* 选择用户弹框 */}
        <Modal
          title={activeIdenty === '新建' ? '新建流程' : '审批'}
          destroyOnClose={true}
          width={620}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => {
            setIsModalVisible(false);
          }}
          className="default-modal"
          cancelText="取消"
          okText={activeIdenty === '新建' ? '确认' : '通过'}
        >
          <div className="user-wrapper">
            {activeIdenty !== '新建' ? (
              <div className="shenqingren">申请信息:</div>
            ) : null}
            <PreviewWidget key="formS" tree={formTree} ref={formRef} />

            {activeIdenty !== '新建' ? (
              <>
                <div className="shenqingren">审批:</div>
                <PreviewWidget
                  key="formSh"
                  tree={formTreeShenpi}
                  ref={formRefS}
                />
              </>
            ) : null}
          </div>
        </Modal>
      </div>
    </div>
  );
}
