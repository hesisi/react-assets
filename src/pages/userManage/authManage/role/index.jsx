import { Layout, Input, Modal, Form, Row, Col, Tabs, message } from 'antd';
import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import { getUUID } from '@/utils/utils';
import localForage from 'localforage';
import { cloneDeep } from 'lodash';

import RoleInfo from './roleInfo';
import RoleUser from './roleUser';
import RoleFunction from './roleFunction';
import UserLeftList from '../userLeftList';

import {
  getRoleList,
  updateRoleInfo,
  addRole,
  deleteRole,
} from '@/services/userManager';
const { TextArea } = Input;
const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const { confirm } = Modal;
const data = [
  { id: getUUID(), name: '超级管理员' },
  { id: getUUID(), name: '标注员' },
  { id: getUUID(), name: '耐克用户' },
  { id: getUUID(), name: '阿迪达斯用户' },
  { id: getUUID(), name: 'BMW用户' },
];
export default function IndexPage() {
  const formRef = useRef(null);
  const eidtIdenty = useRef(null);
  const currentId = useRef(null);
  const userTree = useRef(null);
  const [systemData, setSystemData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [groupItem, setGroupItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
  });
  const List = (props) => {
    const { data } = props;
    return (
      <div className={'list-cont'}>
        <div className={'header-u'}>
          <h3 className={'title'}>系统角色</h3>
          <InfoCircleOutlined />
          <a style={{ color: '#85BD25', marginLeft: 'auto' }}>
            <PlusCircleOutlined />
          </a>
        </div>
        {data.map((x) => (
          <div className={'list-item'} key={x.name}>
            {x.label}
            <FormOutlined />
            <DeleteOutlined />
          </div>
        ))}
      </div>
    );
  };

  useEffect(async () => {
    fechRoleList();
    // const oldData = await localForage.getItem('userSystem');
    // if (!oldData) {
    //   const sysItem = {};
    //   data.forEach((item) => {
    //     sysItem[item.id] = {
    //       ...item,
    //       roleDescrib: '',
    //       roleUser: [],
    //       roleFunction: [],
    //     };
    //   });
    //   localForage.setItem('userSystemInfo', sysItem);
    //   localForage.setItem('userSystem', data);
    //   setSystemData(data);
    // } else {
    //   // const sysItem = {};
    //   // oldData.forEach((item) => {
    //   //   sysItem[item.id] = {
    //   //     ...item,
    //   //     roleDescrib: '',
    //   //     roleUser: [],
    //   //     roleFunction: [],
    //   //   };
    //   // });
    //   // localForage.setItem('userSystemInfo', sysItem);
    //   setSystemData(oldData);
    // }
  }, []);

  const fechRoleList = async () => {
    const roleData = await getRoleList();
    setSystemData(roleData?.data?.data || []);
    console.log(roleData);
  };

  const onChange = () => {};

  /* 初始人员数据 */
  const initUserData = async () => {
    const initUserData = await localForage.getItem('groupUserList');
    const userGroup = await localForage.getItem('userGroup');
    const peopleInitData = [];
    userGroup.forEach((item) => {
      const childData = {
        ...item,
        title: item.name,
        key: item.id,
      };
      if (initUserData?.[item.id]?.length) {
        childData['children'] = initUserData?.[item.id].map((item) => {
          return {
            ...item,
            title: item.name,
            key: item.id,
          };
        });
      }
      peopleInitData.push(childData);
    });
    localStorage.setItem('userTreeData', JSON.stringify(peopleInitData));
  };

  const handleGroupClick = (item) => {
    initUserData();
    setGroupItem(item);
    setGroupId(item.id);
  };

  const handleEdit = async (e, id) => {
    e && e.stopPropagation();
    currentId.current = id;
    eidtIdenty.current = true;
    const currentUser = cloneDeep(systemData).filter((item) => item.id === id);
    if (currentUser?.[0]) {
      setFormData({ ...currentUser?.[0] });
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (e, idArr = []) => {
    e && e.stopPropagation();
    confirm({
      title: '确认删除该项吗',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const deleteResult = await deleteRole(idArr.join());
        // const currentUser = cloneDeep(systemData).filter(
        //   (item) => !idArr.includes(item.id),
        // );
        // let oldData = await localForage.getItem('userSystemInfo');
        // idArr.forEach((idItem) => {
        //   if (oldData?.idItem) {
        //     delete oldData.idItem;
        //   }
        // });
        // setSystemData(currentUser);
        // localForage.setItem('userSystemInfo', oldData);
        // localForage.setItem('userSystem', currentUser);

        if (deleteResult?.data?.isSuccess !== -1) {
          message.success('删除成功');
          await fechRoleList();
          if (idArr.join() === groupId) {
            setTimeout(() => {
              setGroupId(null);
            }, 0);
          }
        }
      },
      onCancel() {},
    });
  };

  /* 添加分组 */
  const handleAddGroup = () => {
    eidtIdenty.current = false;
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    formRef.current
      .validateFields()
      .then(async (values) => {
        let oldSource = cloneDeep(systemData);
        const sysItem = await localForage.getItem('userSystemInfo');
        let oldItem = {};
        let NewItem = {};
        let updatResult = null;
        let addResult = null;
        if (eidtIdenty.current) {
          oldSource = oldSource.map((item) => {
            if (item.id === currentId.current) {
              oldItem = item;
              NewItem = {
                ...item,
                ...values,
              };
              return {
                ...item,
                ...values,
              };
            }
            return item;
          });
          updatResult = await updateRoleInfo(NewItem);
          // sysItem[currentId.current].name = values.name;
        } else {
          const userItem = {
            ...values,
            // id: getUUID(),
          };
          // oldSource.push(userItem);
          // sysItem[userItem.id] = {
          //   id: userItem.id,
          //   name: values.name,
          //   roleDescrib: '',
          //   roleUser: [],
          //   roleFunction: [],
          // };
          addResult = await addRole(userItem);
        }
        // setSystemData(oldSource);
        // localForage.setItem('userSystemInfo', sysItem);
        // localForage.setItem('userSystem', oldSource);

        if (
          (eidtIdenty.current && updatResult?.data?.isSuccess !== -1) ||
          (!eidtIdenty.current && addResult?.data?.isSuccess !== -1)
        ) {
          message.success(eidtIdenty.current ? '编辑成功' : '添加成功');
          if (eidtIdenty.current) {
            setGroupItem(null);
            setGroupItem({ ...oldItem, ...values });
          }
          currentId.current = null;
          eidtIdenty.current = false;
          setFormData({
            name: '',
            desc: '',
          });
          setIsModalVisible(false);
          fechRoleList();
        }
      })
      .catch((reason) => {
        message.warning('请检查');
      });
  };

  const editItemHandle = (newItem = {}) => {
    fechRoleList();
    // let oldSource = cloneDeep(systemData);
    // oldSource = oldSource.map((item) => {
    //   if (item.id === newItem.id) {
    //     return newItem;
    //   }
    //   return item;
    // });
    // setSystemData(oldSource);
    // localForage.setItem('userSystem', oldSource);
  };
  return (
    <div
      style={{
        height: '100%',
        padding: '0 20px 20px 20px',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Layout className={'user-cont list-layout'}>
        <Sider className={'user-sider'} width={300}>
          <UserLeftList
            data={systemData}
            handleGroupClick={handleGroupClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAddGroup={handleAddGroup}
            groupId={groupId}
            title="系统角色"
          />
        </Sider>
        <Content style={{ paddingLeft: 10 }}>
          <div className="right-cont">
            {/* tabs show */}
            {groupId ? (
              <Tabs
                defaultActiveKey="1"
                onChange={onChange}
                className="role-tabs"
              >
                <TabPane tab="角色信息" key="1">
                  <RoleInfo
                    groupItem={groupItem}
                    editItemHandle={editItemHandle}
                  />
                </TabPane>
                <TabPane tab="角色用户" key="2">
                  <RoleUser
                    groupItem={groupItem}
                    // editItemHandle={editItemHandle}
                  />
                </TabPane>
                <TabPane tab="功能权限" key="3">
                  <RoleFunction
                    groupItem={groupItem}
                    // editItemHandle={editItemHandle}
                  />
                </TabPane>
                <TabPane tab="数据权限" key="4">
                  <div>数据权限</div>
                </TabPane>
              </Tabs>
            ) : (
              <div>请选择一个角色</div>
            )}
          </div>
        </Content>
      </Layout>
      {/* 分组弹框 */}
      {/* 新建用户、选择用户弹框 */}
      <Modal
        title={eidtIdenty.current ? '编辑角色' : '新增角色'}
        width={520}
        visible={isModalVisible}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={() => {
          currentId.current = null;
          eidtIdenty.current = false;
          setFormData({
            name: '',
            desc: '',
          });
          setIsModalVisible(false);
        }}
        className="default-modal"
        cancelText="取消"
        okText="确认"
      >
        <div className="user-wrapper">
          <div className="user-add-wrapper">
            <div className="user-add-content">
              <Form
                ref={formRef}
                initialValues={formData}
                name="basic"
                autoComplete="off"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Row>
                  <Col span={20}>
                    <Form.Item
                      label="角色名称"
                      name="name"
                      rules={[{ required: true, message: '请输入角色名称!' }]}
                    >
                      <Input placeholder={'请输入角色名称'} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={20}>
                    <Form.Item label="角色描述" name="desc" key="desc">
                      <TextArea placeholder="请输入角色描述" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
