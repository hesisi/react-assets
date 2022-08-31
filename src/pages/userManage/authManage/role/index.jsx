import { Layout, Input, Modal, Form, Row, Col, Tabs, message } from 'antd';
import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
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

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

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
  const [systemData, setSystemData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
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
    const oldData = await localForage.getItem('userSystem');
    if (!oldData) {
      setSystemData(data);
      localForage.setItem('userSystem', data);
    } else {
      setSystemData(oldData);
    }
  }, []);

  const onChange = () => {};

  const handleGroupClick = (id) => {
    setGroupId(id);
  };

  const handleEdit = async (id) => {
    currentId.current = id;
    eidtIdenty.current = true;
    const currentUser = cloneDeep(systemData).filter((item) => item.id === id);
    if (currentUser?.[0]) {
      setFormData({ ...currentUser?.[0] });
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (idArr = []) => {
    const currentUser = cloneDeep(systemData).filter(
      (item) => !idArr.includes(item.id),
    );
    setSystemData(currentUser);
    localForage.setItem('userSystem', currentUser);
    message.success('删除成功');
  };

  /* 添加分组 */
  const handleAddGroup = () => {
    eidtIdenty.current = false;
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        let oldSource = cloneDeep(systemData);
        if (eidtIdenty.current) {
          oldSource = oldSource.map((item) => {
            if (item.id === currentId.current) {
              return {
                ...item,
                ...values,
              };
            }
            return item;
          });
        } else {
          const userItem = {
            ...values,
            id: getUUID(),
          };
          oldSource.push(userItem);
        }
        setSystemData(oldSource);
        localForage.setItem('userSystem', oldSource);
        message.success(eidtIdenty.current ? '编辑成功' : '添加成功');
        currentId.current = null;
        eidtIdenty.current = false;
        setFormData({
          name: '',
        });
        setIsModalVisible(false);
      })
      .catch((reason) => {
        console.log(reason, '135----');
        message.warning('请检查');
      });
  };

  return (
    <div style={{ height: '100%', padding: 20, backgroundColor: '#f0f2f5' }}>
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
            <Tabs
              defaultActiveKey="1"
              onChange={onChange}
              className="role-tabs"
            >
              <TabPane tab="角色信息" key="1">
                <RoleInfo />
              </TabPane>
              <TabPane tab="角色用户" key="2">
                <RoleUser />
              </TabPane>
              <TabPane tab="功能权限" key="3">
                <RoleFunction />
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
      {/* 分组弹框 */}
      {/* 新建用户、选择用户弹框 */}
      <Modal
        title={eidtIdenty.current ? '编辑角色' : '新增角色'}
        width={620}
        visible={isModalVisible}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={() => {
          currentId.current = null;
          eidtIdenty.current = false;
          setFormData({
            name: '',
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
                layout="vertical"
                wrapperCol={{ span: 22 }}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="角色名称"
                      name="name"
                      rules={[{ required: true, message: '请输入角色名称!' }]}
                    >
                      <Input placeholder={'请输入角色名称'} />
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
