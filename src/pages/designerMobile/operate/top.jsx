import React, { useState, useContext } from 'react';
import { Button, Radio } from 'antd';
import { EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { OperateContext } from '.';

function OperateTop() {
  const { nowStatus, setNowStatus } = useContext(OperateContext);
  return (
    <div className="des-mobile-con-oper-top">
      <div></div>
      <div>
        <Radio.Group
          size="small"
          value={nowStatus}
          onChange={(e) => setNowStatus(e.target.value)}
        >
          <Radio.Button value="edit">
            <EditOutlined />
          </Radio.Button>
          <Radio.Button value="json">{'{...}'}</Radio.Button>
          <Radio.Button value="preview">
            <PlayCircleOutlined />
          </Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );
}

export default OperateTop;
