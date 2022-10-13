import React from 'react';
import * as customCom from './component';
// import * as antdMobile from 'antd-mobile/es'

const ComponentElement = (props) => {
  const { config } = props;
  const component = config.component;
  return React.createElement(customCom[component] || 'span', {
    ...config,
  });
  // const component = config.component
  // return React.createElement(antdMobile[component] || 'span',{
  //   placeholder: '请输入'
  // });
};

export default ComponentElement;
