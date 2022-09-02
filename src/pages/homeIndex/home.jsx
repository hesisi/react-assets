import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCreative, Autoplay } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './home.less';
import { Divider } from 'antd';
import { DownCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import HomePage from '@/pages/previewPage/homePage';
import { nanoid } from 'nanoid';

export default function Home(params) {
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

  const [curIndex, setCurIndex] = useState(-1);
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(window.localStorage.getItem('isHome'));
  }, []);

  const onSlideChange = (ele) => {
    setCurIndex(ele.realIndex);
  };

  const enterHandler = (url) => {
    history.push(url);
  };

  const onClick = (ele) => {
    console.log(ele);
  };

  return (
    <div className="home-container">
      <p className="home-title">欢迎进入Connectivity Asset</p>
      <div className="home-carousel">
        <Swiper
          //  activeIndex={banner}
          onSlideChange={onSlideChange}
          onClick={onClick}
          key={banner.length}
          pagination={{
            clickable: true, //设置是否可以点击
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          centeredSlides={true}
          loop={true} //设置循环轮播
          spaceBetween={-250} //设置堆叠轮播，item之间叠的距离
          slidesPerView={5} //设置显示的数量
          zoom={true}
          navigation={true}
          // grabCursor={true}
          modules={[Navigation, Pagination, EffectCreative, Autoplay]}
          effect={'creative'} //modules上加了同时要设置
          creativeEffect={{
            prev: {
              //这里是设置当前item的前一项的具体属性
              translate: [-230, 0, 0], //偏移量
              scale: 0.9, //缩放量
              opacity: 1, //透明度
            },
            next: {
              //这里是设置当前item的后一项的具体属性，同上面
              translate: [230, 0, 0],
              scale: 0.9,
              opacity: 1,
            },
            limitProgress: 2, //显示五个堆叠的最重要的这个属性，后面依次以前面属性等比配置
          }}
        >
          {banner.map((item, index) => (
            <SwiperSlide key={index} style={{ position: 'relative' }}>
              <div
                className="home-swiper"
                style={{
                  backgroundImage: `url(${item.bg})`,
                }}
              >
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
