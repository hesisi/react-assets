import { Button, Form, Input } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';

import RoleTransfer from './roleTransfer';
import { useRef } from 'react';

const { TextArea } = Input;
export default function RoleFunction(props) {
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
      <RoleTransfer transIdenty="功能" />
    </div>
  );
}
