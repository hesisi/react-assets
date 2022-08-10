/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 11:05:31
 */
import { Row, Col, Button, Space } from 'antd';
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

  const [form, setForm] = useState({
    height: '100',
    width: '100',
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
          <p>组件</p>
          <ComponentsBox
            setComKey={setComKey}
            setActive={setActive}
            comKey={comKey}
          />
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
          <p className="home-setting__title">页面</p>
          <div className="home-setting__form">
            <PageForm setTemplate={setTemplate} setForm={setForm} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
