/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 11:05:31
 */
import { Row, Col, Button, Menu, Space } from 'antd';
import './index.less';
import ComponentsBox from './componentsBox';
import PageForm from './pageForm';
import PagePanel from './pagePanel';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
export default function IndexPage() {
  const [template, setTemplate] = useState();
  const [comKey, setComKey] = useState([]);
  const [active, setActive] = useState();
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState();
  const [form, setForm] = useState({
    height: '100',
    width: '100',
  });
  const blueList = [
    '#e6f7ff',
    '#bae7ff',
    '#91d5ff',
    '#69c0ff',
    '#40a9ff',
    '#1890ff',
  ];
  const modeEnum = Object.freeze({
    sub1: 'one',
    sub2: 'four',
    sub3: 'five',
  });
  const history = useHistory();
  const previewHandler = () => {
    const pageConfig = {
      template: template,
      comKey: comKey,
      form: form,
    };
    window.localStorage.setItem('pageConfig', JSON.stringify(pageConfig)); // 存入localStorage
    history.push('/previewPage/pagePreview');
  };

  useEffect(() => {
    console.log(comKey);
  }, [comKey]);
  useEffect(() => {
    setItems([
      {
        key: '1',
        label: '模板样式',
        children: [
          { key: 'sub1', label: '单区域' },
          { key: 'sub2', label: '页眉和三区域' },
          { key: 'sub3', label: '上二下三' },
        ],
      },
    ]);
  }, []);
  const onClick = (item) => {
    setTemplate(modeEnum[item.key]);
  };
  return (
    <div className="home">
      <Row justify="end">
        <Col span={22}></Col>
        <Col span={2}>
          <Button type="primary" onClick={previewHandler}>
            预览
          </Button>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col span={4}>
          <p className="home-setting__title">模板</p>
          <Menu
            onClick={onClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
          {/*<div className="home-setting__form">*/}
          {/*  <PageForm setTemplate={setTemplate} setForm={setForm} />*/}
          {/*</div>*/}
        </Col>
        <Col span={16} style={{ paddingTop: 0 }}>
          <PagePanel
            template={template}
            form={form}
            comKey={comKey}
            active={active}
          />
        </Col>
        <Col span={4}>
          <p>组件</p>
          <ComponentsBox
            setComKey={setComKey}
            setActive={setActive}
            comKey={comKey}
          />
        </Col>

        {/* <Col span={4}>
          <p className="home-setting__title">模板</p>
          <div className="home-setting__form">
            <PageForm setTemplate={setTemplate} setForm={setForm} />
          </div>
        </Col> */}
      </Row>
    </div>
  );
}
