/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 11:05:37
 */
import { Button, Col, Row, Breadcrumb } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import './index.less';
import ConfigPanel from './configPanel';
import MenuTree from './menuTree';
import MenuConfig from './menuConfig';
import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import eventBus from '../../../utils/eventBus';

export default function IndexPage() {
  const [config, setConfig] = useState(null); // 配置面板相关
  const [submitFlag, setSubmitFlag] = useState(false); // 提交标识
  const [tree, setTree] = useState([]); // 结点数
  const [formData, setForm] = useState(); // 配置面板

  const [menuConfig, setMenuConfig] = useState({}); //菜单配置

  const menuConfigRef = useRef(null);

  const configSubmit = (formValue, comIcons, iconIndex) => {
    // 配置面板提交
    setConfig({ formValue, comIcons, iconIndex });
    setSubmitFlag(!submitFlag);
  };
  const history = useHistory();
  const previewHandler = () => {
    // 页面预览
    const temp = (data) => {
      // 回调处理menu所需参数label
      data.forEach((item) => {
        item.label = item.title;
        delete item.iconIndex;
        delete item.isEdit;
        delete item.formValue;
        delete item.comIcon;
        if (item.children?.length > 0) {
          temp(item.children);
          return;
        }
      });
    };
    temp(tree);
    eventBus.emit('setTree', tree, menuConfig);
    window.localStorage.setItem('menuConfig', JSON.stringify(menuConfig)); // 存入localStorage
    history.push('/previewPage/menuPreview');
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

  return (
    <div className="menu">
      <Row justify="space-between" align="middle">
        <Col span={4}>
          <Breadcrumb>
            <Breadcrumb.Item>菜单管理</Breadcrumb.Item>
            <Breadcrumb.Item>自定义菜单配置</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={4} className="menu__btn-preview">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => previewHandler()}
          >
            预览
          </Button>
        </Col>
      </Row>

      <div className="menu-config">
        <Row wrap>
          {/* 标题部分 */}
          <Col span={5}>
            <div className="menu-config__tree">
              <span>菜单配置</span>
              <Button onClick={configClear}>重置配置</Button>
            </div>
          </Col>
          <Col span={11}>配置面板</Col>
          <Col span={8}>
            <div className="menu-config__tree">
              <span>结构预览</span>
              <Button onClick={nodeClear}>清空结点</Button>
            </div>
          </Col>

          {/* 内容部分 */}
          <Col span={5}>
            <MenuConfig setMenuConfig={setMenuConfig} ref={menuConfigRef} />
          </Col>
          <Col span={11} className="config-panel__form-box">
            <ConfigPanel
              configSubmit={(values, iconSelect, iconIndex) =>
                configSubmit(values, iconSelect, iconIndex)
              }
              formData={formData}
            />
          </Col>
          <Col span={8}>
            <MenuTree
              config={config}
              setTree={setTree}
              setForm={setForm}
              submitFlag={submitFlag}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
