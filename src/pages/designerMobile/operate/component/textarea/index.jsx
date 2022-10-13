import React, { useState } from 'react';
import { TextArea } from 'antd-mobile/es';

const TextAreaC = ({ ...props }) => {
  const { properties } = props;

  return (
    <>
      <TextArea
        // onChange={props.onChange}
        placeholder={
          properties?.placeholder || `请输入${properties?.label || props.type}`
        }
      />
    </>
  );
};
export default TextAreaC;
