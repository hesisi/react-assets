import { Form, Input, Button } from 'antd';
import './index.less';
import IconBox from './iconBox';
import { UploadOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState, createRef, useEffect } from 'react';
import { Space } from '@formily/antd';

export default function configPanel(props) {
  const [iconSelect, setIconSelect] = useState(null);
  const [iconIndex, setIconIndex] = useState(-1);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // debugger;
    // if (!props.formData || !props.formData.formValue) return;
    const value = props?.formData?.formValue || {};
    form.setFieldsValue({
      menuname: value?.menuname || '',
      address: value?.address || '',
      icon: value?.icon || null,
    });
    if (value) {
      setIconSelect(value.icon);
      setIconIndex(value.iconIndex);
    }
    const isEdit = props.formData?.isEdit || false;
    setIsEdit(isEdit); // 是否是编辑
    // if (isEdit) {
    setIsShowEdit(isEdit);
    // }
  }, [props.formData]);

  const onFinish = (values) => {
    // 表单提交
    if (props.formData?.isEdit) {
      // 编辑的时候会有其他属性一并返回
      props.configSubmit(
        { ...props.formData.formValue, ...values, isEdit },
        iconSelect,
        iconIndex,
      );
    } else {
      props.configSubmit({ ...values, isEdit }, iconSelect, iconIndex);
    }
    form.resetFields();
    setIconSelect(null);
    setIconIndex(-1);
    setIsEdit(false);
    setIsShowEdit(false);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 4 }}
      className="config-panel__form"
      onFinish={(v) => onFinish(v)}
      initialValues={{
        menuname: '',
        address: '',
        icon: null,
      }}
      form={form}
    >
      <Form.Item
        label="菜单名称"
        name="menuname"
        rules={[{ required: true, message: 'Please input menuname!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="地址"
        name="address"
        rules={[{ required: true, message: 'Please input address!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="图标" name="icon">
        <>
          <p>
            <span className="icons-span">
              {iconSelect ? <>已选择：{iconSelect}</> : '从图标库选择'}
            </span>
            <Button type="link">
              {/* {`<UploadOutlined />`} */}
              <UploadOutlined />
              上传
            </Button>
          </p>
          <IconBox
            setIconSelect={setIconSelect}
            setIconIndex={setIconIndex}
            iconIndex={iconIndex}
            iconSelect={iconSelect}
          />
        </>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Space>
          {/* <Button type="primary" htmlType="submit">
            <PlusOutlined />
            添加菜单结点
          </Button> */}

          {isShowEdit ? (
            <>
              <Button type="primary" htmlType="submit">
                <EditOutlined />
                修改菜单结点
              </Button>
            </>
          ) : (
            <Button type="primary" htmlType="submit">
              <PlusOutlined />
              添加菜单结点
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}
