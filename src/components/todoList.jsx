import { Avatar, List } from 'antd';
import React from 'react';
import Icon, { OrderedListOutlined } from '@ant-design/icons';
const avatarSrc = require('@/assets/icons/u15.png');
import '../pages/pageManage/homePage/index.less';
const data = [
  '完成首页配置提交,认真形式',
  '解决数据交互问题，做好工作',
  '优先解决遗留的需求.',
  '完成今日工作计划',
  '总结需求开发,撰写需求文档',
  '编写代码，实现功能需求',
];

const TodoList = (props) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}
  >
    <p style={{ marginBottom: '5px' }}>
      <OrderedListOutlined style={{ marginRight: '4px' }} />
      TodoList
    </p>
    <List
      className={props.className}
      size="small"
      bordered
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>{`${index + 1}. ${item}`}</List.Item>
      )}
      style={{ border: 'none' }}
    />
  </div>
);

export default TodoList;
