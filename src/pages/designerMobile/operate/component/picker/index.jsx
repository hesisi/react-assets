import React, { useState } from 'react';
import { Picker } from 'antd-mobile/es';

const PickerC = ({ ...props }) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState();
  const { properties } = props;
  const columns = (properties?.options && [properties.options]) || [];

  const onConfirm = (v) => {
    setValue(columns[0].find((i) => i.value === v[0])?.label);
    // props.onChange(v[0])
  };

  return (
    <>
      <div
        onClick={() => {
          setVisible(true);
        }}
        style={{ color: value ? '#333' : '#ccc' }}
      >
        {value || `请选择${properties?.label || props.type}`}
      </div>
      <Picker
        columns={columns}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        value={value}
        onConfirm={onConfirm}
      />
    </>
  );
};
export default PickerC;
