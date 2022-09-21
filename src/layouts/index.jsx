/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:48:59
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-08 11:46:00
 */
import {
  Breadcrumb,
  Layout,
  Menu,
  Avatar,
  Col,
  Row,
  Space,
  Dropdown,
  Button,
  Tooltip,
  Badge,
  Image,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { Link, history } from 'umi';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import routes from '../../config/routes';
import { dealMenuList } from '../../config/routesDy';
import Styles from './index.less';
import logo from '@/assets/icons/logo.png';
import {
  UserOutlined,
  CarryOutOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  SolutionOutlined,
  DownOutlined,
  RightOutlined,
  InsuranceOutlined,
  AccountBookOutlined,
} from '@ant-design/icons';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;

const newRoutes = dealMenuList();
const renderNavBar = [];
newRoutes
  .filter((item) => item.title)
  ?.forEach((item) => {
    // const isHave = newRoutes.find((newItem) => {
    //   return newItem.key === item.key;
    // });
    // if (isHave) {
    renderNavBar.push({
      key: item.address || item.path,
      label: (
        <Link to={item.address || item.path}>{item.title || item.name}</Link>
      ),
      // label: item.path ? (
      //   <Link to={item.path}>{item.name}</Link>
      // ) : (
      //   <div
      //     onClick={() => {
      //       if (item.name === '动态报表') {
      //         window.location.href = 'http://localhost:9996/tool-datav/index';
      //       }
      //     }}
      //   >
      //     {item.name}
      //   </div>
      // ),
      // meta: item.meta,
    });
    // }
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
  const [isShowMessage, setIsShowMessage] = useState(false);
  const messagesRef = useRef(null);
  const messagesBellRef = useRef(null);
  const [messageList, setMessageList] = useState([
    {
      icon: <AccountBookOutlined />,
      types: '6月话费报销',
      titles: '您提交的报销审批已完成',
      status: '已通过',
      time: '2022-7-04 14:03:21',
    },
    {
      icon: <SolutionOutlined />,
      types: '年假申请',
      titles: '王磊正在申请年假',
      status: '待审批',
      time: '2022-9-06 15:03:21',
    },
    {
      icon: <CarryOutOutlined />,
      types: '事假申请',
      titles: '您提交的事假申请已经完成',
      status: '已完成',
      time: '2022-9-05 12:05:56',
    },
    {
      icon: <InsuranceOutlined />,
      types: '年假申请',
      titles: '您提交的年假申请已经提交',
      status: '已提交',
      time: '2022-9-06 14:14:56',
    },
  ]);
  const [accountName, setAccountName] = useState(
    `${window.localStorage.getItem('accountName')}啊啊啊啊啊啊啊啊啊啊` || '',
  ); // 用户名

  const activePath = props.location.pathname;
  const curretnItem = newRoutes?.filter((item) => {
    return item.address === props.pathPrefix;
  });

  const judgeMunuChild = (menuArr) => {
    let backArr = [];
    menuArr.forEach((item) => {
      const isHave = newRoutes.find((newItem) => {
        return newItem.path === item.path;
      });
      if (isHave) {
        backArr.push(item);
      }
    });
    return backArr;
  };
  // 左侧菜单树
  const MenuList =
    (curretnItem && curretnItem[0] && curretnItem[0].children) || [];
  // judgeMunuChild(children[0].children)) ||
  // [];

  // 递归遍历左侧菜单
  const renderItems = function (list = []) {
    return list.map((item, index) => {
      if (item.title || item.name) {
        return {
          key: item.address || item.path,
          icon: item.icon,
          label: item.address ? (
            <Link to={item.address}>{item.title}</Link>
          ) : (
            item.title || item.name
          ),
          children: item?.children?.length && renderItems(item.children),
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
  const showMessages = () => {
    let flag = !isShowMessage;
    setIsShowMessage(flag);
  };
  const goToMessageCenter = () => {
    history.push({ pathname: '/notificationCenter/notificationList' });
  };

  const handleClickOutside = (e) => {
    if (
      !(messagesRef?.current && messagesRef?.current?.contains(e.target)) &&
      !(messagesBellRef?.current && messagesBellRef.current.contains(e.target))
    ) {
      setIsShowMessage(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleBreadClick = (item) => {
    if (item?.path) {
      history.push(item.path);
    }
  };

  // 退出
  const loginOut = () => {
    window.localStorage.removeItem('loginToken');
    history.push('/login');
  };

  // 下拉框
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Button
              type="text"
              onClick={loginOut}
              style={{ width: '100%', textAlign: 'left' }}
            >
              退出
            </Button>
          ),
        },
      ]}
    />
  );

  return (
    <Layout className={Styles.layoutMain}>
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
          {/* 消息提醒 */}
          {isShowMessage ? (
            <div
              className="messages-warp"
              // onMouseOut={() => handleOutMessage()}
            >
              <div className="messages" ref={messagesRef}>
                <div className="message_header">
                  <span>全部标记为已读</span>
                  <div>
                    查看全部 <RightOutlined />
                  </div>
                </div>
                <div className="message_content">
                  {messageList.map((item) => {
                    return (
                      <div className="message_item" onClick={goToMessageCenter}>
                        <div className="icon_container">
                          <div>{item.icon}</div>
                        </div>
                        <div className="item">
                          <span className="items_title">{item.titles}</span>
                          <div>
                            <span>{item.types}</span>{' '}
                            <span>
                              {item.status ? (
                                <a
                                  href="#"
                                  className="circle"
                                  style={{
                                    backgroundColor:
                                      item.status === '已完成'
                                        ? 'green'
                                        : 'yellow',
                                  }}
                                ></a>
                              ) : null}
                              {item.status}
                            </span>{' '}
                          </div>
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgb(170,170,170)',
                            }}
                          >
                            {item.time}
                          </span>
                        </div>
                        <RightOutlined />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
          {/* <Space size={30}> */}
          <div className="header__right">
            <QuestionCircleOutlined
              style={{
                color: '#ffffff',
                fontSize: '16px',
                marginRight: '30px',
              }}
            />

            <span
              className="bell_tips"
              onClick={showMessages}
              ref={messagesBellRef}
              style={{ marginRight: '30px', marginTop: '2px' }}
            >
              <Badge dot={true}>
                <BellOutlined
                  style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                />
              </Badge>

              {/* <p>{messageList.length > 99 ? '99+' : messageList.length}</p>
                <p>99+</p> */}
            </span>

            <Dropdown overlay={menu} trigger={['click']}>
              <div className={'user-detail'}>
                <Space size={10}>
                  <Avatar src="https://joeschmoe.io/api/v1/random" size={20} />
                  {/* className={Styles.avatar} */}

                  <span>
                    {/* <Tooltip title={accountName} placement="left"> */}
                    {(accountName.length > 8
                      ? `${accountName.slice(0, 8)}...`
                      : accountName) || '用户'}
                    {/* </Tooltip> */}
                  </span>
                  <DownOutlined />
                </Space>
              </div>
            </Dropdown>
          </div>
          {/* </Space> */}
        </div>
      </Header>
      <Content className="layout-content">
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
              defaultOpenKeys={
                MenuList?.[0]?.address ? [MenuList[0].address] : []
              }
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
              height: '100%',
              minHeight: 280,
              backgroundColor: '#f6f8fb',
            }}
          >
            {meta && meta.breadcrumb ? (
              <Breadcrumb
                style={{
                  background: '#f0f2f5',
                  padding: '18px 30px 8px 30px',
                  borderBottom: '4px solid #f0f0f0',
                  color: '#555657',
                  fontSize: '14px',
                  fontWeight: 400,
                  fontFamily: 'PingFangSC-Semibold',
                }}
              >
                {meta.breadcrumb.map((e, i) => {
                  return (
                    <Breadcrumb.Item
                      key={i}
                      className={
                        e.active
                          ? 'active-bread bread-normal'
                          : e.path
                          ? 'bread-normal bread-click'
                          : 'bread-normal'
                      }
                      onClick={() => handleBreadClick(e)}
                    >
                      {e.label}
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
            ) : (
              <></>
            )}
            <div
              className={
                meta && meta.breadcrumb
                  ? Styles.contentWrappeB
                  : Styles.contentWrapper
              }
              style={{ background: '#f6f8fb' }}
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
