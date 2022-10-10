import React, { useContext } from 'react';
import { designerContext } from './..';
import { Form } from 'antd-mobile/es';
import { DeleteOutlined } from '@ant-design/icons';

import { InputC } from './component';

const phone = require('@/assets/images/phone.svg');

function OperateArea() {
  const { comp, setComp } = useContext(designerContext);
  console.log('bbbbbbbbbb', comp);

  //点击表单
  const onClickItem = (e, config) => {
    // e.stopPropagation()
    // e.preventDefault()
    setComp((current) =>
      current.map((item) => {
        return {
          ...item,
          nowOperating: Boolean(
            item.designerMobileId === config.designerMobileId,
          ),
        };
      }),
    );
  };

  //删除表单
  const onDeleteItem = (config) => {
    setComp((current) => {
      current.splice(
        current.findIndex(
          (item) => item.designerMobileId === config.designerMobileId,
        ),
        1,
      );
      return current;
    });
  };

  const componentElement = (config) => {
    const type =
      config.type.charAt(0).toUpperCase() + config.type.slice(1) + 'C';
    console.log('1111111111', type);
    return React.createElement(type);
  };

  return (
    <div className="des-mobile-con-oper">
      <div className="des-mobile-con-body">
        <img className="des-mobile-con-mobile" src={phone} alt="" />
        <div className="des-mobile-con-oper-main">
          <Form layout="horizontal">
            {comp.map((item, index) => (
              <div
                className={[
                  'des-mobile-formItem',
                  item.nowOperating ? 'formItem-nowOperating' : '',
                ].join(' ')}
                onClick={(e) => onClickItem(e, item)}
                key={index}
              >
                {item.nowOperating && (
                  <div
                    className="des-mobile-formItem-delete"
                    onClick={() => onDeleteItem(item)}
                  >
                    <DeleteOutlined
                      style={{ fontSize: '14px', color: '#fff' }}
                    />
                  </div>
                )}
                <div className="des-mobile-formItem-cover"></div>
                <Form.Item
                  name={item.name || item.type}
                  label={item.title || item.type}
                  rules={item.admRules}
                >
                  {componentElement(item)}
                  {/* <InputC></InputC> */}
                  {/* <FromItem onChange={onchange} config={item}></FromItem> */}
                </Form.Item>
              </div>
            ))}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default OperateArea;
