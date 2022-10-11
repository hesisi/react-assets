import React from 'react';
import * as customCom from './component';

const ComponentElement = (props) => {
  const { config } = props;
  const type = config.type.charAt(0).toUpperCase() + config.type.slice(1) + 'C';
  return React.createElement(customCom[type] || 'span');
};

export default ComponentElement;
