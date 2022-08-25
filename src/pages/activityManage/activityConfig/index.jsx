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

import { useEffect, useMemo, useRef, useState } from 'react';
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

/**汉化*/
import customTranslate from './translate/customTranslate';
const customTranslateModule = {
  translate: ['value', customTranslate],
};
import { Link, history, useLocation } from 'umi';
import {
  LeftOutlined,
  MinusOutlined,
  StopOutlined,
  SaveOutlined,
  SendOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { nanoid } from 'nanoid';
import moment from 'moment';
// import flowbg from '@/assets/flow_bg.png'

export default function IndexPage() {
  const location = useLocation();
  const refContainer = useRef();
  const refPanel = useRef();
  const [modeler, setModeler] = useState(null);
  const [group, setGroup] = useState([]);
  const [flowMsg, setFlowMsg] = useState(null);

  let flow = useMemo(() => {
    return null;
  }, []);
  const getFlow = (group) => {
    let _flow = {};
    if (group) {
      _flow = group.find((x) => x.id === location.query.flowID);
    } else {
      _flow = null;
    }
    flow = _flow;
    setFlowMsg(_flow);
  };
  useEffect(() => {
    const _flowGroup = window.localStorage.getItem('flowGroup');
    const group = _flowGroup ? JSON.parse(_flowGroup) : [];
    // console.log(group)
    setGroup(group);
    getFlow(group);
    // setFlow(_flow ? JSON.parse(_flow) : null);
    const modeler = new Modeler({
      container: '#canvas',
      width: '100%', // 查看器宽度
      height: '100%', // 查看器高度
      propertiesPanel: {
        parent: '#panel',
      },
      additionalModules: [
        // BpmnPropertiesPanelModule,
        // BpmnPropertiesProviderModule,
        customTranslateModule,
      ],
      moddleExtensions: {
        custom: customModdleExtension,
      },
      keyboard: {
        bindTo: document.body,
      },
    });
    // console.log(flow);
    const propertiesPanel = new PropertiesPanel({
      container: refPanel.current,
      modeler,
      flowMsg: flow,
    });
    // console.log(flow?.xml)
    modeler.importXML(flow?.xml || xmlStr);
    setModeler(modeler);
  }, [flow]);

  /**
   * Save diagram contents and print them to the console.
   */
  async function exportDiagram() {
    try {
      var result = await modeler.saveXML({ format: true });
      // console.log('DIAGRAM', result.xml);
      const _flow = { ...flowMsg };
      _flow.xml = result.xml;
      _flow.creatTime = moment().format('YYYY-MM-DD HH:mm:ss');
      _flow.status = 'status';
      _flow.updateTime = _flow.creatTime
        ? moment().format('YYYY-MM-DD HH:mm:ss')
        : '';
      // window.localStorage.setItem('flow',JSON.stringify(_flow));
      const tempGroup = group.map((x) => {
        if (x.id === _flow.id) {
          x = { ..._flow };
        }
        return x;
      });
      window.localStorage.setItem('flowGroup', JSON.stringify(tempGroup));
      history.push('/activityManage');
    } catch (err) {
      console.error('could not save BPMN 2.0 diagram', err);
    }
  }
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
          <Col span={8}>{flowMsg?.name}</Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={exportDiagram}
            >
              保存
            </Button>
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              icon={<DeleteOutlined />}
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
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
