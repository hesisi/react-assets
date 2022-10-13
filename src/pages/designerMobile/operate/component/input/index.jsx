import React, { useState } from 'react';
import { Input } from 'antd-mobile/es';
import './index.less';

const InputC = ({ ...props }) => {
  const [value, setValue] = useState();
  const { properties } = props;
  return (
    <div className="input-c-box">
      {properties?.prefix && (
        <span className="input-c-addon">{properties.prefix}</span>
      )}
      <Input
        placeholder={
          properties?.placeholder || `请输入${properties?.label || props.type}`
        }
      />
      {properties?.suffix && (
        <span className="input-c-addon">{properties.suffix}</span>
      )}
    </div>
  );
};
export default InputC;
