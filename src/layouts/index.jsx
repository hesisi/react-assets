/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 16:48:59
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-20 14:25:59
 */
import { Breadcrumb, Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom'
import { Link } from 'umi'
import React from 'react';
import routes from '../../config/routes'
import Styles from './index.less'

const { Header, Content, Footer, Sider } = Layout;

const renderNavBar = routes.filter(item => item.name)?.map((item) => {
  return {
    key: item.path,
    label: item.path ? <Link to={item.path}>{item.name}</Link> : item.name,
  }
});


const CommonLayout = (props) => {
  const selectKey = `/${props.location.pathname?.split('/')[1]}`

  const activePath = props.location.pathname
  const curretnItem = routes?.filter(item => {
    return item.path === props.pathPrefix
  })

  // 左侧菜单树
  const MenuList = curretnItem && curretnItem[0] && curretnItem[0].routes || []

  // 递归遍历左侧菜单
  const renderItems = function(list=[]){
    return list.map((item, index) => {
      if(item.name && item.component){
        return {
          key: item.path,
          icon: item.icon,
          label: item.path ? <Link to={item.path}>{item.name}</Link> : item.name,
          children: item.routes && renderItems(item.routes),
        };
      }
    });
  }

  return (
    <Layout>
      <Header className="header">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[selectKey]} items={renderNavBar} />
      </Header>
      <Content
        style={{
          height: 'calc(100vh - 64px)'
        }}
      >
        <Layout
          className="site-layout-background"
          style={{
            // padding: '24px 0',
            height: '100%'
          }}
        >
          <Sider className="site-layout-background" width={200}>
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
            }}
          >
            <div className={Styles.contentWrapper}>
              {props.children}
            </div>
          </Content>
        </Layout>
      </Content>
    </Layout>
  )
};

export default withRouter(CommonLayout)