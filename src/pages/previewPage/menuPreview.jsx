import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import './menuPreview.less';
import eventBus from '../../utils/eventBus';

const { Header, Content, Sider } = Layout;
let items = [];
let config = {};
eventBus.addListener('setTree', (tree, menuConfig) => {
  // 不写话第一次打开无法显示
  items = tree;
  config = menuConfig;
});

export default function menuPreview() {
  const header = ['horizontal', 'horizontalAndVertical'];
  const sider = ['inline', 'horizontalAndVertical'];
  const onClick = (e) => {
    console.log('click ', e);
  };

  const [mode, setMode] = useState('inline');
  const [headerMode, setHeaderMode] = useState('horizontal');
  const setMenu = () => {
    switch (config.mode) {
      case 'horizontal':
        setHeaderMode('horizontal');
        break;
      case 'inline':
        setMode('inline');
        break;
      case 'horizontalAndVertical':
        setMode('inline');
        setHeaderMode('horizontal');
        break;
      default:
        setMode('model');
        setHeaderMode('model');
        break;
    }

    if (config.type === 'vertical') {
      setMode('vertical');
    }
  };

  useEffect(() => {
    setMenu();
    eventBus.addListener('setTree', (tree, menuConfig) => {
      items = tree;
      config = menuConfig;
    });
  }, [config]);

  useEffect(() => {
    // 离开时清空menu
    return () => {
      items = [];
      config = {};
    };
  }, []);

  return (
    <Layout>
      {/* 常规或水平模式 */}
      {header.includes(config.mode) ? (
        <Header
          className={
            config.theme2 === 'light' ? 'background-light' : 'background-dark'
          }
        >
          <Menu
            onClick={onClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode={headerMode}
            items={items}
            theme={config.theme2}
            className="header-menu"
          />
        </Header>
      ) : (
        <></>
      )}
      <Content
        style={{
          height: 'calc(100vh - 64px)',
        }}
      >
        <Layout
          style={{
            // padding: '24px 0',
            height: '100%',
          }}
        >
          {/* 垂直或常规模式 */}
          {sider.includes(config.mode) ? (
            <Sider
              className={
                config.theme1 === 'light'
                  ? 'background-light'
                  : 'background-dark'
              }
              width={200}
            >
              <Menu
                onClick={onClick}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode={mode}
                items={items}
                theme={config.theme1}
              />
            </Sider>
          ) : (
            <></>
          )}
          <Content
            style={{
              // padding: '0 24px',
              minHeight: 280,
            }}
          >
            <iframe
              title="iframe"
              scrolling="auto"
              src="/formManage/formList"
              className="menu-preview__iframe"
            ></iframe>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}
