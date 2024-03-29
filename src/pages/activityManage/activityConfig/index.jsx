import {
  Breadcrumb,
  Button,
  Divider,
  Input,
  Layout,
  Table,
  Col,
  Row,
  message,
  Modal,
} from 'antd';
const { Header, Content, Sider } = Layout;
const { confirm } = Modal;
import Modeler from 'bpmn-js/lib/Modeler';

// import { xmlStr } from '../xml/Xml1';

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
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { nanoid } from 'nanoid';
import moment from 'moment';

// import flowbg from '@/assets/flow_bg.png'
import { saveActivity, startActivity, getXml } from '@/services/activityManage';

export default function IndexPage(props) {
  const location = useLocation();
  const refContainer = useRef();
  const refPanel = useRef();
  const [modeler, setModeler] = useState(null);
  const [group, setGroup] = useState([]);
  const [flowMsg, setFlowMsg] = useState(null);
  const isCreate = props?.location?.query?.isCreate;

  useEffect(() => {
    // console.log('-------------->');
    // console.log(flowMsg);
    flow = flowMsg;
  }, [flowMsg]);
  const updateFlow = (data) => {
    console.log(data);
    const temp = { ...data };
    setFlowMsg(temp);
  };
  let flow = useMemo(() => {
    return null;
  }, []);
  const getFlow = (group) => {
    let _flow = {};
    if (group) {
      _flow = group.find((x) => x.processId === location.query.processId);
    } else {
      _flow = null;
    }
    // console.log(_flow);
    flow = _flow;
    setFlowMsg(_flow);
  };
  useEffect(() => {
    const _flowGroup = window.localStorage.getItem('flowGroup');
    const group = _flowGroup ? JSON.parse(_flowGroup) : [];
    const _formList = window.localStorage.getItem('formList');
    const forms = _formList ? JSON.parse(_formList) : [];
    // console.log(group);
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
    console.log('flow++++++++++++++', flow);
    const propertiesPanel = new PropertiesPanel({
      container: refPanel.current,
      modeler,
      flowMsg: flow,
      forms: forms,
      setFlowMsg: updateFlow,
    });
    let xml = getCurrentXml();
    console.log('currentXML++++++++++++++++++++', xml);

    // todo 有时候xml无法被bpmn解析
    modeler.importXML(xml);
    setModeler(modeler);
  }, [flow]);

  /**
   * Save diagram contents and print them to the console.
   */
  async function exportDiagram() {
    try {
      var result = await modeler.saveXML({ format: true });
      console.log('DIAGRAM', result.xml);
      const _flow = { ...flowMsg };
      _flow.xml = result.xml;
      _flow.creatTime = moment().format('YYYY-MM-DD HH:mm:ss');
      _flow.status = 'disabled';
      _flow.updateTime = _flow.creatTime
        ? moment().format('YYYY-MM-DD HH:mm:ss')
        : '';
      // window.localStorage.setItem('flow',JSON.stringify(_flow));
      const tempGroup = group.map((x) => {
        if (x.processId === _flow.processId) {
          x = { ..._flow };
        }
        return x;
      });
      window.localStorage.setItem('flowGroup', JSON.stringify(tempGroup));
      // history.push('/activityManage');
      let processId = window.localStorage.getItem('processId');
      message.success('保存成功');
      const parmas = {
        bpmnDataStr: _flow.xml,
        bpmnName: _flow.processName,
        // todo
        processId: processId,
      };
      console.log(parmas);
      console.log(_flow);

      saveActivity(parmas).then((res) => {
        if (res.data.isSuccess > 0) {
          message.success('保存成功');
          startActivity({
            processId: res.data?.data,
            userId: 'caiiyun',
          }).then((res) => {
            if (res.data.isSuccess > 0) {
              message.success('启动流程成功');
            }
          });
        }
      });
    } catch (err) {
      console.error('could not save BPMN 2.0 diagram', err);
    }
  }
  const getCurrentXml = () => {
    let processName = props?.location?.query?.processName;
    let processId = props?.location?.query?.processId;

    if (isCreate) {
      let xmlTemp = xmlStr(processId, processName);
      return xmlTemp;
    } else {
      getXml(processName)
        .then((res) => {
          if (res?.data.isSuccess > 0) {
            const { data } = res.data;
            return data.xml;
          } else {
          }
        })
        .catch((err) => {
          message.error(err);
        });
    }
  };

  const handleDel = () => {
    confirm({
      title: '确定要删除流程吗?',
      icon: <ExclamationCircleOutlined />,
      content: '该操作不可逆，请谨慎操作！',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const xmlStr = (processId, name) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="5.1.2">
        <process id="${processId}" name="${name}" isExecutable="true" >
        </process>
        <bpmndi:BPMNDiagram id="BpmnDiagram_1">
          <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1" >
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </definitions>`;
  };

  return (
    <Layout
      style={{
        padding: '10px',
        backgroundColor: '#f2f2f2',
        height: 'calc(100vh - 60px)',
      }}
    >
      <Header style={{ padding: '0 10px', backgroundColor: '#fff' }}>
        <Row>
          <Col span={8}>
            <Link to="/activityManage">
              <LeftOutlined />
              返回
            </Link>
          </Col>
          <Col span={8}>{flowMsg?.processName}</Col>
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
              onClick={handleDel}
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
