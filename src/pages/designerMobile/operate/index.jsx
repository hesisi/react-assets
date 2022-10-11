import React, { useContext, useMemo } from 'react';
import { designerContext } from './..';
import { Form } from 'antd-mobile/es';
import { DeleteOutlined } from '@ant-design/icons';
import ComponentElement from './element';
import OperateTop from './top';

const phone = require('@/assets/images/phone.svg');

function OperateArea() {
  const { comp, setComp, setNowOperateId } = useContext(designerContext);
  console.log('bbbbbbbbbb', comp);

  //点击表单
  const onClickItem = (e, config) => {
    // e.stopPropagation()
    // e.preventDefault()
    setNowOperateId(config.designerMobileId);
    setComp((current) => {
      Object.values(current).map((item) => {
        current[item.designerMobileId].nowOperating = Boolean(
          item.designerMobileId === config.designerMobileId,
        );
      });
      return { ...current };
    });
  };

  //删除表单
  const onDeleteItem = (config) => {
    setComp((current) => {
      Reflect.deleteProperty(current, config.designerMobileId);
      return { ...current };
    });
  };

  return (
    <div className="des-mobile-con-oper">
      <OperateTop />
      <div className="des-mobile-con-body">
        <div className="des-mobile-con-inner">
          <img className="des-mobile-con-mobile" src={phone} alt="" />
          <div className="des-mobile-con-oper-main">
            <Form layout="horizontal">
              {Object.values(comp).map((item, index) => (
                <div
                  data-id={item.designerMobileId}
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
                    name={item.properties?.prop || item.type}
                    label={item.properties?.label || item.type}
                    rules={item.admRules}
                  >
                    <ComponentElement config={item} />
                    {/* <FromItem onChange={onchange} config={item}></FromItem> */}
                  </Form.Item>
                </div>
              ))}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperateArea;
