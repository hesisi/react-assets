import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Row,
  Col,
  InputNumber,
} from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import ConfigDialog from './configDialog';

const { Option } = Select;

const templateEnum = Object.freeze({
  one: '单区域',
  four: '页眉和三区域',
  five: '上二下三',
});
export default function pageForm(props) {
  const [formData] = useState({
    height: '100',
    width: '100',
  });
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false); // 对话框显示
  const [mode, setMode] = useState(); // 模式

  const onFinish = (values) => {
    // 保存的时候
    form.setFieldValue('template', mode);
    props.setTemplate(mode);
  };

  const onReset = () => {
    form.resetFields();
  };

  const templateSelect = () => {
    setVisible(!visible);
  };

  const onChange = (obj) => {
    props.setForm(form.getFieldsValue);
  };

  useEffect(() => {
    props.setTemplate(mode);
  }, [mode]);

  return (
    <div>
      {/* 布局弹窗 */}
      <ConfigDialog
        visible={visible}
        setVisible={setVisible}
        setMode={setMode}
      />

      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        layout="vertical"
        initialValues={formData}
      >
        <Form.Item
          name="label"
          label="标签"
          rules={[{ required: true, message: 'Please input label!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="development"
          label="开发人员姓名"
          rules={[{ required: true, message: 'Please input development!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="template" label="模板">
          <Row>
            <Space>
              <Input disabled={true} value={templateEnum[mode]} />
              <Button onClick={templateSelect}>选择</Button>
            </Space>
          </Row>
        </Form.Item>

        {mode === 'one' ? (
          <>
            <Form.Item name="width" label="宽度(px)">
              <InputNumber onChange={onChange} min={1} max={1920} />
            </Form.Item>

            <Form.Item name="height" label="高度(px)">
              <InputNumber onChange={onChange} min={1} max={1080} />
            </Form.Item>
          </>
        ) : (
          <></>
        )}

        {mode === 'four' ? (
          <>
            <Form.Item name="image" label="图片">
              <Button>上传</Button>
            </Form.Item>
          </>
        ) : (
          <></>
        )}
        {/*
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item> */}
      </Form>
    </div>
  );
}
