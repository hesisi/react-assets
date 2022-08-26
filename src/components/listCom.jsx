import { Avatar, List } from 'antd';
import React from 'react';
import Icon, { UnorderedListOutlined } from '@ant-design/icons';
const icon = require('@/assets/icons/u15.png');
const data = [
  {
    title: '周一工作计划总结',
    description: '完成首页设计,进行代码编写',
  },
  {
    title: '周二工作计划总结',
    description: '代码编写完成,提出问题解决',
  },
  {
    title: '周三工作计划总结',
    description: '完成测试工作，提交问题',
  },
  {
    title: '周四工作计划总结',
    description: '修复问题，完成问题清零，代码提交',
  },
  // {
  //   title: '周五工作计划总结',
  //   description:"准备产品上线，完成产品交互"
  // },
  // {
  //   title: '19迭代工作计划分析',
  //   description:"19迭代需求分析，完成用户权限"
  // },
];

const ListCom = (props) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
  >
    <p style={{ marginBottom: '5px' }}>
      <UnorderedListOutlined style={{ marginRight: '4px' }} />
      ListCom
    </p>
    <List
      className={props.className}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={icon} />}
            title={<a href="#!">{item.title}</a>}
            description={item.description}
          />
        </List.Item>
      )}
    />
  </div>
);

export default ListCom;
