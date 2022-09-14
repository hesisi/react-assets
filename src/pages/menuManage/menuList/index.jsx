/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 11:05:37
 */
import { Button, Col, Row, message, Layout } from 'antd';
import { EyeOutlined, FileDoneOutlined, LeftOutlined } from '@ant-design/icons';
import './index.less';
import ConfigPanel from './configPanel';
import MenuTree from './menuTree';
import MenuConfig from './menuConfig';
import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import eventBus from '../../../utils/eventBus';
import localForage from 'localforage';
import { list } from './iconBox';
import { cloneDeep } from 'lodash';

const back = require('@/assets/icons/back2.svg');
const { Header, Footer, Sider, Content } = Layout;
export default function IndexPage() {
  // 如果从预览页面过来,先取预览页面数据
  let pageDataPrev = localStorage.getItem('pageDataPrev');
  let formDataInit = null;
  if (pageDataPrev && typeof pageDataPrev === 'string') {
    // formDataPrev 和 formData对应
    pageDataPrev = JSON.parse(pageDataPrev) || {};
    formDataInit = pageDataPrev.formDataPrev;
  }

  const formRef = useRef(null);
  const configPanelRef = useRef(null);
  const [config, setConfig] = useState(null); // 配置面板相关
  const [submitFlag, setSubmitFlag] = useState(false); // 提交标识
  const [tree, setTree] = useState([]); // 结点数
  const [formData, setForm] = useState(formDataInit); // 配置面板

  const [menuConfig, setMenuConfig] = useState({
    mode: 'horizontalAndVertical',
    theme1: 'light',
    theme2: 'dark',
    type: 'inline',
  }); //菜单配置

  const menuConfigRef = useRef(null);

  const configSubmit = (formValue, comIcons, iconIndex) => {
    localStorage.setItem(
      'pageDataPrev',
      JSON.stringify({
        formDataPrev: {
          ...formData,
          formValue: {
            ...formData.formValue,
            ...formValue,
            iconIndex,
          },
        },
      }),
    );
    // 配置面板提交
    setConfig({ formValue, comIcons, iconIndex });
    setSubmitFlag(!submitFlag);
  };

  const history = useHistory();
  const previewHandler = () => {
    // if (!(tree?.[0]?.children && tree?.[0].children.length)) {
    //   message.warning('请先配置菜单!');
    //   return;
    // }
    // 页面预览
    const temp = (data) => {
      // 回调处理menu所需参数label
      data.forEach((item) => {
        item.label = item.title;
        item['icon'] =
          item.iconIndex >= 0
            ? React.createElement(list[item.iconIndex])
            : null;
        delete item.iconIndex;
        delete item.isEdit;
        delete item.formValue;
        delete item.comIcon;
        if (item.children?.length > 0) {
          temp(item.children);
        }
      });
      return data;
    };
    // temp(tree);
    eventBus.emit('setTree', temp(cloneDeep(tree)[0].children), menuConfig);
    window.localStorage.setItem('menuConfig', JSON.stringify(menuConfig)); // 存入localStorage
    history.push('/previewPage/menuPreview');
  };

  const previewSave = (isPreview) => {
    if (!formRef?.current) {
      saveMenuLoad(isPreview);
      return;
    }
    formRef.current
      ?.validateFields()
      .then((values) => {
        configPanelRef.current.onFinish(values);
        saveMenuLoad(isPreview);
      })
      .catch(() => {
        message.warning('请先检查当前菜单信息配置是否正确!');
        return;
      });
  };

  const saveMenuLoad = (isPreview) => {
    if (!(tree?.[0]?.children && tree?.[0].children.length)) {
      message.warning('请先配置菜单!');
      return;
    }
    let munuListDataSave = JSON.parse(
      window.localStorage.getItem('munuListData'),
    );
    const newKeys = [];
    const temp = (data) => {
      // 回调处理menu所需参数label
      data.forEach((item) => {
        newKeys.push(item.key);
        // const findItem = munuListDataSave.find(itemMu => { return itemMu.key === item.key })
        // if (findItem) {
        //   munuListDataSave = munuListDataSave.filter(
        //     (itemF) => itemF.key !== item.key,
        //   );
        //   munuListDataSave.push({
        //     ...findItem,
        //     name: item.title,
        //     path: item.address || findItem.path,
        //     // icon: icon 调整
        //   });
        //   delete item.icon;
        // } else {
        //   /* 新增 */
        //   if (item.oper) {
        //     munuListDataSave.push({
        //       ...item,
        //       path: item.address,
        //       name: item.title,
        //       //  icon
        //     });
        //   }
        //   delete item.icon;
        // }
        delete item.icon;
        if (item.children?.length > 0) {
          temp(item.children);
        }
      });
      return data;
    };
    const treeDataSave = temp(cloneDeep(tree));

    localForage.setItem('menuTree', treeDataSave);
    // munuListDataSave = munuListDataSave.filter((item) => newKeys.includes(item.key));
    // localStorage.setItem('munuListData', JSON.stringify(munuListDataSave));
    if (isPreview) {
      // localStorage.setItem('pageDataPrev', JSON.stringify({
      //   formDataPrev: formData
      // }));
      previewHandler(); // 跳转到预览页面
    } else {
      localStorage.removeItem('pageDataPrev');
      localStorage.setItem('munuListTreeData', JSON.stringify(treeDataSave));
      message.success('菜单保存成功!');
      location.reload();
    }
  };

  const nodeClear = () => {
    // 结点清空
    eventBus.emit('nodeClear', []);
    setForm({
      formValue: {},
      comIcons: {},
      isEdit: false,
    });
  };
  const configClear = () => {
    // 配置缓存清空
    menuConfigRef.current.resetFields();
    window.localStorage.removeItem('menuConfig');
  };

  const handleBack = () => {
    /* 主页暂无先回到欢迎页 */
    history.push('/homeIndex');
  };

  return (
    <div className="menu">
      <div className="menu-wrapper">
        <Row justify="space-between" align="middle" className="menu-top">
          <Col span={4}>
            <span className="back-wrapper" onClick={() => handleBack()}>
              <LeftOutlined />
              主页
            </span>
          </Col>
          <Col span={4} className="menu__btn-preview">
            <Button
              type="primary"
              icon={<FileDoneOutlined />}
              onClick={() => previewSave()}
            >
              保存
            </Button>
            <Button icon={<EyeOutlined />} onClick={() => previewSave(true)}>
              预览
            </Button>
          </Col>
        </Row>
        <div className="menu-config">
          <Layout className={'user-cont list-layout'}>
            <Sider className={' menu-left'} width={300}>
              <div className="col-wrapper">
                <div className="menu-config__tree">
                  <span>菜单管理</span>
                  {/* <Button onClick={nodeClear}>清空结点</Button> */}
                </div>
                <MenuTree
                  config={config}
                  setTree={setTree}
                  setForm={setForm}
                  submitFlag={submitFlag}
                />
              </div>
            </Sider>
            <Content style={{ height: '100%' }}>
              <div className="col-wrapper col-info">
                <span
                  className="menu-config__info"
                  style={{ marginLeft: '25px' }}
                >
                  菜单信息
                </span>
                <ConfigPanel
                  formRef={formRef}
                  ref={configPanelRef}
                  configSubmit={(values, iconSelect, iconIndex) =>
                    configSubmit(values, iconSelect, iconIndex)
                  }
                  formData={formData}
                />
              </div>
            </Content>
            {/* <Row wrap>
            <Col span={6} className="menu-left" style={{ width: '300px' }}>

            </Col>
            <Col span={18}>

            </Col>
          </Row> */}
          </Layout>
        </div>
      </div>
    </div>
  );
}
