/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-16 16:39:48
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-04 16:16:14
 */
import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
} from 'react';
import { Space, Button, Radio, Modal } from 'antd';
import { useDesigner, TextWidget } from '@designable/react';
import { GlobalRegistry } from '@designable/core';
import { observer } from '@formily/react';
// import { loadInitialSchema, saveSchema } from '../utils'
import { Engine } from '@designable/core';
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer';
import { onFormSubmitValidateEnd } from '@formily/core';
import { history } from 'umi';
import Icon from '@/utils/icon';
import FormPreview from '@/pages/formManage/formPreview/formPreview';
import '../index.less';
import eventBus from '@/utils/eventBus';

interface ActionsWidgetProps {
  type: 'form' | 'table';
  getDesigner: (e: any) => {};
  onSave: () => {};
  saveDis?: Boolean;
}

export const ActionsWidget: React.FC<ActionsWidgetProps> = observer((props) => {
  const { type, getDesigner, onSave, saveDis = false } = props;
  const designer = useDesigner() || Engine;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [formCode, setFormCode] = useState('');
  const [saveDisabled, setSaveDisabled] = useState(false);

  useEffect(() => {
    getDesigner(designer);
  }, []);

  useEffect(() => {
    setSaveDisabled(saveDis as boolean);
  }, [saveDis]);

  const supportLocales = ['zh-cn', 'en-us', 'ko-kr'];

  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn');
    }
  }, []);

  // 预览
  const onPreview = () => {
    onSave();
    setPreviewVisible(true);
  };

  return (
    <>
      <Space style={{ marginRight: 10, padding: '10px 0' }}>
        <Radio.Group
          value={GlobalRegistry.getDesignerLanguage()}
          optionType="button"
          options={[
            { label: 'English', value: 'en-us' },
            { label: '简体中文', value: 'zh-cn' },
          ]}
          onChange={(e) => {
            GlobalRegistry.setDesignerLanguage(e.target.value);
          }}
        />
        <Button
          type="primary"
          icon={<Icon icon="EyeOutlined" />}
          className="primary-btn"
          onClick={() => {
            onPreview();
          }}
        >
          预览
        </Button>
        <Button
          type="primary"
          onClick={() => {
            onSave();
          }}
          disabled={saveDisabled}
          icon={<Icon icon="SaveOutlined" />}
          className="primary-btn"
        >
          保存
          {/* <TextWidget>保存</TextWidget> */}
        </Button>

        <Button
          onClick={() => {
            history.push('/formManage/formList');
          }}
          icon={<Icon icon="ArrowLeftOutlined" />}
          className="default-btn"
        >
          返回
          {/* <TextWidget>返回</TextWidget> */}
        </Button>
      </Space>

      {/* 弹框: 预览 */}
      {previewVisible ? (
        <Modal
          visible={previewVisible}
          title="表单预览"
          onCancel={() => setPreviewVisible(false)}
          className="form-preview__modal default-modal"
        >
          <FormPreview showPageTitle={false} />
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
});
