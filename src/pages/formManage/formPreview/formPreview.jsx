import { PageHeader, Space, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { PreviewWidget } from '@/pages/Desinger/widgets';
import { transformToTreeNode } from '@designable/formily-transformer';
import { history } from 'umi';

const formPreview = (props) => {
  const [formTree, setFormTree] = useState(null);
  const formRef = useRef(null);
  const [formName, setFormName] = useState('');
  const [showPageTitle, setShowPageTitle] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    // 表单
    const formCode = history?.location?.query?.formCode || props.formCode;
    const formColumn = JSON.parse(window.localStorage.getItem('formMap'));
    if (!formColumn) return;
    const formItemObj = formColumn[formCode]['formily-form-schema'];
    if (formItemObj) {
      formItemObj.form = { ...formItemObj.form, layout: 'vertical' };
      setFormTree(transformToTreeNode(formItemObj));
    }

    const formList = JSON.parse(window.localStorage.getItem('formList'));
    if (!formList) return;
    const formName =
      formList.filter((e) => e.formCode === formCode)[0]?.formName || '';
    setFormName(formName);
    setShowPageTitle(props.showPageTitle);
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

      <div className="form-preview__box">
        <h1 className="form-preview__title">{formName}</h1>
        <PreviewWidget key="form" tree={formTree} ref={formRef} />
        <Space style={{ marginTop: '30px' }}>
          <Button className="primary-btn">提交</Button>
          <Button className="primary-btn">保存</Button>
          <Button className="default-btn">返回</Button>
        </Space>
      </div>
    </div>
  );
};

export default formPreview;
