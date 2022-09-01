import { Button, Form, Input } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { useRef } from 'react';

const { TextArea } = Input;
export default function RoleInfo(props) {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { formValueChange, formValueSubmit, formResetCallback } = props;

  const onFormChange = (values) => {
    formValueChange && formValueChange(values);
  };

  const onFinish = (values) => {
    formValueSubmit && formValueSubmit(values);
  };

  const onReset = () => {
    formRef.current && formRef.current.resetFields();
    formResetCallback && formResetCallback();
  };

  const formProps = {
    ref: formRef,
    form,
    initialValues: {},
    onValuesChange: onFormChange,
    onFinish,
    className: 'default-form-radios',
  };
  return (
    <div className="table-search-wrapper">
      <Form {...formProps} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        <Form.Item
          label="角色名称"
          name="roleName"
          key="roleName"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item label="角色描述" name="roleDescrib" key="roleDescrib">
          <TextArea placeholder="请输入角色描述" />
        </Form.Item>
        <Form.Item label=" ">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            htmlType="submit"
            style={{ marginRight: '10px' }}
          >
            保存
          </Button>
          {/* <Button
            icon={<MinusCircleOutlined />}
            htmlType="button"
            onClick={onReset}
          >
            {formButton.clearText}
          </Button> */}
        </Form.Item>
      </Form>
    </div>
  );
}
