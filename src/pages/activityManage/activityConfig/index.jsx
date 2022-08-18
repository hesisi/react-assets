/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 11:06:46
 */
import { Table, Button } from 'antd';
import BpmnViewer from 'bpmn-js';
import Modeler from 'bpmn-js/lib/Modeler';
/*属性栏组件*/
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

import { xmlStr } from '../xml/Xml1';
// import pizzaDiagram from './xml/pizza-collaboration.bpmn';
import { useEffect, useRef } from 'react';
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

export default function IndexPage() {
  const refContainer = useRef();
  const refPanel = useRef();
  useEffect(() => {
    const modeler = new Modeler({
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
    });
    modeler.importXML(xmlStr);
  });

  return (
    <div className={'main-container'}>
      <div ref={refContainer} id="canvas" className="container" />
      <div ref={refPanel} id="panel" className={'panel'}></div>
    </div>
  );
}
