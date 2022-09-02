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

const { TabPane } = Tabs;
export default function GroupUser({
  groupId = ['shouye'],
  childFormCode = {},
}) {
  const formRef = useRef(null);
  const formRefS = useRef(null);
  const currentGroupId = useRef(null);
  const currentFormCode = useRef(null);
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
  const [formTreeShenpi, setFormTreeShenpi] = useState(null);
  const [totalData, setTotalData] = useState({
    created: 0,
    toDo: 0,
    done: 0,
  });

  const columns = [
    {
      title: '申请单号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '申请人',
      dataIndex: 'people',
      key: 'people',
    },
    {
      title: '流程节点',
      dataIndex: 'node',
      key: 'node',
      render: (text, record) => {
        return activeKey === '2' ? (
          <a onClick={() => handleShenPi(record)} style={{ cursor: 'pointer' }}>
            {text}
          </a>
        ) : (
          text
        );
      },
    },
    {
      title: '休假类型',
      dataIndex: 'leaveCategory',
      key: 'leaveCategory',
    },
    {
      title: '开始日期',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束日期',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '请假天数',
      dataIndex: 'leaveDays',
      key: 'leaveDays',
    },
  ];

  const getCreateForm = () => {
    const targetFormCode = childFormCode.targetForm;
    currentFormCode.current = targetFormCode;
    const formData = JSON.parse(localStorage.getItem('formMap') || []);
    const formilyData = formData[targetFormCode];
    return formilyData;
  };

  const getShenpiForm = () => {
    const formData = JSON.parse(localStorage.getItem('formMap') || {});
    /* 假数据 暂定取formMap的最后一条数据 需要在表单管理新建审批表单并保证新建的审批表单是最新创建的*/
    return Object.values(formData)?.[Object.values(formData).length - 1];
  };

  /* 初始化 */
  useEffect(async () => {
    let tableSource = await localForage.getItem('flowCreateMap');

    if (childFormCode) {
      if (groupId?.[0] !== 'shouye') {
        const formilyData = getCreateForm();
        originSource.current =
          tableSource?.[childFormCode.id]?.['created'] || [];
        setDataSource(tableSource?.[childFormCode.id]?.['created'] || []);
        setTodoSource(tableSource?.[childFormCode.id]?.['toDo'] || []);
        setDataDoneSource(tableSource?.[childFormCode.id]?.['done'] || []);

        if (!tableSource) {
          tableSource = {};
        }
        if (!tableSource?.[childFormCode.id]) {
          tableSource[childFormCode.id] = {};
        }
        tableSource[childFormCode.id]['toDo'] = [
          {
            id: nanoid(),
            number: 1,
            people: '李四',
            node: '审批人1',
            leaveCategory: '年假',
            startTime: moment().format('YYYY-MM-DD'),
            endTime: moment().add(7, 'days').format('YYYY-MM-DD'),
            leaveDays: 3,
          },
        ];
        localForage.setItem('flowCreateMap', tableSource);
        if (formilyData) {
          setFormTree(transformToTreeNode(formilyData['formily-form-schema']));
        }
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
      }
    }
  }, [groupId, childFormCode]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const rowUserSelection = {
    selectedUserRowKeys,
    onChange: setSelectedUserRowKeys,
  };

  /* 用户添加， 选择用户 */
  const handleAccountAdd = async () => {
    if (!childFormCode) {
      message.error('请先选择流程');
      return;
    }
    const formilyData = getCreateForm();
    setFormTree(transformToTreeNode(formilyData['formily-form-schema']));
    setActiveIdenty('新建');
    setIsModalVisible(true);
  };

  const handleShenPi = (item) => {
    curentClickItem.current = item;
    const formilyData = getShenpiForm();
    setFormTreeShenpi(transformToTreeNode(formilyData['formily-form-schema']));
    setActiveIdenty('审批');
    setIsModalVisible(true);
    setTimeout(() => {
      const form = formRef?.current?.form;
      // const formRefS = formRefS?.current?.form;
      if (form) {
        form.setValues(item);
      }
      // if (formRefS) {
      //   form.setValues();
      // }
    }, 0);
  };

  // 确认添加
  const handleOk = async () => {
    const form = formRef.current.form;
    form.validate().then(async () => {
      let originData = await localForage.getItem('flowCreateMap');
      originData = cloneDeep(originData || {});
      console.log(originData, '2199----');
      if (!originData[childFormCode.id]) {
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
      if (!Array.isArray(originData[childFormCode.id]['done'])) {
        originData[childFormCode.id]['done'] = [];
      }
      console.log(originData, '214----');
      if (activeKey === '2') {
        const todoData = cloneDeep(dataToDoSource);
        let piItem = {};
        const arr = [];
        todoData.forEach((item) => {
          if (item.id === curentClickItem.current.id) {
            piItem = item;
          } else {
            arr.push(item);
          }
        });
        console.log(piItem, '223-----');
        console.log(originData, '224----');
        console.log(childFormCode, '225----');
        originData[childFormCode.id]['toDo'] = originData[childFormCode.id][
          'toDo'
        ].filter((item) => item.id !== curentClickItem.current.id);
        console.log(originData, '228----');
        originData[childFormCode.id]['done'] = originData[childFormCode.id][
          'done'
        ].concat([{ ...piItem, node: '结束' }]);
        setTodoSource(arr); // 减一条
        setDataDoneSource(
          cloneDeep(dataDoneSource).concat([{ ...piItem, node: '结束' }]),
        ); // 加一条

        localForage.setItem('flowCreateMap', originData);
        setDataSource(arr);
        message.success('审批成功');
        setIsModalVisible(false);
        return;
      }

      // 表单提交
      let arr = [...dataSource];
      arr.push({
        ...JSON.parse(JSON.stringify(form.values)),
        id: nanoid(),
        node: '开始',
        number: arr.length + 1,
      });

      // const tableDataFq = originData[childFormCode.id] || {};
      // const tableDataFqArr = tableDataFq['created'] || []; // done toDo created

      originData[childFormCode.id]['created'] = arr;
      localForage.setItem('flowCreateMap', originData);
      originSource.current = arr;
      setDataSource(arr);
      message.success('添加成功');
      setActiveKey('1');
      setIsModalVisible(false);
    });
  };

  const handleBatchDelete = () => {
    handleDelete(selectedRowKeys);
  };

  const handleDelete = async (idArr = []) => {
    if (!currentGroupId?.current) {
      message.error('请先选择分组');
      return;
    }
    const initUserData = await localForage.getItem('groupUserList');
    initUserData[currentGroupId.current] = initUserData[
      currentGroupId.current
    ].filter((item) => !idArr.includes(item.id));
    localForage.setItem('groupUserList', initUserData);
    setDataSource(initUserData[currentGroupId.current]);
    message.success('删除成功');
  };

  const onTabChange = async (key) => {
    if (groupId && groupId[0] === 'shouye') {
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
      const tableSource = await localForage.getItem('flowCreateMap');
      if (key === '1') {
        setDataSource(tableSource?.[childFormCode.id]?.['created'] || []);
        setActiveKey(key);
        return;
      }
      if (key === '2') {
        const data = tableSource?.[childFormCode.id]?.['toDo'] || [];
        setTodoSource(data);
        setDataSource(data);
        setActiveKey(key);
        return;
      }
      if (key === '3') {
        console.log(tableSource, '314----');
        const data = tableSource?.[childFormCode.id]?.['done']
          ? Array.isArray(tableSource?.[childFormCode.id]?.['done'])
            ? tableSource?.[childFormCode.id]?.['done']
            : []
          : [];
        setDataDoneSource(data);
        setDataSource(data);
        setActiveKey(key);
        return;
      }
    }
  };

  return (
    <div className="right-cont">
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
            <Tabs defaultActiveKey="1" onChange={onTabChange}>
              <TabPane tab="我发起的" key="1" />
              <TabPane tab="待办" key="2" />
              <TabPane tab="已办" key="3" />
            </Tabs>

            {/* table */}
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
              // pagination={{
              //   total,
              //   showSizeChanger: true,
              //   // showQuickJumper: true,
              //   onChange: handlePageChange,
              // }}
              rowKey={(record) => record.id}
            />
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
                  key="formS"
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
