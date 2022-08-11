import { useEffect, useRef, useState } from 'react';
import { Layout, Menu, Row, Col, List } from 'antd';
const { Sider, Content, Header } = Layout;
import Background from '../../../assets/panda.jpg';
import TestChart from '../../echarts/testChart';

const blueList = [
  '#e6f7ff',
  '#bae7ff',
  '#91d5ff',
  '#69c0ff',
  '#40a9ff',
  '#1890ff',
];
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export default function pagePanel(props) {
  const layoutOne = useRef(null);
  const layoutHeaderRef = useRef(null);

  // useEffect(() => {}, [props.form, props.comKey]);
  useEffect(() => {
    if (props.comKey.includes('standard-1') && layoutOne.current) {
      layoutOne.current.style.backgroundImage = `url(${Background})`;
      layoutOne.current.style.backgroundSize = '100%, 100%';
      layoutOne.current.style.backgroundRepeat = 'no-repeat';
    } else if (props.comKey.includes('standard-1') && layoutHeaderRef.current) {
      layoutHeaderRef.current.style.backgroundImage = `url(${Background})`;
      layoutHeaderRef.current.style.backgroundSize = '100%, 100%';
      layoutHeaderRef.current.style.backgroundRepeat = 'no-repeat';
    }
  }, [props.active]);

  return (
    <div className="home-panel">
      {props.template === 'one' ? (
        <div
          className="layout-one"
          ref={layoutOne}
          style={{
            height: `${props?.form?.height}px`,
            width: `${props?.form?.width}px`,
          }}
        ></div>
      ) : (
        <></>
      )}

      {props.template === 'four' ? (
        <Layout className="layout-two">
          <Header className="layout-two__header" ref={layoutHeaderRef}></Header>
          <Content className="layout-two__content">
            <Row>
              {blueList.slice(1, 4).map((e, i) => (
                <Col span={8} style={{ backgroundColor: e }} key={e}>
                  {i === 0 && props.comKey.includes('standard-2') ? (
                    <>
                      <List
                        size="small"
                        bordered
                        header={<div>TodoList</div>}
                        dataSource={data}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  {i === 1 && props.comKey.includes('standard-3') ? (
                    <TestChart />
                  ) : (
                    <></>
                  )}
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      ) : (
        <></>
      )}
    </div>
  );
}
