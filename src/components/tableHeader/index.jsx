import { Button, Form } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { useRef } from 'react';

export default function TableHeader({
  formData: {
    formStructure = [],
    formButton = {
      showButton: true,
      submitText: '搜索',
      clearText: '清除',
    },
    operateStructure = [],
    formValueChange = null,
    formValueSubmit = null,
    formResetCallback = null,
  },
}) {
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

  return (
    <div className="table-search-wrapper">
      <Form
        ref={formRef}
        layout="inline"
        form={form}
        initialValues={{}}
        onValuesChange={onFormChange}
        onFinish={onFinish}
      >
        {formStructure.map((item) => {
          return (
            <Form.Item label={item.label} name={item.name} key={item.name}>
              {item.itemDom && item.itemDom()}
            </Form.Item>
          );
        })}

        {formButton.showButton ? (
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              style={{ marginRight: '10px' }}
            >
              {formButton.submitText}
            </Button>
            <Button
              icon={<MinusCircleOutlined />}
              htmlType="button"
              onClick={onReset}
            >
              {formButton.clearText}
            </Button>
          </Form.Item>
        ) : null}
      </Form>
      {operateStructure?.length ? (
        <div className="table-operate-wrapper">
          {operateStructure.map((item) => {
            return item;
          })}
        </div>
      ) : null}
    </div>
  );
}
