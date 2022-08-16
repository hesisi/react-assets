import { Avatar, List } from 'antd';
import React from 'react';
const avatarSrc = require('@/assets/icons/u15.png');
import '../pages/pageManage/homePage/index.less';
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const TodoList = (props) => (
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
);

export default TodoList;
