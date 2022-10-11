import React, { useState } from 'react';
import { Button, Radio } from 'antd';
import { EditOutlined, PlayCircleOutlined } from '@ant-design/icons';

function OperateTop() {
  const [status, setStatus] = useState('edit');
  return (
    <div className="des-mobile-con-oper-top">
      <div></div>
      <div>
        <Radio.Group
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
