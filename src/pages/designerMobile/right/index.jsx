import React, { useContext, useEffect } from 'react';
import { designerContext } from './..';
import { Button, Checkbox, Form, Input } from 'antd';

function RightArea() {
  const formRef = React.createRef();
  const { comp, setComp, nowOperateId } = useContext(designerContext);

  useEffect(() => {
    console.log({ nowOperateId });
    console.log('formRef.current', comp[nowOperateId]?.properties);
    !comp[nowOperateId]?.properties && formRef.current.resetFields();
    nowOperateId &&
      formRef.current.setFieldsValue(comp[nowOperateId]?.properties || {});
  }, [nowOperateId]);

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
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFieldsChange={onFieldsChange}
          initialValues={{ ...(comp[nowOperateId]?.properties || null) }}
          autoComplete="off"
        >
          <Form.Item label="字段标识" name="prop">
            <Input />
          </Form.Item>
          <Form.Item label="标题" name="label">
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default RightArea;
