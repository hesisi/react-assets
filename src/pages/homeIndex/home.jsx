import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'element-theme-default';
import { Carousel } from 'element-react';
import './home.less';
import { nanoid } from 'nanoid';
import { Divider } from 'antd';
import { DownCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import HomePage from '@/pages/previewPage/homePage';

const banner = [
  {
    bg: require('../../assets/images/主页管理.png'),
    title: '主页管理',
    id: nanoid(),
    description:
      '主页管理提供各色组件，让您可以自由配置您想要的主页，方便各类信息的即时观测，实现个性化需求。',
    icon: require('../../assets/icons/u30.png'),
    en: 'Home Management',
    url: '/pageManage/homePage',
  },
  {
    bg: require('../../assets/images/报表管理.png'),
    title: '报表管理',
    id: nanoid(),
    description:
      '报表管理可以帮助您报表可以总括地、系统地反映企业的财务收支情况和经营成果,有利于考核企 业、单位的财务、成本计划或预算的执行情况........',
    icon: require('../../assets/icons/u48.png'),
    en: 'Statement Management',
    url: '/dyformManage/formCreate',
  },
  {
    bg: require('../../assets/images/流程管理.png'),
    title: '流程管理',
    id: nanoid(),
    description:
      '在流程管理中，您可以拖拽不同的组件后，定义各个流程节点，完成构建您专属的业务流程。',
    icon: require('../../assets/icons/u42.png'),
    en: 'Process Management',
    url: '/activityManage/activityList',
  },
  {
    bg: require('../../assets/images/菜单管理.png'),
    title: '菜单管理',
    id: nanoid(),
    description:
      '您通过菜单模块可以新建菜单、修改菜单、删除菜单、查看菜单详情、以及通过权限控制，定义不同角色可查看的菜单内容。',
    icon: require('../../assets/icons/u36.png'),
    en: 'Menu Management',
    url: '/menuManage/menuList',
  },
  {
    bg: require('../../assets/images/表单管理.png'),
    title: '表单管理',
    id: nanoid(),
    description:
      '表单管理提供丰富的表单组件，帮助您进行高度自由的表单配置，以满足不同的需求。',
    icon: require('../../assets/icons/u49.png'),
    en: 'Form Management',
    url: '/formManage/formList',
  },
  {
    bg: require('../../assets/images/消息中心bg.png'),
    title: '消息中心',
    id: nanoid(),
    description:
      '消息中心会通知您关于系统的各类消息，让您能及时得到各类信息的进度状态，并及时进行处理。',
    icon: require('../../assets/icons/u50.png'),
    en: 'Notification Center',
    url: '/notificationCenter/notificationList',
  },
];

const home = () => {
  const [curIndex, setCurIndex] = useState(-1);
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(window.localStorage.getItem('isHome'));
  }, []);

  useEffect(() => {
    // const arr = document.getElementsByClassName('el-carousel__item');
    // const tranArr = Array.from(arr).map((item, index) => {
    //   return Number(item.style.transform.split(' ')[0].slice(11, -3)) * 0.5;
    // });
    // Array.from(arr).forEach((item, index) => {
    //   item.style.transform = `translateX(${tranArr[index]}px) ${
    //     item.style.transform.split(' ')[1]
    //   }`;
    //   return item;
    // });
  });

  const changeHandler = (index) => {
    setCurIndex(index);
  };

  const enterHandler = (url) => {
    history.push(url);
  };
  return (
    <div className="demo-4 medium">
      {isHome ? (
        <HomePage />
      ) : (
        <div className="home">
          <p className="home-title">欢迎进入Connectivity Asset</p>
          <div className="home-carousel">
            <Carousel
              type="card"
              height="700px"
              onChange={changeHandler}
              autoplay={false}
              arrow="never"
            >
              {/* style={{ width: '25%', margin: '0 auto', overflowX: 'unset' }} */}
              {banner.map((item, index) => {
                return (
                  <Carousel.Item key={item.id}>
                    <div
                      className="home-carousel__box"
                      style={{ backgroundImage: `url(${item.bg})` }}
                    >
                      {/* <img src={item.bg}></img> */}
                      <div className="carousel-box__icon">
                        <img src={item.icon} width={70}></img>
                      </div>
                      <div className="carousel-box__text">
                        <p className="text-title">{item.title}</p>
                        <p className="text-en">{item.en}</p>
                        <Divider />
                        <p className="text-des" style={{ margin: 'auto' }}>
                          {item.description}
                        </p>
                        {curIndex === index ? (
                          <DownCircleOutlined
                            style={{ color: '#3A63FF', fontSize: '28px' }}
                            className="text-icon"
                            onClick={() => {
                              enterHandler(item.url);
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default home;
