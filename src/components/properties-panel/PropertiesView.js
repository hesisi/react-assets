import { is, getBusinessObject, getDi } from 'bpmn-js/lib/util/ModelUtil';
import { Collapse, Select, Space, Table } from 'antd';
import { Form, Input, Button, Col, Row, Modal } from 'antd';
const { Panel } = Collapse;
import React, { Component, useRef } from 'react';

const { Option } = Select;

import './PropertiesView.css';
import Leave from './Leave';
import FieldTable from './FieldTable';
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import ElementProperties from './ElementProperties';
import Approver from './Approver';
import Ruler from './Ruler';
import { history } from 'umi';

export default class PropertiesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedElements: [],
      element: null,
      targetForm: '',
      isModalVisible: false,
      dataSource: [
        {
          key: 11222,
          id: 12345,
          name: '张三',
          tel: 18823452222,
          email: 'xxx@email.com',
          creatTime: '2022-8-26',
        },
        {
          key: 12344,
          id: 20082,
          name: 'jansen',
          tel: 1882345111,
          email: 'xxx@email.com',
          creatTime: '2022-8-26',
        },
      ],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '电话',
          dataIndex: 'tel',
          key: 'tel',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: '创建时间',
          dataIndex: 'creatTime',
          key: 'creatTime',
        },
      ],
      rowSelection: {
        onSelect: (record, selected, selectedRows, nativeEvent) => {
          this.setState({
            approver: record,
          });
        },
      },
      approver: null,
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    const { modeler } = this.props;

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
    /**监听节点变化*/
    modeler.on('shape.changed', (e) => {
      console.log('节点变化');
      const { element } = e;
      if (element?.type === 'bpmn:UserTask' || element?.type === 'bpmn:Task') {
        // console.log(element)
        this.updateApproverNode(element);
      }
    });
    /**监听删除事件*/
    modeler.on('shape.remove', (e) => {
      console.log('删除节点');
      const { element } = e;
      this.delApproverNode(element);
    });
    /**监听添加节点*/
    modeler.on('shape.added', (e) => {
      console.log('创建节点');
      // const { element } = e;
      // if(element?.type==='bpmn:UserTask' || element?.type === 'bpmn:Task'){
      //   this.addApproverNode(element)
      // }
    });
  }
  /**添加审批人信息*/
  addApproverNode = (e) => {
    // console.log(e)
    const { flowMsg } = this.props;
    let arr = flowMsg.approverGroup || [];
    arr.push({
      id: e.id,
      name: e.businessObject.name,
      type: e.type,
    });
    flowMsg.approverGroup = arr;
    // console.log(flowMsg)
    this.updateFlowMsg(flowMsg);
  };
  /**更新审批人信息*/
  updateApproverNode = (e) => {
    const { flowMsg } = this.props;
    let arr = flowMsg.approverGroup || [];
    if (arr.length == 0) {
      this.addApproverNode(e);
    } else if (arr.findIndex((x) => x?.id === e.id) === -1) {
      this.addApproverNode(e);
    } else {
      const newarr = arr.map((x) => {
        if (x?.id === e.id) {
          let temp = { ...x };
          temp.name = e.businessObject.name;
          temp.type = e.type;
          return temp;
        }
        return x;
      });
      flowMsg.approverGroup = newarr;
      this.updateFlowMsg(flowMsg);
    }
  };
  /**删除审批人节点*/
  delApproverNode = (e) => {
    const { flowMsg } = this.props;
    let arr = flowMsg.approverGroup || [];

    let temp = arr.map((x) => {
      if (x?.id === e.id) {
        return null;
      } else {
        return x;
      }
    });
    /**这一步是为了修复只有一个审批人的时候更改节点类型产生的bug*/
    if (temp.length === 1 && temp[0] == null) {
      temp = [];
    } else {
      temp = temp.filter((x) => x != null);
    }
    flowMsg.approverGroup = temp;
    this.updateFlowMsg(flowMsg);
  };

  creatForm = () => {
    history.push('/formManage/formList');
  };
  handleChange = (value) => {
    this.setState({
      targetForm: value,
    });
    const { flowMsg } = this.props;
    flowMsg.targetForm = value;
    this.updateFlowMsg(flowMsg);
  };
  /**更新流程配置信息*/
  updateFlowMsg = (data) => {
    this.props.setFlowMsg(data);
  };
  handleOk = () => {
    const { flowMsg } = this.props;
    flowMsg.approver = this.state.approver;
    this.updateFlowMsg(flowMsg);
    this.setState({
      isModalVisible: false,
    });
  };
  handleCancle = () => {
    this.setState({
      isModalVisible: false,
    });
  };
  addApprover = () => {
    this.setState({
      isModalVisible: true,
    });
  };
  setTargetForm = (data) => {
    const { flowMsg } = this.props;
    flowMsg.targetFormSet = data;
    this.updateFlowMsg(flowMsg);
  };

  render() {
    const { modeler, flowMsg, forms } = this.props;

    const { selectedElements, element } = this.state;

    return (
      <div className={'panel-content'}>
        <div className="element-properties">
          <h3 className={'panel-tittle'}>属性配置</h3>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            ref={this.formRef}
          >
            <div className="group-card">
              <div className="group-tittle">
                常规 <ExclamationCircleOutlined />
              </div>
              {selectedElements.length > 0 ? null : (
                <Form.Item label="流程名称" name="name">
                  <Input
                    defaultValue={flowMsg?.proessName}
                    allowClear
                    disabled
                  />
                </Form.Item>
                // <fieldset>
                //   <label>流程名称</label>
                //   <span>{}</span>
                // </fieldset>
              )}

              {selectedElements.length === 1 && (
                <ElementProperties
                  modeler={modeler}
                  element={element}
                  fromRef={this.formRef}
                />
              )}

              {/*{selectedElements.length === 0 && (*/}
              {/*  <span>Please select an element.</span>*/}
              {/*)}*/}

              {selectedElements.length > 1 && (
                <span>Please select a single element.</span>
              )}
            </div>
            {element?.type === 'bpmn:StartEvent' && (
              <div className="group-card">
                <div className="group-tittle">
                  申请人 <ExclamationCircleOutlined />
                </div>
                <Form.Item label="申请人" name="applyPerson">
                  <Select defaultValue="anyone" style={{ width: 120 }}>
                    <Option value="anyone">任何人可填</Option>
                    <Option value="role">指定角色可填</Option>
                    <Option value="person">指定人可填</Option>
                  </Select>
                </Form.Item>
              </div>
            )}
            {(element?.type === 'bpmn:UserTask' ||
              element?.type === 'bpmn:Task') && (
              <div className="group-card">
                <div className="group-tittle">
                  审批人 <ExclamationCircleOutlined />
                </div>
                <Approver
                  addApprover={this.addApprover}
                  approver={flowMsg?.approver}
                  forms={forms}
                  flowMsg={flowMsg}
                  updateFlowMsg={this.updateFlowMsg}
                  element={element}
                  fromRef={this.formRef}
                ></Approver>
              </div>
            )}
            {element?.type === 'bpmn:ExclusiveGateway' && (
              <div className="group-card">
                <div className="group-tittle">
                  规则 <ExclamationCircleOutlined />
                </div>
                <Ruler
                  form={flowMsg.targetForm}
                  flowId={flowMsg.id}
                  element={element}
                ></Ruler>
              </div>
            )}
            {(element?.type === 'bpmn:StartEvent' ||
              element?.type === 'bpmn:UserTask' ||
              element?.type === 'bpmn:Task') && (
              <div className="group-card">
                <div className="group-tittle">
                  表单 <ExclamationCircleOutlined />
                </div>
                <Form.Item label="目标表单">
                  <Form.Item name="targetForm" noStyle>
                    <Select
                      style={{ width: 120 }}
                      disabled={element?.type != 'bpmn:StartEvent'}
                      onChange={(value) => {
                        this.handleChange(value);
                      }}
                      defaultValue={flowMsg.targetForm}
                    >
                      {forms.map((item) => {
                        return (
                          item.formStatus === 'enable' && (
                            <Option value={item.formCode} key={item.formCode}>
                              {item.formName}
                            </Option>
                          )
                        );
                      })}
                    </Select>
                  </Form.Item>
                  {element?.type === 'bpmn:StartEvent' && (
                    <Button
                      icon={<PlusCircleOutlined />}
                      onClick={this.creatForm}
                      style={{ marginLeft: 10 }}
                    >
                      创建
                    </Button>
                  )}
                </Form.Item>
                <Row>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      color: ' rgba(0, 0, 0, 0.85)',
                      fontWeight: 'bold',
                    }}
                  >
                    字段权限：
                  </Col>
                  <Col span={24}>
                    <FieldTable
                      form={flowMsg.targetForm}
                      type={element?.type}
                      flowId={flowMsg.id}
                      setTargetForm={this.setTargetForm}
                      targetFormSet={flowMsg.targetFormSet}
                    ></FieldTable>
                  </Col>
                </Row>
              </div>
            )}
          </Form>
        </div>
        <Modal
          title="选择审批人"
          width={620}
          visible={this.state.isModalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancle()}
        >
          <Row justify="start" className="list-row" style={{ marginTop: 20 }}>
            <Col span={16}>
              <Form
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
                layout="inline"
              >
                <Form.Item label="ID" name="ID" style={{ width: '80%' }}>
                  <Input allowClear placeholder="请输入用户ID/用户名" />
                </Form.Item>
              </Form>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Space size={10}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ borderRadius: '5px' }}
                >
                  搜索
                </Button>
                <Button
                  icon={<MinusCircleOutlined />}
                  style={{ borderRadius: '5px' }}
                >
                  清除
                </Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowSelection={{
              type: 'radio',
              ...this.state.rowSelection,
            }}
            style={{ marginTop: 20 }}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
          />
        </Modal>
      </div>
    );
  }
}

// helpers ///////////////////

function hasDefinition(event, definitionType) {
  const definitions = event.businessObject.eventDefinitions || [];

  return definitions.some((d) => is(d, definitionType));
}
