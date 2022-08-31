import { Button, Form } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { useRef } from 'react';

export default function TableHeader({
  formData: {
    formStructure = [],
    formButton = {
      showButton: true,
      ButtonStructure: [],
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

  const formProps = formStructure?.length
    ? {
        ref: formRef,
        layout: 'inline',
        form,
        initialValues: {},
        onValuesChange: onFormChange,
        onFinish,
        className: 'default-form-radios',
      }
    : {
        ref: formRef,
        layout: 'inline',
        form,
        className: 'default-form-radios',
      };
  return (
    <div className="table-search-wrapper" style={{ minHeight: '52px' }}>
      <Form {...formProps}>
        {formStructure.map((item) => {
          return (
            <Form.Item label={item.label} name={item.name} key={item.name}>
              {item.itemDom && item.itemDom()}
            </Form.Item>
          );
        })}

        {formButton.showButton ? (
          formButton?.ButtonStructure?.length ? (
            <>
              {formButton.ButtonStructure.map((item, itemIndex) => {
                return (
                  <Form.Item key={itemIndex}>
                    {item.itemDom && item.itemDom()}
                  </Form.Item>
                );
              })}
            </>
          ) : (
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
          )
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
