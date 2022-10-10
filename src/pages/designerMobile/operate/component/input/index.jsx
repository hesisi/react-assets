import React, { useState } from 'react';
import { Input } from 'antd-mobile/es';
import './index.less';

const InputC = ({ ...props }) => {
  const [value, setValue] = useState();

  return (
    <div className="input-c-box">
      <Input placeholder={`请输入`} />
    </div>
  );
};
export default InputC;
