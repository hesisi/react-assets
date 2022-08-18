import {
  Breadcrumb,
  Button,
  Divider,
  Input,
  Layout,
  Table,
  Col,
  Row,
} from 'antd';
const { Header, Content, Sider } = Layout;
import Modeler from 'bpmn-js/lib/Modeler';

import { xmlStr } from '../xml/Xml1';

import { useEffect, useRef, useState } from 'react';
import './index.less';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
/*右边属性控制栏*/
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';

import PropertiesPanel from '../../../components/properties-panel';
import customModdleExtension from '../../../components/properties-panel/custom.json';

import { Link } from 'umi';
import {
  LeftOutlined,
  MinusOutlined,
  StopOutlined,
  SaveOutlined,
  SendOutlined,
  CheckSquareOutlined,
  CloseOutlined,
} from '@ant-design/icons';

export default function IndexPage() {
  const [flow, setFlow] = useState(null);
  const refContainer = useRef();
  const refPanel = useRef();
  let modeler;
  /**
   * Save diagram contents and print them to the console.
   */
  async function exportDiagram() {
    try {
      var result = await modeler.saveXML({ format: true });
      alert('Diagram exported. Check the developer tools!');
      console.log('DIAGRAM', result.xml);
    } catch (err) {
      console.error('could not save BPMN 2.0 diagram', err);
    }
  }
  useEffect(() => {
    const flow = window.localStorage.getItem('flow');
    setFlow(flow ? JSON.parse(flow) : null);
    modeler = new Modeler({
      container: '#canvas',
      width: '100%', // 查看器宽度
      height: '100%', // 查看器高度
      propertiesPanel: {
        parent: '#panel',
      },
      // additionalModules: [
      //   BpmnPropertiesPanelModule,
      //   BpmnPropertiesProviderModule,
      // ],
      moddleExtensions: {
        custom: customModdleExtension,
      },
      keyboard: {
        bindTo: document.body,
      },
    });
    const propertiesPanel = new PropertiesPanel({
      container: refPanel.current,
      modeler,
      flow,
    });
    modeler.importXML(xmlStr);
  }, []);

  return (
    <Layout
      style={{ padding: '10px', backgroundColor: '#f2f2f2', height: '100%' }}
    >
      <Header style={{ padding: '0 10px', backgroundColor: '#fff' }}>
        <Row>
          <Col span={8}>
            <Link to="/activityManage">
              <LeftOutlined />
              返回
            </Link>
          </Col>
          <Col span={8}>{flow?.name}</Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              style={{ marginRight: '10px' }}
            >
              保存
            </Button>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              icon={<SendOutlined />}
            >
              发布
            </Button>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              icon={<CheckSquareOutlined />}
            >
              启用
            </Button>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              icon={<StopOutlined />}
            >
              停用
            </Button>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              icon={<CloseOutlined />}
            >
              删除
            </Button>
          </Col>
        </Row>
      </Header>
      <Layout
        style={{
          padding: '0 10px',
          backgroundColor: '#ffffff',
          marginTop: 10,
        }}
      >
        <Content
          className="site-layout-background"
          style={{
            padding: 0,
            margin: 0,
            minHeight: 280,
          }}
        >
          <div className={'main-container'}>
            <div ref={refContainer} id="canvas" className="container" />
            <div ref={refPanel} id="panel" className={'panel'}></div>
            <div
              className={'action-cont'}
              style={{ position: 'absolute', bottom: '20px', left: '20px' }}
            >
              <a onClick={exportDiagram}>下载</a>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
