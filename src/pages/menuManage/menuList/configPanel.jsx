import { Form, Input, Button, Select, message } from 'antd';
import './index.less';
import IconBox from './iconBox';
import { UploadOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState, createRef, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Space } from '@formily/antd';
import { list } from './iconBox';

export default function configPanel(props) {
  const [visible, setVisible] = useState(false);

  const [iconSelect, setIconSelect] = useState(null);
  const [iconIndex, setIconIndex] = useState(-1);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [form] = Form.useForm();
  const [selectList, setSelectList] = useState([
    { value: 'a', label: '角色A' },
    { value: 'b', label: '角色B' },
    { value: 'c', label: '角色C' },
  ]);

  useEffect(() => {
    const value = props?.formData?.formValue || {};
    if (value && value.key && !value.isTop) {
      setVisible(true);
      form.setFieldsValue({
        menuname: value?.menuname || '',
        address: value?.address || '',
        icon: value?.icon || null,
      });

      if (value) {
        // setIconSelect(value.icon);
        setIconIndex(value.iconIndex);
      }
      const isEdit = props.formData?.isEdit || false;
      setIsEdit(isEdit); // 是否是编辑
      setIsShowEdit(isEdit);
      return;
    }
    setVisible(false);
  }, [props.formData]);

  const onFinish = (values) => {
    // 表单提交
    props.configSubmit(
      { ...props.formData.formValue, ...values, isEdit },
      iconSelect,
      iconIndex,
    );
    // form.resetFields();
    // setIconSelect(null);
    // setIconIndex(-1);
    message.success('菜单配置成功!');
    setIsEdit(false);
    setIsShowEdit(false);
  };

  return (
    <div className="menu-config-wrapper">
      <Scrollbars style={{ width: '100%', height: '100%' }}>
        {visible ? (
          <Form
            name="basic"
            // labelCol={{ span: 4 }}
            layout="vertical"
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
              rules={[
                { required: true, message: 'Please input menuname!' },
                {
                  pattern: /^([\u4e00-\u9fa5]{1,6}|[^\u4e00-\u9fa5]{1,8})$/,
                  message: '字数不超过6个汉字或8个字符',
                },
              ]}
              tooltip="字数不超过6个汉字或8个字符"
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
                    {iconIndex >= 0 ? (
                      <>已选择：{React.createElement(list[iconIndex])}</>
                    ) : (
                      '从图标库选择'
                    )}
                  </span>
                  <Button type="link">
                    <UploadOutlined />
                    上传
                  </Button>
                </p>
                <IconBox
                  // setIconSelect={setIconSelect}
                  setIconIndex={setIconIndex}
                  iconIndex={iconIndex}
                  iconSelect={iconSelect}
                />
              </>
            </Form.Item>

            <Form.Item
              wrapperCol={{ offset: 0, span: 24 }}
              className="form-button"
            >
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div>
            {props?.formData?.formValue?.isTop
              ? '该节点暂无配置信息'
              : '请点击查看配置信息'}
          </div>
        )}
      </Scrollbars>
    </div>
  );
}
