/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-05 17:21:04
 */
import { Table, Button, message, Modal } from 'antd';
import { PreviewWidget } from '../../Desinger/widgets';
import { useEffect, useRef, useState, useMemo } from 'react';
import { transformToTreeNode } from '@designable/formily-transformer';

export default function IndexPage(props) {
  const [visible, setVisible] = useState(false);
  const [operateType, setOperateType] = useState('add');
  const [formTree, setFormTree] = useState(null);
  const [tableTree, setTableTree] = useState(null);
  const [formSchema, setFormSchema] = useState({
    'formily-form-schema': null,
    'formily-table-schema': null,
  });

  const tableRef = useRef(null);
  const formRef = useRef(null);

  const formCode = useMemo(() => {
    return props.location.query.formCode;
  });

  useEffect(() => {
    const formMap =
      localStorage.getItem('formMap') &&
      JSON.parse(localStorage.getItem('formMap'));
    console.log(formMap[formCode]);
    setFormSchema(formMap[formCode]);

    const formilyTableSchema =
      formMap[formCode] && formMap[formCode]['formily-table-schema'];
    const formilyFormSchema =
      formMap[formCode] && formMap[formCode]['formily-form-schema'];
    if (formilyTableSchema) {
      setTableTree(transformToTreeNode(formilyTableSchema));
    }

    if (formilyFormSchema) {
      setFormTree(transformToTreeNode(formilyFormSchema));
    }
  }, []);

  // const handleValidate = () => {
  // 	// formRef.current.form.validate();
  // 	form.validate()
  // }

  // const handleReset = () => {
  // 	// form.reset();
  // 	form.values = {}
  // }

  // const handleGetValues = () => {
  // 	const values = form.values;
  // 	message.info(`表单的值为: ${JSON.stringify(values)}`)
  // }

  const handleAssign = () => {
    const initValue = {
      userName: '张三',
      description: '这是描述内容XXXXX',
      password: '123456',
      rate: 3,
      type: '2',
      time: '09:23:18',
      test1: {
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      },
      test2: {
        value1: 'value1',
        value2: 'value2',
        value3: 'value3',
      },
    };

    form.values = initValue;
  };

  const handleReadOnly = () => {
    form.disabled = true;
  };

  const handlePreview = () => {
    form.editable = false;
  };

  const handleSetFieldValue = () => {
    // form.setValues('userName', 'zhangsan')
    form.values.userName = 'username';
  };

  const handleAdd = () => {
    setOperateType('add');
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  // 弹框确认
  const handleOk = () => {
    const form = formRef.current.form;
    // form.validate().then(values => {
    // 	console.log("====values:",values)
    // })

    console.log('=====', tableRef.current.form.values);
    const values = tableRef.current.form.values;
    // tableRef.current.form = [form.values]

    // form.validate(values => {
    // console.log("====values:", form.values)
    // })
  };

  return (
    <div>
      {/* <div style={{margin: "10px 0"}}>
				<Button type="primary" style={{margin: '0 10px'}} onClick={handleValidate}>校验</Button>

				<Button type="primary" style={{margin: '0 10px'}} onClick={handleReset}>清空</Button>

				<Button type="primary" style={{margin: '0 10px'}} onClick={handleAssign}>赋值</Button>

				<Button type="primary" style={{margin: '0 10px'}} onClick={handleReadOnly}>禁用</Button>

				<Button type="primary" style={{margin: '0 10px'}} onClick={handlePreview}>预览模式</Button>

				<Button type="primary" style={{margin: '0 10px'}} onClick={handleGetValues}>获取值</Button>

				<Button type="primary" style={{margin: '0 10px'}} onClick={handleSetFieldValue}>setFiledValue</Button>
			</div> */}

      {/* 操作按钮 */}
      <div>
        <Button onClick={handleAdd}>新建</Button>
      </div>

      {/* 列表 */}
      <PreviewWidget
        key="table"
        tree={tableTree}
        ref={tableRef}
        // handleAdd={handleAdd}
        // slot={{
        // 	Custom:
        // }}
      />

      {/* 弹框: 表格 */}
      <Modal
        visible={visible}
        title={operateType === 'add' ? '新增' : '修改'}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <PreviewWidget key="form" tree={formTree} ref={formRef} />
      </Modal>
    </div>
  );
}
