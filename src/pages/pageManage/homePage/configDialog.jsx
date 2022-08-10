import { Button, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import PageConfig from './pageConfig';

export default function configDialog(props) {
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const [modeKey, setModeKey] = useState();

  const handleOk = () => {
    props.setMode(modeKey);
    props.setVisible(!props.visible);
  };

  const handleCancel = () => {
    props.setVisible(!props.visible);
  };

  return (
    <Modal
      title="选择模板"
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      keyboard={false}
      width={800}
      bodyStyle={{ padding: 0, height: '400px' }}
      cancelText="取消"
      okText="确定"
    >
      <PageConfig setModeKey={setModeKey} />
    </Modal>
  );
}
