import { Layout, Menu, Row, Col } from 'antd';
const { Sider, Content, Header } = Layout;
import { useState, useEffect, forwardRef, useContext } from 'react';

const modeEnum = Object.freeze({
  sub1: 'one',
  sub2: 'four',
  sub3: 'five',
});
export default function pageConfig(props) {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState();

  const blueList = [
    '#e6f7ff',
    '#bae7ff',
    '#91d5ff',
    '#69c0ff',
    '#40a9ff',
    '#1890ff',
  ];

  const onClick = (item) => {
    setMode(modeEnum[item.key]);
    props.setModeKey(modeEnum[item.key]);
  };

  useEffect(() => {
    setItems([
      {
        key: '1',
        label: '模板样式',
        children: [
          { key: 'sub1', label: '单区域' },
          { key: 'sub2', label: '页眉和三区域' },
          { key: 'sub3', label: '上二下三' },
        ],
      },
    ]);
  }, []);

  return (
    <Layout className="config-layout">
      <Sider>
        <Menu
          onClick={onClick}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Content>
        {mode === 'one' ? <div className="layout-one"></div> : <></>}

        {mode === 'four' ? (
          <Layout className="layout-two">
            <Header className="layout-two__header"></Header>
            <Content className="layout-two__content">
              <Row>
                {blueList.slice(1, 4).map((e) => (
                  <Col span={8} style={{ backgroundColor: e }} key={e}></Col>
                ))}
              </Row>
            </Content>
          </Layout>
        ) : (
          <></>
        )}

        {mode === 'five' ? (
          <div className="layout-three">
            <Row justify="space-between">
              {blueList.slice(0, 2).map((e) => (
                <Col span={12} style={{ backgroundColor: e }} key={e}></Col>
              ))}
            </Row>
            <Row>
              {blueList.slice(2, 5).map((e) => (
                <Col span={8} style={{ backgroundColor: e }} key={e}></Col>
              ))}
            </Row>
          </div>
        ) : (
          <></>
        )}
      </Content>
    </Layout>
  );
}
