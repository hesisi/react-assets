import {
  Table,
  Button,
  Layout,
  Input,
  Space,
  Tree,
  Tooltip,
  Select,
  Modal,
  Form,
  message,
  Upload,
  Row,
  Col,
} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './index.less';
import React, { useRef, useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import GroupUser from './groupUser';
import localForage from 'localforage';
import { getUUID } from '@/utils/utils';
import { cloneDeep } from 'lodash';
import UserLeftList from '../userLeftList';
import {
  getUserGroupList,
  deleteUserGroup,
  updateGroupInfo,
  addGroup,
} from '@/services/userGroup';

const data = [
  { name: '耐克', id: getUUID() },
  { name: '阿迪达斯', id: getUUID() },
  { name: '李宁', id: getUUID() },
  { name: '贵人鸟', id: getUUID() },
];
const { confirm } = Modal;
export default function IndexPage() {
  const formRef = useRef(null);
  const [groupData, setGroupData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const eidtIdenty = useRef(null);
  const currentId = useRef(null);

  useEffect(async () => {
    // const oldData = await localForage.getItem('userGroup');
    // if (!oldData) {
    //   setGroupData(data);
    //   localForage.setItem('userGroup', data);
    // } else {
    //   setGroupData(oldData);
    // }
    fechGroupList();
  }, []);

  const fechGroupList = async () => {
    const groupData = await getUserGroupList();
    setGroupData(groupData?.data?.data || []);
  };

  /* 添加分组 */
  const handleAddGroup = () => {
    eidtIdenty.current = false;
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then(async (values) => {
        let oldSource = cloneDeep(groupData);
        let NewItem = {};
        let updatResult = null;
        let addResult = null;
        if (eidtIdenty.current) {
          oldSource = oldSource.map((item) => {
            if (item.id === currentId.current) {
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
          updatResult = await updateGroupInfo(NewItem);
        } else {
          const userItem = {
            ...values,
            // id: getUUID(),
          };
          // oldSource.push(userItem);
          addResult = await addGroup([userItem]);
        }
        // setGroupData(oldSource);
        // localForage.setItem('userGroup', oldSource);

        //  if (eidtIdenty.current) {
        //   setGroupId(null);
        //   setGroupId({ ...oldItem, ...values });
        // }
        if (
          (eidtIdenty.current && updatResult?.data?.isSuccess !== -1) ||
          (!eidtIdenty.current && addResult?.data?.isSuccess !== -1)
        ) {
          message.success(eidtIdenty.current ? '编辑成功' : '添加成功');
          currentId.current = null;
          eidtIdenty.current = false;
          setFormData({
            name: '',
          });
          setIsModalVisible(false);
          fechGroupList();
        }
      })
      .catch((reason) => {
        message.warning('请检查');
      });
  };

  const handleEdit = async (e, id) => {
    e && e.stopPropagation();
    currentId.current = id;
    eidtIdenty.current = true;
    const currentUser = cloneDeep(groupData).filter((item) => item.id === id);
    if (currentUser?.[0]) {
      setFormData({ ...currentUser?.[0] });
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (e, idArr = []) => {
    e && e.stopPropagation();
    confirm({
      title: '确认删除吗',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const deleteResult = await deleteUserGroup(idArr.join());
        // const currentUser = cloneDeep(groupData).filter(
        //   (item) => !idArr.includes(item.id),
        // );
        // setGroupData(currentUser);
        // localForage.setItem('userGroup', currentUser);
        if (deleteResult?.data?.isSuccess !== -1) {
          message.success('删除成功');
          await fechGroupList();
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

  const handleGroupClick = (item) => {
    setGroupId(0);
    setTimeout(() => {
      setGroupId(item.id);
    }, 0);
  };

  return (
    <div
      style={{
        height: '100%',
        padding: '0 20px 20px 20px',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Layout className={'user-cont list-layout account-group'}>
        <Sider className={'user-sider'} width={300}>
          <UserLeftList
            data={groupData}
            handleGroupClick={handleGroupClick}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAddGroup={handleAddGroup}
            groupId={groupId}
          />
        </Sider>
        <Content style={{ paddingLeft: 10 }}>
          {/* 用户列表 */}
          <GroupUser groupId={groupId} groupData={groupData} />
          {/* 分组弹框 */}
          {/* 新建用户、选择用户弹框 */}
          <Modal
            title={eidtIdenty.current ? '编辑分组' : '新增分组'}
            width={520}
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
                    // layout="vertical"
                    wrapperCol={{ span: 22 }}
                  >
                    <Row>
                      <Col span={20}>
                        <Form.Item
                          label="分组名称"
                          name="name"
                          rules={[
                            { required: true, message: '请输入分组名称!' },
                          ]}
                        >
                          <Input placeholder={'请输入分组名称'} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </div>
          </Modal>
        </Content>
      </Layout>
    </div>
  );
}
