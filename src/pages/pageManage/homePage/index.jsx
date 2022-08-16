import { Layout, Row, Col, Button, Space, Select, message } from 'antd';
const { Header, Sider, Content } = Layout;
const { Option } = Select;
import Icon, {
  RedoOutlined,
  ScissorOutlined,
  CopyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './index.less';
import ConfigSider from './configSider';
import ContentSetting from './contentSetting';

import { useState, useEffect } from 'react';

import { nanoid } from 'nanoid';

import TodoList from '@/components/todoList';
import LineChart from '@/components/lineChart';
import GaugeChart from '@/components/gaugeChart';
import ListCom from '@/components/listCom';
import CarouselBanner from '@/components/carouselBanner';

const back = require('@/assets/icons/back.svg');
const forward = require('@/assets/icons/forward.svg');
const pic = require('@/assets/pic.jpg');
const shrinks = ['100%', '80%', '60%', '40%', '20%'];

const homePage = (props) => {
  const [template, setTemplate] = useState([]); // 当前选中的模板类型
  const [component, setComponent] = useState([]); // 当前选中的组件类型
  const [dom, setDom] = useState([]);
  const [selectId, setSelectId] = useState('');

  useEffect(() => {
    // 设置固定模板
    if (template.length < 0) return;
    if (!template[0]?.includes('default')) return;
    switch (template[0]) {
      case 'default-single':
        setDom([
          {
            id: nanoid(),
            colSpan: 24,
            className: 'default-col',
            component: null,
          },
        ]);
        break;
      case 'default-header-three':
        setDom([
          {
            id: nanoid(),
            colSpan: 24,
            className: 'default-col',
            component: null,
          },
          {
            id: nanoid(),
            colSpan: 8,
            className: 'default-col default-col __top default-col __right',
            component: null,
          },
          {
            id: nanoid(),
            colSpan: 8,
            className: 'default-col default-col __top default-col __right',
            component: null,
          },
          {
            id: nanoid(),
            colSpan: 8,
            className: 'default-col default-col __top',
            component: null,
          },
        ]);
        break;
      case 'default-two-three':
        setDom([
          {
            id: nanoid(),
            colSpan: 12,
            className: 'default-col default-col __right',
            component: null,
          },
          {
            id: nanoid(),
            colSpan: 12,
            className: 'default-col ',
            component: null,
          },
          {
            id: nanoid(),
            colSpan: 8,
            className: 'default-col default-col __top default-col __right',
            component: null,
          },
          {
            id: nanoid(),
            colSpan: 8,
            className: 'default-col default-col __top default-col __right',
            component: null,
          },
          {
            id: nanoid(),
            colSpan: 8,
            className: 'default-col default-col __top',
            component: null,
          },
        ]);
      default:
        break;
    }
  }, [template]);

  const renderComponent = (com) => {
    switch (com[0]) {
      case 'standard-pic':
        return (
          <CarouselBanner className="dom-component dom-component__carousel" />
        );
      case 'standard-todo':
        return <TodoList className="dom-component dom-component__todo" />;
      case 'standard-charts':
        return <LineChart id={selectId} className="dom-component" />;
      case 'standard-board':
        return <GaugeChart id={selectId} className="dom-component" />;
      case 'standard-list':
        return <ListCom className="dom-component dom-component__todo" />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (!selectId && component[0]) {
      message.warning('未选中操作区域');
      return;
    }
    const domArr = dom.map((e) => {
      if (e.id === selectId) {
        e.component = renderComponent(component);
        e.componentName = component[0];
      }
      return e;
    });
    setDom(domArr);
  }, [component]);

  const regionSelect = (id) => {
    // 当前选中的块id
    if (selectId === id) {
      setSelectId('');
      return;
    }
    setSelectId(id);
  };

  const renderDom = (dom) => {
    return (
      <Row wrap style={{ height: '100%', width: '100%', padding: '10px' }}>
        {dom.map((e) => {
          return (
            <Col
              span={e.colSpan}
              key={e.id}
              className={
                e.id === selectId ? `${e.className} active-col` : e.className
              }
              onClick={() => {
                regionSelect(e.id);
              }}
            >
              <div className={e.id === selectId ? 'active' : 'default'}>
                {e.component ? (
                  <>{e.component}</>
                ) : (
                  <>
                    <PlusOutlined
                      style={{ color: '#1890ff', fontSize: '30px' }}
                    />
                    <p className="dom-text">请从组件库选择您想放置的组件</p>
                  </>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };

  const previewHandler = () => {
    console.log('====DOM', dom);
    window.localStorage.setItem('homeDom', JSON.stringify(dom));
  };

  return (
    <div className="home-page">
      <Layout>
        <Header className="home-page__header">
          <Row gutter={10}>
            <Col span={4}>
              <Space>
                <img
                  src={back}
                  style={{ marginTop: '-5px' }}
                  className="icon"
                />
                <img
                  src={forward}
                  style={{ marginTop: '-5px' }}
                  className="icon"
                />
                <ScissorOutlined className="icon" />
                <CopyOutlined className="icon" />
              </Space>
            </Col>
            <Col span={15} className="header-config">
              <Space>
                <div>
                  收缩查看：
                  <Select defaultValue="100%" style={{ width: 120 }}>
                    {shrinks.map((e, i) => {
                      return (
                        <Option value={e} key={i}>
                          {e}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <RedoOutlined className="icon" />
                <span className="header-config__text">主页配置面板</span>
              </Space>
            </Col>
            <Col span={5}>
              <Space>
                <Button type="primary">返回</Button>
                <Button type="primary" onClick={previewHandler}>
                  预览
                </Button>
                <Button type="primary">保存</Button>
                <Button type="primary">启用</Button>
              </Space>
            </Col>
          </Row>
        </Header>

        <Layout>
          {/* <Sider className="home-page__sider" width={300}>
            <ConfigSider />
          </Sider> */}

          <Content className="home-page__content">
            <Row gutter={10} className="content-box__row">
              <Col span={4} style={{ borderRight: '20px solid #f0f2f5' }}>
                <ConfigSider
                  setTemplate={setTemplate}
                  setComponent={setComponent}
                />
              </Col>
              <Col
                span={15}
                className={template.length === 0 ? 'content-box__panel' : ''}
                style={{ padding: 0, borderRight: '20px solid #f0f2f5' }}
              >
                {template.length > 0 ? (
                  renderDom(dom)
                ) : (
                  <span>
                    请先选择您想要的模板，或是点击“+”，创建您的自定义模板吧...
                  </span>
                )}
              </Col>
              <Col span={5}>
                <ContentSetting selectId={selectId} />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default homePage;
