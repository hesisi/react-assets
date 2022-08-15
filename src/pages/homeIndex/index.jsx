import React, { Component } from 'react';

// 引入图片
import HomeManage from '../../assets/icons/u30.png';
import MenuManage from '../../assets/icons/u36.png';
import ActivityManage from '../../assets/icons/u42.png';
import ReportManage from '../../assets/icons/u48.png';
import './index.less';
export default class Home extends Component {
  state = {
    routerList: [
      {
        title: '主页管理',
        icon: HomeManage,
        path: '/',
        description:
          '报表管理可以帮助您报表可以总括地、系统地反映企业的财务收支情况和经营成果,有利于考核企 业、单位的财务、成本计划或预算的执行情况........',
      },
      {
        title: '菜单管理',
        icon: MenuManage,
        path: '/menuManage',
        description:
          '报表管理可以帮助您报表可以总括地、系统地反映企业的财务收支情况和经营成果,有利于考核企 业、单位的财务、成本计划或预算的执行情况........',
      },
      {
        title: '流程管理',
        icon: ActivityManage,
        path: '/activityManage',
        description:
          '报表管理可以帮助您报表可以总括地、系统地反映企业的财务收支情况和经营成果,有利于考核企 业、单位的财务、成本计划或预算的执行情况........',
      },
      {
        title: '报表管理',
        icon: ReportManage,
        path: '/',
        isExternal: true,
        href: '',
        description:
          '报表管理可以帮助您报表可以总括地、系统地反映企业的财务收支情况和经营成果,有利于考核企 业、单位的财务、成本计划或预算的执行情况........',
      },
    ],
  };
  goToOtherPage = (data) => {
    if (data.isExternal) {
      window.open('http://localhost:9996/tool-datav/index');
    }
    this.props.history.push({ pathname: data.path });
    // console.log(data);
  };
  render() {
    console.log(this);
    let { routerList } = this.state;
    return (
      <div className="homepage">
        <div className="homepage_container">
          <div className="welcomeWord">
            <h1>欢迎来到XXX系统</h1>
            <div>
              点击此处开始<span>配置</span>专属您的APP系统
            </div>
          </div>
          <div className="routerPanel">
            {routerList.map((item) => {
              return (
                <div key={item.title} className="panelItem">
                  <img src={item.icon} alt="logo" />
                  <h1>{item.title}</h1>
                  <div className="description">{item.description}</div>
                  <div
                    className="enter"
                    onClick={() => this.goToOtherPage(item)}
                  >
                    进入
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
