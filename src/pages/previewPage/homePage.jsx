import { Row, Col } from 'antd';
import { useEffect, useState } from 'react';

import TodoList from '@/components/todoList';
import LineChart from '@/components/lineChart';
import GaugeChart from '@/components/gaugeChart';
import ListCom from '@/components/listCom';
import CarouselBanner from '@/components/carouselBanner';
import '../pageManage/homePage/index.less';
import '../pageManage/pageBuild/index.less';

const homePage = () => {
  const [dom, setDom] = useState([]);
  const [ids, setIds] = useState([]);

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
      <Row wrap style={{ height: '100%', width: '100%' }}>
        {dom.map((e) => {
          return (
            <Col
              span={e.colSpan}
              key={e.id}
              className={e.className ? `${e.className} ${e.id}` : `${e.id}`}
              style={e.style}
            >
              <div className="default" style={e.style}>
                {e.component}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };

  useEffect(() => {
    let homeDom = [];
    if (JSON.parse(window.localStorage.getItem('homeDom'))?.length > 0) {
      homeDom = JSON.parse(window.localStorage.getItem('homeDom'));
    } else if (
      JSON.parse(window.localStorage.getItem('layoutTemplate'))?.length > 0
    ) {
      homeDom = JSON.parse(window.localStorage.getItem('layoutTemplate'));
    }
    //   JSON.parse(window.localStorage.getItem('homeDom')) ||
    //   JSON.parse(window.localStorage.getItem('layoutTemplate')); // DOM元素
    // console.log(
    //   homeDom,
    //   JSON.parse(window.localStorage.getItem('layoutTemplate')),
    // );
    if (homeDom.length === 0) return;
    const domArr = homeDom.map((e) => {
      e.component = renderComponent(e.componentName, e.id);
      e.colSpan = e.col || e.colSpan;
      // e.className = e.className || 'default-col';
      return e;
    });
    setDom(domArr);
    setIds(domArr.map((e) => e.id));
  }, []);

  useEffect(() => {
    document.getElementsByClassName('default').forEach((e) => {
      e.style.cursor = 'default';
    });

    const homeProperty = JSON.parse(
      window.localStorage.getItem('homeProperty'),
    );
    if (Object.keys(homeProperty).length < 1) return;

    // ids.forEach((e) => {
    //   const ele = document.getElementsByClassName(`${e}`)[0];
    //   ele.style.maxWidth = `${homeProperty.width}px`;
    //   ele.style.height = `${homeProperty.height}px`;
    // });

    // const ele = document.getElementsByClassName(`${selectId}`);
    // if (ele.length < 1) return;
    // ele.forEach((e) => {
    //   e.style.maxWidth = `${property.width}px`;
    //   e.style.height = `${property.height}px`;
    // });
    document.getElementsByClassName('default-col').forEach((e) => {
      e.style.borderWidth = homeProperty.colGap || '10px';
      e.style.borderColor = homeProperty.colGapColor;
      e.style.background = homeProperty.bg;
      e.style.borderRadius = homeProperty.radius || '0px';
    });
    document.getElementsByClassName('default').forEach((e) => {
      e.style.background = homeProperty.bg;
    });
  }, [dom]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Row className="content-box__row">
        <Col span={24}>{dom.length > 0 ? renderDom(dom) : <></>}</Col>
      </Row>
    </div>
  );
};

export default homePage;
