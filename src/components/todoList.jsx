import { Avatar, List } from 'antd';
import React from 'react';
import Icon, {
  OrderedListOutlined,
  EyeOutlined,
  EyeFilled,
} from '@ant-design/icons';
const avatarSrc = require('@/assets/icons/u15.png');
import '../pages/pageManage/homePage/index.less';
import './public.less';
const data = [
  { title: '重庆人民齐心协力扑灭山火', scan: 234 },
  { title: '唐山打人事件主犯被提起诉讼', scan: 134 },
  { title: '美国派遣即将退役的巡洋舰穿越台湾海峡.', scan: 994 },
  { title: '今年中秋节假期之前有望结束国内疫情', scan: 294 },
  { title: '总结需求开发,撰写需求文档', scan: 804 },
  { title: '编写代码，实现功能需求', scan: 294 },
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
    className="todolist"
  >
    <p>
      <OrderedListOutlined
        style={{ marginRight: '10px', color: 'rgb(217,123,98)' }}
      />
      TodoList
    </p>
    <List
      className={props.className}
      size="small"
      split={true}
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <div className="spantitle">
            <span className="spanblock"></span> {`${item.title}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EyeFilled style={{ color: '#989898', marginRight: '4px' }} />{' '}
            <span style={{ color: '#989898', fontSize: '12px' }}>
              {item.scan}
            </span>{' '}
          </div>
        </List.Item>
      )}
      style={{ border: 'none', marginTop: '30px' }}
    />
  </div>
);

export default TodoList;
