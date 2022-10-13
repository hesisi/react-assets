import React, { useContext, createContext, useState } from 'react';
import { designerContext } from './..';
import { Form } from 'antd-mobile/es';
import { DeleteOutlined } from '@ant-design/icons';
import ComponentElement from './element';
import OperateTop from './top';
import JsonEditor from './monaco';

const phone = require('@/assets/images/phone.svg');
export const OperateContext = createContext();

function OperateArea() {
  const { comp, setComp, setNowOperateId } = useContext(designerContext);
  const [nowStatus, setNowStatus] = useState('edit');

  //点击表单
  const onClickItem = (e, config) => {
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
      <OperateContext.Provider value={{ nowStatus, setNowStatus }}>
        <OperateTop />
      </OperateContext.Provider>
      <div className="des-mobile-con-body">
        {nowStatus === 'json' ? (
          <JsonEditor />
        ) : (
          <div className="des-mobile-con-inner">
            <img className="des-mobile-con-mobile" src={phone} alt="" />
            <div className="des-mobile-con-oper-main">
              {nowStatus === 'preview' ? (
                <iframe
                  className="des-mobile-con-oper-preview"
                  src="/formManage/previewMobile"
                ></iframe>
              ) : (
                <Form layout="horizontal">
                  {Object.values(comp).map((item, index) => (
                    <div
                      data-id={item.designerMobileId}
                      className="des-mobile-formItem"
                      key={index}
                    >
                      {/* {item.nowOperating && (
                      <div
                        className="des-mobile-formItem-delete"
                        onClick={() => onDeleteItem(item)}
                      >
                        <DeleteOutlined
                          style={{ fontSize: '14px', color: '#fff' }}
                        />
                      </div>
                    )} */}
                      {/* nowStatus为edit时才显示遮罩层 */}
                      {nowStatus === 'edit' && (
                        <>
                          <div
                            className={[
                              'des-mobile-formItem-cover',
                              item.nowOperating
                                ? 'formItem-cover-nowOperating'
                                : '',
                            ].join(' ')}
                            onClick={(e) => onClickItem(e, item)}
                          ></div>
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
                        </>
                      )}
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OperateArea;
