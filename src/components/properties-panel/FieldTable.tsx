import { Space, Table, Checkbox, Radio } from 'antd';
import { useState, useEffect } from 'react';

export default function FieldTable(props: any) {
  const { form, type, flowId } = props;
  const _data_ = window.localStorage.getItem('formMap');
  const _data = _data_ ? JSON.parse(_data_) : [];
  const _radioList_ = window.localStorage.getItem(`${form + flowId}`);
  const _radioList = _radioList_ ? JSON.parse(_radioList_) : [];
  console.log('form', form);
  const data: any[] =
    _data == ''
      ? []
      : form == undefined
      ? []
      : Object.values(_data[form]['formily-form-schema'].schema.properties);
  const [dataSource, setDataSource] = useState(data);
  useEffect(() => {
    let temp: any[] = [];
    if (_radioList.formId === form) {
      temp = _radioList.temp;
    } else {
      temp = data;
    }

    setDataSource(temp);
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
    console.log(dataSource);
    window.localStorage.setItem(
      `${form + flowId}`,
      JSON.stringify({ flowId: flowId, formId: form, temp: temp }),
    );
  };
  const columns = [
    {
      title: '字段名称',
      dataIndex: 'title',
      key: 'x-designable-id',
    },
    {
      title: '可编辑',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: any) => {
        console.log('record------------', record);
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
    // {
    //   title: '仅可见',
    //   dataIndex: 'readOnly',
    //   key: 'readOnly',
    //   render: (_: any, record: any) => {
    //     return (
    //       <Checkbox
    //         // checked={type === 'bpmn:UserTask' || type === 'bpmn:Task'}
    //         onChange={(e) => onChange(e, record)}
    //       ></Checkbox>
    //     );
    //   },
    // },
    // {
    //   title: '隐藏',
    //   dataIndex: 'hide',
    //   key: 'hide',
    //   render: (_: any, record: any) => {
    //     return <Checkbox onChange={(e) => onChange(e, record)}></Checkbox>;
    //   },
    // },
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
