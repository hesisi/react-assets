import { Avatar, List } from 'antd';
import React from 'react';
import Icon, { UnorderedListOutlined } from '@ant-design/icons';
const icon = require('@/assets/icons/u15.png');
import './public.less';
const data = [
  {
    title: '重庆山火被扑灭',
    description: '重庆人民和来自各地的消防战士历经5天扑灭山火',
    avatar:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F24%2F20210724234957_e90a0.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664351365&t=841b9b397ed302612c79dec2ee05f3bb',
  },
  {
    title: '美国巡洋舰穿越台湾海峡',
    description: '美国巡洋舰穿越台湾海峡,这是对中方赤裸裸的挑衅',
    avatar:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F3c6d55fbb2fb4316f582dbf22ba4462308f7d39d.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664351400&t=4130272cd1e05d1a89c34fa537462346',
  },
  {
    title: '国内各地政府做好疫情防控工作',
    description: '目前国内出现了疫情反扑现象,各地政府启动疫情防疫政策',
    avatar:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi.qqkou.com%2Fi%2F0a668069222x2130797117b26.jpg&refer=http%3A%2F%2Fi.qqkou.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664351453&t=1408a57dd91456030f380d17f34c5ea5',
  },
  {
    title: '新迭代的bug修复问题',
    description: '修复问题，完成问题清零,代码提交并完成次迭代产品交互',
    avatar:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi.qqkou.com%2Fi%2F1a2340660771x54497186b15.jpg&refer=http%3A%2F%2Fi.qqkou.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664351492&t=41969ec115105f223ecc8421b35e321b',
  },
];

const ListCom = (props) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
    className="listCom"
  >
    <p>
      <UnorderedListOutlined style={{ marginRight: '10px' }} />
      ListCom
    </p>
    <List
      style={{ marginTop: '20px' }}
      className={props.className}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={<a href="#!">{item.title}</a>}
            description={item.description}
          />
        </List.Item>
      )}
    />
  </div>
);

export default ListCom;
