import React, { useContext } from 'react';
import Icon from '@/utils/icon';
import { randomRange } from '@/utils/utils';
import { designerContext } from './..';

const components = [
  {
    type: 'input',
    name: '输入框',
    icon: 'IdcardOutlined',
  },
  {
    type: 'textarea',
    name: '多行输入',
    icon: 'IdcardOutlined',
  },
  {
    type: 'password',
    name: '密码输入',
    icon: 'IdcardOutlined',
  },
  {
    type: 'number',
    name: '数字输入',
    icon: 'IdcardOutlined',
  },
  {
    type: 'number',
    name: '数字输入',
    icon: 'IdcardOutlined',
  },
];

function LeftArea() {
  const { comp, setComp } = useContext(designerContext);
  const onClick = (config) => {
    console.log('click component', config);
    setComp(
      (current) => {
        const randomId = randomRange();
        return {
          ...current,
          [randomId]: {
            ...config,
            designerMobileId: randomId,
          },
        };
      },
      // ...current,
      // {
      //   ...config,
      //   designerMobileId: randomRange(),
      // },
    );
  };

  return (
    <div className="des-mobile-con-area">
      <div className="des-mobile-con-title">组件</div>
      <div className="des-mobile-con-com">
        {components.map((item, index) => (
          <div key={index} className="com-item" onClick={() => onClick(item)}>
            <Icon icon={item.icon} style={{ fontSize: '20px' }} />
            <span className="com-text">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeftArea;
