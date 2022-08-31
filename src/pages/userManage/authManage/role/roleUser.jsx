import { Button, Form, Input } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useRef } from 'react';

import RoleTransfer from './roleTransfer';

const { TextArea } = Input;
export default function RoleUser(props) {
  const formRef = useRef(null);
  const [form] = Form.useForm();

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
    layout: 'inline',
    form,
    initialValues: {},
    onValuesChange: onFormChange,
    onFinish,
    className: 'default-form-radios',
  };
  return (
    <div className="table-search-wrapper">
      <RoleTransfer transIdenty="人员" />
      {/* <Form {...formProps}>
        <Form.Item label="" name="roleUser" key="roleName">

        </Form.Item>
        <Form.Item>
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
          </Button>
        </Form.Item>
      </Form> */}
    </div>
  );
}
