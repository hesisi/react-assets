import { Table, Button, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import './index.less';

export default function IndexPage() {
  const data = [
    { name: 'nike', label: '耐克' },
    { name: 'adidas', label: '阿迪达斯' },
    { name: 'grn', label: '贵人鸟' },
  ];
  const List = (props: any) => {
    const { data } = props;
    return (
      <div className={'list-cont'}>
        <div className={'header'}>
          <h3 className={'title'}>用户分组管理</h3>
          <InfoCircleOutlined />
          <a style={{ color: '#85BD25', marginLeft: 'auto' }}>
            <PlusCircleOutlined />
          </a>
        </div>
        {data.map((x: any) => (
          <div className={'list-item'} key={x.name}>
            {x.label}
            <FormOutlined />
            <DeleteOutlined />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', padding: 20, backgroundColor: '#f0f2f5' }}>
      <Layout className={'user-cont'}>
        <Sider className={'user-sider'} width={300}>
          <List data={data}></List>
        </Sider>
        <Content>Content</Content>
      </Layout>
    </div>
  );
}
