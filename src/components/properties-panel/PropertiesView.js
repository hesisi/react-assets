import { is, getBusinessObject, getDi } from 'bpmn-js/lib/util/ModelUtil';
import { Collapse } from 'antd';
import { Form, Input } from 'antd';
const { Panel } = Collapse;
import React, { Component } from 'react';

import './PropertiesView.css';

export default class PropertiesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedElements: [],
      element: null,
    };
  }

  init = (modeler) => {
    const bpmnFactory = modeler.get('bpmnFactory'),
      elementFactory = modeler.get('elementFactory'),
      elementRegistry = modeler.get('elementRegistry'),
      modeling = modeler.get('modeling');
    console.log(bpmnFactory);
  };
  componentDidMount() {
    const { modeler } = this.props;
    this.init(modeler);
    modeler.on('selection.changed', (e) => {
      const { element } = this.state;

      this.setState({
        selectedElements: e.newSelection,
        element: e.newSelection[0],
      });
    });

    modeler.on('element.changed', (e) => {
      const { element } = e;

      const { element: currentElement } = this.state;

      if (!currentElement) {
        return;
      }

      // update panel, if currently selected element changed
      if (element.id === currentElement.id) {
        this.setState({
          element,
        });
      }
    });
  }

  render() {
    const { modeler, flow } = this.props;

    const { selectedElements, element } = this.state;

    return (
      <div>
        <div className="element-properties">
          <h3 className={'panel-tittle'}>属性</h3>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="常规" key="1">
              {selectedElements.length === 1 && (
                <ElementProperties modeler={modeler} element={element} />
              )}

              {/*{selectedElements.length === 0 && (*/}
              {/*  <span>Please select an element.</span>*/}
              {/*)}*/}

              {selectedElements.length > 1 && (
                <span>Please select a single element.</span>
              )}
            </Panel>
            <Panel header="申请人" key="2">
              <p>{'dddd'}</p>
            </Panel>
            {selectedElements.length === 1 ? (
              <>
                <Panel header="表单" key="3">
                  <a
                    onClick={() => {
                      alert('创建表单');
                    }}
                  >
                    create form
                  </a>
                </Panel>
              </>
            ) : null}
          </Collapse>
        </div>
      </div>
    );
  }
}

function ElementProperties(props) {
  let { element, modeler } = props;

  if (element.labelTarget) {
    element = element.labelTarget;
  }

  function updateName(name) {
    const modeling = modeler.get('modeling');

    modeling.updateLabel(element, name);
  }

  function updateTopic(topic) {
    const modeling = modeler.get('modeling');

    modeling.updateProperties(element, {
      'custom:topic': topic,
    });
  }

  function makeMessageEvent() {
    const bpmnReplace = modeler.get('bpmnReplace');

    bpmnReplace.replaceElement(element, {
      type: element.businessObject.$type,
      eventDefinitionType: 'bpmn:MessageEventDefinition',
    });
  }

  function makeServiceTask(name) {
    const bpmnReplace = modeler.get('bpmnReplace');

    bpmnReplace.replaceElement(element, {
      type: 'bpmn:ServiceTask',
    });
  }

  function attachTimeout() {
    const modeling = modeler.get('modeling');
    const autoPlace = modeler.get('autoPlace');
    const selection = modeler.get('selection');

    const attrs = {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
    };

    const position = {
      x: element.x + element.width,
      y: element.y + element.height,
    };

    const boundaryEvent = modeling.createShape(attrs, position, element, {
      attach: true,
    });

    const taskShape = append(boundaryEvent, {
      type: 'bpmn:Task',
    });

    selection.select(taskShape);
  }

  function isTimeoutConfigured(element) {
    const attachers = element.attachers || [];

    return attachers.some((e) => hasDefinition(e, 'bpmn:TimerEventDefinition'));
  }

  function append(element, attrs) {
    const autoPlace = modeler.get('autoPlace');
    const elementFactory = modeler.get('elementFactory');

    var shape = elementFactory.createShape(attrs);

    return autoPlace.append(element, shape);
  }

  return (
    <div key={element.id}>
      <fieldset>
        <label>id</label>
        <span>{element.id}</span>
      </fieldset>

      <fieldset>
        <label>节点名称</label>
        <input
          value={element.businessObject.name || ''}
          onChange={(event) => {
            updateName(event.target.value);
          }}
        />
      </fieldset>

      {/*<fieldset>*/}
      {/*  <label>表单</label>*/}
      {/*  <a*/}
      {/*    onClick={() => {*/}
      {/*      alert('创建表单');*/}
      {/*      console.log(getBusinessObject(element).$type);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    create form*/}
      {/*  </a>*/}
      {/*</fieldset>*/}
      {/*{is(element, 'custom:TopicHolder') && (*/}
      {/*  <fieldset>*/}
      {/*    <label>topic (custom)</label>*/}
      {/*    <input*/}
      {/*      value={element.businessObject.get('custom:topic')}*/}
      {/*      onChange={(event) => {*/}
      {/*        updateTopic(event.target.value);*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </fieldset>*/}
      {/*)}*/}

      {/*<fieldset>*/}
      {/*  <label>actions</label>*/}

      {/*  {is(element, 'bpmn:Task') && !is(element, 'bpmn:ServiceTask') && (*/}
      {/*    <button onClick={makeServiceTask}>Make Service Task</button>*/}
      {/*  )}*/}

      {/*  {is(element, 'bpmn:Event') &&*/}
      {/*    !hasDefinition(element, 'bpmn:MessageEventDefinition') && (*/}
      {/*      <button onClick={makeMessageEvent}>Make Message Event</button>*/}
      {/*    )}*/}

      {/*  {is(element, 'bpmn:Task') && !isTimeoutConfigured(element) && (*/}
      {/*    <button onClick={attachTimeout}>Attach Timeout</button>*/}
      {/*  )}*/}
      {/*</fieldset>*/}
    </div>
  );
}

// helpers ///////////////////

function hasDefinition(event, definitionType) {
  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some((d) => is(d, definitionType));
}
