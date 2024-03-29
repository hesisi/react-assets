import React, { useEffect, useState } from 'react';
import { Input, Modal, Form, Select } from 'antd';
import { FormOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;
import type { ColumnsType } from 'antd/es/table';
import type { FormInstance } from 'antd/es/form';
import { nanoid } from 'nanoid';
import moment from 'moment';
import TypeDialog from './TypeDialog';
import { useForm } from '@formily/react';
import { createActivity } from '@/services/activityManage';

export default function Dialog(props: any) {
  const formRef = React.createRef<FormInstance>();
  const _processGroup = window.localStorage.getItem('processGroup') || '';
  let processGroup: any[] = [];
  if (_processGroup != '') {
    processGroup = JSON.parse(_processGroup);
  } else {
    processGroup = [
      {
        key: 1,
        typeIndex: '1',
        typeName: '默认分组',
      },
    ];
    window.localStorage.setItem('processGroup', JSON.stringify(processGroup));
  }

  const [isTypeVisible, setIsTypeVisible] = useState(false);
  const { isModalVisible, handleOk, setIsModalVisible } = props;
  useEffect(() => {
    if (isModalVisible) {
      formRef.current?.resetFields();
    }
  }, [isModalVisible]);

  const onFinish = (values: any) => {
    const flowGroup = window.localStorage.getItem('flowGroup');
    const { processName } = values;
    createActivity(processName).then((res?: any) => {
      if (res.data.isSuccess > 0) {
        let processId = res.data.data.processId;
        window.localStorage.setItem('bpmnxml', res.data.data.xml);
        window.localStorage.setItem('processId', res.data.data.processId);
        const flowData = {
          ...values,
          processId: processId,
          status: 'disabled',
          creatTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: '',
        };
        if (flowGroup) {
          const temp = JSON.parse(flowGroup);
          temp.push(flowData); //TODO:记得修改
          window.localStorage.setItem('flowGroup', JSON.stringify(temp));
          // console.log(flowData)
          handleOk(flowData.processId, flowData.processName);
        } else {
          window.localStorage.setItem(
            'flowGroup',
            JSON.stringify([flowData]), //TODO:记得修改
          );
          handleOk(flowData.processId, flowData.processName);
        }
        setIsModalVisible(false);
      }
    });

    // const temp = { ...values };
    // temp.id = nanoid();
    // console.log(temp);
    // window.localStorage.setItem('flow', JSON.stringify(temp));

    // handleOk(temp.id); //TODO:记得修改
  };
  const confirm = () => {
    formRef.current
      ?.validateFields()
      .then((value) => {
        formRef.current?.submit();
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  const updateType = () => {
    setIsTypeVisible(true);
  };

  return (
    <Modal
      title="新增流程"
      visible={isModalVisible}
      onOk={confirm}
      onCancel={() => setIsModalVisible(false)}
      className="default-modal"
      cancelText="取消"
      okText="确认"
    >
      <Form
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="流程名称"
          name="processName"
          rules={[{ required: true, message: '请输入流程名称!' }]}
        >
          <Input placeholder={'请输入流程名称'} />
        </Form.Item>
        <Form.Item
          label="流程分组"
          name="processGroup"
          rules={[{ required: true, message: '请选择流程分组!' }]}
          style={{ display: 'inline-block' }}
        >
          <Select
            // defaultValue={processGroup[0].typeIndex}
            placeholder="请选择流程分组"
            style={{ width: 440 }}
          >
            {processGroup.map((item: any) => {
              return (
                <Option value={item.typeIndex} key={item.key}>
                  {item.typeName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <FormOutlined
          onClick={updateType}
          style={{
            color: '#40a9ff',
            fontSize: '20px',
            marginTop: '36px',
            marginLeft: '10px',
          }}
        />
        <Form.Item label="备注" name="remarks">
          <TextArea rows={4} placeholder="请输入备注" />
        </Form.Item>
      </Form>
      <TypeDialog
        setIsTypeVisible={setIsTypeVisible}
        isTypeVisible={isTypeVisible}
      ></TypeDialog>
    </Modal>
  );
}
