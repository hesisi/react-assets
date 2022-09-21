import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import './menuPreview.less';
// import eventBus from '../../utils/eventBus';
// import { Link } from 'umi';
import { list } from '../menuManage/menuList/iconBox';

const { Header, Sider, Content } = Layout;
// let items = JSON.parse(localStorage.getItem('setTree')) || [];
// let config = {};
let treeObj = {};

// eventBus.addListener('setTree', (tree, menuConfig) => {
//   // 不写话第一次打开无法显示
//   items = tree;
//   config = menuConfig;
//   const temp = (data) => {
//     data.forEach((item) => {
//       treeObj[item.key] = item.address;
//       if (item.children && item.children.length) {
//         temp(item.children);
//       }
//     });
//   };
//   temp(tree);
// });

const menuPreview = () => {
  const header = ['horizontal', 'horizontalAndVertical'];
  const sider = ['inline', 'horizontalAndVertical'];

  const [iframeShow, setIframeShow] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  const onClick = (e) => {
    setIframeShow(true);
    setIframeSrc(treeObj[e.key]);
  };

  const [mode, setMode] = useState('inline');
  const [headerMode, setHeaderMode] = useState('horizontal');

  const [config, setConfig] = useState({
    mode: 'horizontalAndVertical',
    theme1: 'light',
    theme2: 'dark',
    type: 'inline',
  });
  const [items, setItems] = useState([]);

  // const setMenu = (config) => {
  //   if (!config) {
  //     return;
  //   }
  //   switch (config.mode) {
  //     case 'horizontal':
  //       setHeaderMode('horizontal');
  //       break;
  //     case 'inline':
  //       setMode('inline');
  //       break;
  //     case 'horizontalAndVertical':
  //       setMode('inline');
  //       setHeaderMode('horizontal');
  //       break;
  //     default:
  //       setMode('model');
  //       setHeaderMode('model');
  //       break;
  //   }

  //   if (config.type === 'vertical') {
  //     setMode('vertical');
  //   }
  // };

  // useEffect(() => {
  //   setMenu();
  //   // eventBus.addListener('setTree', (tree, menuConfig) => {
  //   //   items = tree;
  //   //   config = menuConfig;
  //   // });
  // }, [config]);

  const temp = (data) => {
    data.forEach((item) => {
      treeObj[item.key] = item.address;
      item['icon'] =
        (item?.icon && item.icon > 0) || item?.icon === 0
          ? React.createElement(list[item.icon])
          : null;
      if (item.children && item.children.length) {
        temp(item.children);
      }
    });
    return data;
  };

  useEffect(() => {
    let itemsInit = JSON.parse(localStorage.getItem('setTree')) || [];
    itemsInit = temp(itemsInit);
    const configInit = JSON.parse(localStorage.getItem('menuConfig')) || {};

    setConfig(configInit);
    setItems(itemsInit);
    // setMenu(configInit);
  }, []);

  return (
    <Layout>
      <Header
        className={
          config?.theme2 === 'light' ? 'background-light' : 'background-dark'
        }
      >
        <Menu
          onClick={() => onClick()}
          defaultSelectedKeys={[]}
          defaultOpenKeys={[]}
          mode={
            config.mode === 'horizontalAndVertical' ? 'horizontal' : config.mode
          }
          items={items}
          theme={config.theme2}
          className="header-menu"
        />
      </Header>
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
                onClick={() => onClick()}
                defaultSelectedKeys={[]}
                defaultOpenKeys={[]}
                mode={
                  config.mode === 'horizontalAndVertical'
                    ? 'inline'
                    : config.mode
                }
                items={items}
                theme={config.theme1}
              />
            </Sider>
          ) : null}

          <Content
            style={{
              // padding: '0 24px',
              minHeight: 280,
            }}
          >
            {iframeShow ? (
              <iframe
                title="iframe"
                scrolling="auto"
                src={iframeSrc}
                className={
                  config.mode === 'horizontal'
                    ? 'menu-preview__iframe iframe-horizontal'
                    : 'menu-preview__iframe'
                }
              ></iframe>
            ) : (
              <h1 className="menu-preview__title">Welcome</h1>
            )}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default menuPreview;
