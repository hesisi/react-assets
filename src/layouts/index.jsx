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
import { permissionCode } from '../../config/routesPermission';
import { dealMenuList, newMenu } from '../../config/routesDy';
import Styles from './index.less';
import logo from '@/assets/icons/logo.png';
import { list } from '@/pages/menuManage/menuList/iconBox';
import localForage from 'localforage';
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
let newRoutes = [];
let renderNavBar = [];
// let activeKey = []
// let MenuList = []
// let navBar = []
let firstFw = true;

const getNewRoutes = async () => {
  newRoutes = await dealMenuList();
};

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
  const selectKeyInit = `/${props.location.pathname?.split('/')[1]}`;
  // const historyMenuKey = localStorage.getItem('menuKey');
  const { pathPrefix } = props;
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [selectKey, setSelectKey] = useState(selectKeyInit || []);
  const messagesRef = useRef(null);
  const messagesBellRef = useRef(null);
  // const [newRoutes, setNewRoutes] = useState([])
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
  const [MenuList, setMenuList] = useState(newRoutes || []);
  const [navBar, setNavBar] = useState(renderNavBar || []);
  const [accountName, setAccountName] = useState(
    window.localStorage.getItem('accountName') || '',
  ); // 用户名

  const activePath = props.location.pathname;

  /* 初始化菜单数据 */
  const initMenu = async () => {
    await getNewRoutes();
    newRoutes
      .filter((item) => item.title)
      ?.forEach((item) => {
        // const isHave = newRoutes.find((newItem) => {
        //   return newItem.key === item.key;
        // });
        // if (isHave) {
        renderNavBar.push({
          key: item.address || item.path,
          // key: item.id,
          // label: (
          //   <Link to={item.address || item.path}>
          //     {item.title || item.name}
          //   </Link>
          // ),
          label: permissionCode.includes(item.code) ? (
            <Link to={item.address || item.path}>
              {item.title || item.name}
            </Link>
          ) : (
            <div
              onClick={() => {
                // if (item.name === '动态报表') {
                window.location.href = `http://${window.location.host}${
                  item.address || item.path
                }`;
                // }
              }}
            >
              {item.title || item.name}
            </div>
          ),
          // meta: item.meta,
        });
        // }
      });

    // 左侧菜单树
    renderNavBar = renderNavBar.filter((e) => !e.meta?.navHidden);
    const navBarInit = renderNavBar; // 过滤掉菜单预览
    firstFw = false;
    // MenuList = MenuListInit;
    // navBar = navBarInit;
    // activeKey = navBarInit?.[0]?.key ? [navBarInit?.[0]?.key] : [];
    // initMenuSelect(newRoutes);
    setNavBar(navBarInit);
    // setSelectKey(activeKey);
  };

  const handleClickOutside = (e) => {
    if (
      !(messagesRef?.current && messagesRef?.current?.contains(e.target)) &&
      !(messagesBellRef?.current && messagesBellRef.current.contains(e.target))
    ) {
      setIsShowMessage(false);
    }
  };

  const initMenuSelect = (routes) => {
    if (routes) {
      const curretnItem = routes?.filter((item) => {
        return item.address === selectKeyInit || item.path === selectKeyInit;
      });
      setSelectKey(
        historyMenuKey
          ? JSON.parse(historyMenuKey)
          : curretnItem?.[0]?.id
          ? [curretnItem[0].id]
          : [],
      );
    }
  };

  useEffect(() => {
    if (firstFw) {
      initMenu();
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (newRoutes?.length) {
      const curretnItem = newRoutes?.filter((item) => {
        return item.address === pathPrefix;
      });
      const MenuListInit =
        (curretnItem && curretnItem[0] && curretnItem[0].children) || [];
      setMenuList(MenuListInit);
    }
  }, [newRoutes, pathPrefix]);

  // judgeMunuChild(children[0].children)) ||
  // [];

  // 递归遍历左侧菜单
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

  const renderItems = function (listA = []) {
    return listA.map((item, index) => {
      if (item.title || item.name) {
        return {
          key: item.address || item.path,
          // key: item.id,
          icon:
            (item?.icon && item.icon * 1 > 0) ||
            (item?.icon && item?.icon === '0')
              ? React.createElement(list[item.icon * 1])
              : null,
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

  /* todo: 根据path来找meto */
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

  const handleBreadClick = (item) => {
    if (item?.path) {
      history.push(item.path);
    }
  };

  const onHClick = (e) => {
    // localStorage.setItem('menuKey', JSON.stringify([e.key]));
    setSelectKey([e.key]);
  };

  const clearMenu = async () => {
    await localForage.removeItem('menuTreePermission');
    // localStorage.removeItem('menuKey');
    firstFw = true;
    newRoutes = [];
    renderNavBar = [];
  };

  // 退出
  const loginOut = async () => {
    window.localStorage.removeItem('loginToken');
    clearMenu();
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
              onClick={() => loginOut()}
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
      {navBar?.length ? (
        <>
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
              onClick={onHClick}
              selectedKeys={selectKey}
              // defaultSelectedKeys={[selectKey]}
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
                          <div
                            className="message_item"
                            onClick={goToMessageCenter}
                          >
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
                <div>
                  <QuestionCircleOutlined
                    style={{
                      color: '#ffffff',
                      fontSize: '16px',
                      marginRight: '30px',
                      verticalAlign: 'middle',
                      // marginTop: '5px',
                    }}
                  />
                </div>

                {/* <div
                  className="bell_tips"
                  onClick={showMessages}
                  ref={messagesBellRef}
                  style={{ marginRight: '30px' }}
                >
                  <Badge dot={true}  */}
                <div
                  style={{ marginRight: '30px' }}
                  onClick={showMessages}
                  ref={messagesBellRef}
                >
                  <Badge dot={true}>
                    <BellOutlined
                      style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        cursor: 'pointer',

                        verticalAlign: 'middle',
                      }}
                    />
                  </Badge>
                </div>
                {/* </Badge> */}

                {/* <p>{messageList.length > 99 ? '99+' : messageList.length}</p>
                    <p>99+</p> */}
                {/* </div> */}

                <Dropdown overlay={menu} trigger={['click']}>
                  <div className={'user-detail'}>
                    <Space size={10}>
                      <Avatar
                        src="https://joeschmoe.io/api/v1/random"
                        size={18}
                      />
                      {/* <Avatar icon={<UserOutlined />} size={20} /> */}
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
                  display:
                    (meta && !meta?.showMenu) || meta === undefined
                      ? 'none'
                      : 'block',
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
        </>
      ) : null}
    </Layout>
  );
};

export default withRouter(CommonLayout);
