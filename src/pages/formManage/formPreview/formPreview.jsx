import { PageHeader, Space, Button, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { PreviewWidget } from '@/pages/Desinger/widgets';
import { transformToTreeNode } from '@designable/formily-transformer';
import { history } from 'umi';
import * as formApi from '@/services/formManage';

const formPreview = (props) => {
  const [formTree, setFormTree] = useState(null);
  const formRef = useRef(null);
  const [formName, setFormName] = useState('');
  const [showPageTitle, setShowPageTitle] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  // 预览的时候从localStorage取
  const getFromLocalStorage = (formCode) => {
    const formColumn = JSON.parse(window.localStorage.getItem('formMap'));
    const formItemObj = formColumn[formCode]['formily-form-schema'];
    if (formItemObj) {
      formItemObj.form = { ...formItemObj.form, layout: 'vertical' };
      setFormTree(transformToTreeNode(formItemObj));
    }
    setFormName(props.formName);
  };

  const init = () => {
    // 表单
    setShowPageTitle(props.showPageTitle);

    const formCode = history?.location?.query?.formCode || props.formCode;
    if (props.isPreview) {
      getFromLocalStorage(formCode);
      return;
    }
    setLoading(true);
    formApi
      .getFormDetails({ formId: formCode })
      .then((res) => {
        const formItemObj = JSON.parse(res?.object?.formPropertyValue || null);
        if (formItemObj) {
          formItemObj.form = { ...formItemObj.form, layout: 'vertical' };
          setFormTree(transformToTreeNode(formItemObj));
        }
        setFormName(props.formName);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="form-preview">
      {showPageTitle ? (
        <PageHeader
          className="default-page__header"
          onBack={() => {
            history.goBack();
          }}
          title="返回"
        />
      ) : (
        <></>
      )}

      <Spin spinning={loading}>
        <div className="form-preview__box">
          <h1 className="form-preview__title">{formName}</h1>
          <PreviewWidget key="form" tree={formTree} ref={formRef} />
          {/* <Space style={{ marginTop: '30px' }}>
          <Button className="primary-btn">提交</Button>
          <Button className="primary-btn">保存</Button>
          <Button className="default-btn">返回</Button>
        </Space> */}
        </div>
      </Spin>
    </div>
  );
};

export default formPreview;
