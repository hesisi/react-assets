import { Row, Col } from 'antd';
import { useEffect, useState } from 'react';

import TodoList from '@/components/todoList';
import LineChart from '@/components/lineChart';
import GaugeChart from '@/components/gaugeChart';
import ListCom from '@/components/listCom';
import CarouselBanner from '@/components/carouselBanner';
import '../pageManage/homePage/index.less';

const homePage = () => {
  const [dom, setDom] = useState([]);

  const renderComponent = (com, id) => {
    switch (com) {
      case 'standard-pic':
        return (
          <CarouselBanner className="dom-component dom-component__carousel" />
        );
      case 'standard-todo':
        return <TodoList className="dom-component dom-component__todo" />;
      case 'standard-charts':
        return <LineChart id={id} className="dom-component" />;
      case 'standard-board':
        return <GaugeChart id={id} className="dom-component" />;
      case 'standard-list':
        return <ListCom className="dom-component dom-component__todo" />;
      default:
        return <></>;
    }
  };

  const renderDom = (dom) => {
    return (
      <Row wrap style={{ height: '100%', width: '100%', padding: '10px' }}>
        {dom.map((e) => {
          return (
            <Col span={e.colSpan} key={e.id} className={e.className}>
              <div className="default">{e.component}</div>
            </Col>
          );
        })}
      </Row>
    );
  };

  useEffect(() => {
    const homeDom = JSON.parse(window.localStorage.getItem('homeDom'));
    const domArr = homeDom.map((e) => {
      e.component = renderComponent(e.componentName, e.id);
      return e;
    });
    setDom(domArr);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Row className="content-box__row">
        <Col span={24}>{dom.length > 0 ? renderDom(dom) : <></>}</Col>
      </Row>
    </div>
  );
};

export default homePage;
