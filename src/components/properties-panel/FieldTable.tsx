import { Space, Table, Checkbox, Radio } from 'antd';
import { useState, useEffect } from 'react';

export default function FieldTable(props: any) {
  const { form, targetFormSet, flowId, setTargetForm } = props;
  // console.log('----------------->')
  // console.log(targetFormSet)
  // console.log(form)
  const formMap = window.localStorage.getItem('formMap');
  const formMapJSON = formMap ? JSON.parse(formMap) : null;
  const _radioList_ = window.localStorage.getItem(`${form + flowId}`);
  const _radioList = _radioList_ ? JSON.parse(_radioList_) : [];

  /**获取选择的form表单字段*/
  let data: any[] = [];
  if (formMapJSON && form) {
    data = Object.values(
      formMapJSON[form]['formily-form-schema'].schema.properties,
    );
  }

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (targetFormSet) {
      setDataSource(targetFormSet.formField);
    } else {
      setDataSource(data);
    }
  }, [form]);

  const onChange = (e: any, record: any) => {
    const temp = dataSource.map((x) => {
      // console.log('record',record)
      if (x.name === record.name) {
        x.edit = e.target.value;
      }
      return x;
    });
    setDataSource(temp);
    // console.log(temp);
    /**保存表单设置*/
    const formSetting = {
      formCode: form,
      formField: temp,
    };
    setTargetForm(formSetting);
    // window.localStorage.setItem(
    //   `${form + flowId}`,
    //   JSON.stringify({ flowId: flowId, formId: form, temp: temp }),
    // );
  };
  const columns = [
    {
      title: '字段名称',
      dataIndex: 'title',
      key: 'x-designable-id',
    },
    {
      title: '权限',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: any) => {
        // console.log('record------------', record);
        return (
          // <Checkbox
          //   // checked={type === 'bpmn:StartEvent'}
          //   onChange={(e) => onChange(e, record)}
          // ></Checkbox>
          <Radio.Group
            onChange={(e) => onChange(e, record)}
            defaultValue={'edit'}
            value={record.edit}
          >
            <Radio style={{ fontWeight: '400' }} value={'edit'}>
              可编辑
            </Radio>
            <Radio style={{ fontWeight: '400' }} value={'readOnly'}>
              仅可见
            </Radio>
            <Radio style={{ fontWeight: '400' }} value={'hide'}>
              隐藏
            </Radio>
          </Radio.Group>
        );
      },
    },
  ];

  return (
    <>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        style={{ marginTop: 10 }}
      />
    </>
  );
}
