import { Button, Form, Input, message } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { useRef, useEffect } from 'react';
import localForage from 'localforage';

import { updateRoleInfo } from '@/services/userManager';

const { TextArea } = Input;
export default function RoleInfo(props) {
  const { groupItem, editItemHandle } = props;
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

  const handleSaveInfo = () => {
    formRef.current.validateFields().then(async (values) => {
      const { name, roleDescrib } = values;
      const upResult = await updateRoleInfo({
        ...groupItem,
        name,
        desc: roleDescrib,
      });
      // const userOldInfo = (await localForage.getItem('userSystemInfo')) || {};
      // userOldInfo[groupItem.id] = {
      //   ...userOldInfo[groupItem.id],
      //   name,
      //   roleDescrib,
      // };{ ...groupItem, name, roleDescrib }
      if (upResult?.data?.code === 200) {
        editItemHandle && editItemHandle();
        message.success('保存成功');
      }
      // localForage.setItem('userSystemInfo', userOldInfo);
    });
  };

  useEffect(async () => {
    if (formRef?.current && groupItem) {
      formRef.current.setFieldsValue({
        name: groupItem.name || '',
        roleDescrib: groupItem.desc || '',
      });
    }
  }, [groupItem]);

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
          name="name"
          key="name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item label="角色描述" name="roleDescrib" key="roleDescrib">
          <TextArea placeholder="请输入角色描述" />
        </Form.Item>
        <Form.Item label=" " className="no-item-label">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            htmlType="submit"
            onClick={handleSaveInfo}
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
