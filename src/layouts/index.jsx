/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:48:59
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-08 11:46:00
 */
import { Breadcrumb, Layout, Menu, Avatar, Col, Row, Space } from 'antd';
import { withRouter } from 'react-router-dom';
import { Link } from 'umi';
import React, { useMemo } from 'react';
import routes from '../../config/routes';
import Styles from './index.less';
import logo from '@/assets/icons/logo.png';
import {
  UserOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  DownOutlined,
} from '@ant-design/icons';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;

const renderNavBar = routes
  .filter((item) => item.name)
  ?.map((item) => {
    return {
      key: item.path,
      label: item.path ? (
        <Link to={item.path}>{item.name}</Link>
      ) : (
        <div
          onClick={() => {
            if (item.name === '动态报表') {
              window.location.href = 'http://localhost:9996/tool-datav/index';
            }
          }}
        >
          {item.name}
        </div>
      ),
      meta: item.meta,
    };
  });

const navBar = renderNavBar.filter((e) => !e.meta?.navHidden); // 过滤掉菜单预览

const getMetaInfoByPath = (routesData, path, result = []) => {
  routesData.forEach((item) => {
    if (item.path === path) {
      result.push(item.meta);
    } else if (item.routes && item.routes.length) {
      getMetaInfoByPath(item.routes, path, result);
    }
  });
  return result;
};

const CommonLayout = (props) => {
  const selectKey = `/${props.location.pathname?.split('/')[1]}`;

  const activePath = props.location.pathname;
  const curretnItem = routes?.filter((item) => {
    return item.path === props.pathPrefix;
  });

  // 左侧菜单树
  const MenuList =
    (curretnItem && curretnItem[0] && curretnItem[0].routes) || [];

  // 递归遍历左侧菜单
  const renderItems = function (list = []) {
    return list.map((item, index) => {
      if (item.name && item.component) {
        return {
          key: item.path,
          icon: item.icon,
          label: item.path ? (
            <Link to={item.path}>{item.name}</Link>
          ) : (
            item.name
          ),
          children: item.routes && renderItems(item.routes),
        };
      }
    });
  };

  const meta = useMemo(() => {
    const path = props.location.pathname;
    const metaInfo =
      getMetaInfoByPath(routes, path, []) &&
      getMetaInfoByPath(routes, path, [])[0];
    return metaInfo;
  });

  return (
    <Layout>
      <Header
        className={Styles.header}
        style={{ display: meta && !meta.showHeader ? 'none' : 'flex' }}
      >
        <div className={Styles.logo}>
          <img src={logo} />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[selectKey]}
          items={navBar}
          style={{ background: '#0D6BFF' }}
          className={Styles['menu']}
        />
        <div className="user-message">
          <Space size={30}>
            <QuestionCircleOutlined
              style={{ color: '#ffffff', fontSize: '16px' }}
            />
            <BellOutlined style={{ color: '#ffffff', fontSize: '16px' }} />
            <div className={'user-detail'}>
              <Space size={10}>
                <Avatar src="https://joeschmoe.io/api/v1/random" />
                <span>欢迎你，用户一</span>
                <DownOutlined />
              </Space>
            </div>
          </Space>
        </div>
      </Header>
      <Content
        style={{
          height: 'calc(100vh - 64px)',
          backgroundColor: '#f0f2f5',
        }}
      >
        <Layout
          className={Styles['site-layout-background']}
          style={{
            // padding: '24px 0',
            height: '100%',
          }}
        >
          <Sider
            className={Styles['site-layout-background']}
            width={200}
            style={{
              // height: '100%',
              display: meta && !meta.showMenu ? 'none' : 'block',
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[activePath]}
              style={{
                height: '100%',
              }}
              items={renderItems(MenuList)}
            />
          </Sider>
          <Content
            style={{
              // padding: '0 24px',
              minHeight: 280,
              backgroundColor: '#f0f2f5',
            }}
          >
            {meta && meta.breadcrumb ? (
              <Breadcrumb
                style={{
                  background: '#f0f2f5',
                  padding: '20px',
                  borderBottom: '4px solid #f0f0f0',
                  color: '#333333',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'PingFangSC-Semibold',
                }}
              >
                {meta.breadcrumb.map((e, i) => {
                  return <Breadcrumb.Item key={i}>{e.label}</Breadcrumb.Item>;
                })}
              </Breadcrumb>
            ) : (
              <></>
            )}
            <div
              className={Styles.contentWrapper}
              style={{ background: '#f0f2f5' }}
            >
              {props.children}
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default withRouter(CommonLayout);
