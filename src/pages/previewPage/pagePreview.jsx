import { useRef, useState, useEffect } from 'react';
import Background from '../../assets/bg.jpg';
import { Layout, Menu, Row, Col, List } from 'antd';
const { Sider, Content, Header } = Layout;
import './pagePreview.less';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export default function pagePreview(props) {
  const config = JSON.parse(window.localStorage.getItem('pageConfig'));
  const layoutOne = useRef(null);
  const layoutHeaderRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (config.comKey.includes('standard-1') && layoutOne.current) {
      layoutOne.current.style.backgroundImage = `url(${Background})`;
      layoutOne.current.style.backgroundSize = '100%, 100%';
      layoutOne.current.style.backgroundRepeat = 'no-repeat';
    } else if (
      config.comKey.includes('standard-1') &&
      layoutHeaderRef.current
    ) {
      layoutHeaderRef.current.style.backgroundImage = `url(${Background})`;
      layoutHeaderRef.current.style.backgroundSize = '100%, 100%';
      layoutHeaderRef.current.style.backgroundRepeat = 'no-repeat';
      setIndex(index + 1);
    } else if (config.comKey.includes('standard-2')) {
      setIndex(index + 1);
    }
    setIndex(index);
  }, []);

  return (
    <div className="preview">
      {config.template === 'one' ? (
        <div
          className="layout-one"
          ref={layoutOne}
          style={{
            height: `${config?.form?.height}px`,
            width: `${config?.form?.width}px`,
          }}
        ></div>
      ) : (
        <></>
      )}

      {config.template === 'four' ? (
        <Layout>
          <Header ref={layoutHeaderRef}></Header>
          <Content>
            <Row>
              {[0, 1, 2].map((e, i) => (
                <Col span={8} key={e}>
                  {index === i && config.comKey.includes('standard-2') ? (
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
