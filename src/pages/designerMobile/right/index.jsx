import React, { useContext, useEffect, useState } from 'react';
import { designerContext } from './..';
import { Button, Checkbox, Form, Input, Switch } from 'antd';
import { fieldConfigs, componentConfigs } from './config';

function RightArea() {
  const formRef = React.createRef();
  const [comConfigs, setComConfigs] = useState([]);
  const { comp, setComp, nowOperateId } = useContext(designerContext);

  useEffect(() => {
    console.log({ nowOperateId });
    //清空属性配置表单
    formRef.current.resetFields();
    //给表单重新赋值
    if (!nowOperateId) return;
    //类型不同，右侧需要配置的组件属性不同
    setComConfigs(componentConfigs(comp[nowOperateId]?.type));
    //给当前选中的表单配置过的属性赋值
    formRef.current.setFieldsValue(comp[nowOperateId]?.properties || {});
  }, [nowOperateId]);

  const columnsDom = (config) => {
    const { type } = config;
    switch (type) {
      case 'input':
        return <Input />;
      case 'textarea':
        return <Input.TextArea />;
      case 'switch':
        return <Switch />;
    }
  };

  const onFieldsChange = (changedFields, allFields) => {
    nowOperateId &&
      setComp((current) => {
        let nowProperty = {};
        allFields.forEach((item) => {
          if (item.value) nowProperty[item.name[0]] = item.value;
        });
        current[nowOperateId] = {
          ...current[nowOperateId],
          properties: { ...nowProperty },
        };
        return { ...current };
      });
  };
  return (
    <div className="des-mobile-con-area">
      <div className="des-mobile-con-title">属性配置</div>
      <div className="des-mobile-con-config">
        <Form
          name="basic"
          ref={formRef}
          colon={false}
          labelAlign="left"
          size="middle"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFieldsChange={onFieldsChange}
          initialValues={{ ...(comp[nowOperateId]?.properties || null) }}
          autoComplete="off"
        >
          <div className="des-mobile-con-area-subtitle">字段属性</div>
          <div className="des-mobile-con-area-formItem">
            {fieldConfigs.map((item) => (
              <Form.Item key={item.name} label={item.label} name={item.name}>
                {columnsDom(item)}
              </Form.Item>
            ))}
          </div>
          <div className="des-mobile-con-area-subtitle">组件属性</div>
          <div className="des-mobile-con-area-formItem">
            {comConfigs.map((item) => (
              <Form.Item key={item.name} label={item.label} name={item.name}>
                {columnsDom(item)}
              </Form.Item>
            ))}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default RightArea;
