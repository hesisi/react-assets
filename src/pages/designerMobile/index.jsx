import React, { useState, createContext } from 'react';
import { Layout, Space, Button, Radio, Modal } from 'antd';
import { history } from 'umi';
import Icon from '@/utils/icon';
import './index.less';
import LeftArea from './left';
import RightArea from './right';
import OperateArea from './operate';
const { Header, Content } = Layout;

export const designerContext = createContext();
function DesignerMobile() {
  const [comp, setComp] = useState({});
  const [nowOperateId, setNowOperateId] = useState(null);
  return (
    <designerContext.Provider
      value={{ comp, setComp, nowOperateId, setNowOperateId }}
    >
      <div className="des-mobile-header">
        <Space>
          <Button
            type="primary"
            icon={<Icon icon="EyeOutlined" />}
            className="primary-btn"
          >
            预览
          </Button>
          <Button
            type="primary"
            icon={<Icon icon="SaveOutlined" />}
            className="primary-btn"
          >
            保存
          </Button>

          <Button
            onClick={() => {
              history.push('/formManage/formList');
            }}
            icon={<Icon icon="ArrowLeftOutlined" />}
            className="default-btn"
          >
            返回
          </Button>
        </Space>
      </div>
      <div className="des-mobile-content">
        <LeftArea />
        <OperateArea />
        <RightArea />
      </div>
    </designerContext.Provider>
  );
}

export default DesignerMobile;
