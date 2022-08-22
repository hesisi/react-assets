import { Space, Table, Checkbox } from 'antd';
import { useState, useEffect } from 'react';

export default function FieldTable(props: any) {
  const data = [
    {
      key: '1',
      fieldName: '标题',
      edit: false,
      readOnly: false,
      hide: false,
    },
    {
      key: '2',
      fieldName: '类型',
      edit: false,
      readOnly: false,
      hide: false,
    },
  ];
  const [dataSource, setDataSource] = useState(data);

  const onChange = (e: any, record: any) => {
    console.log(e);
    console.log(record);
    console.log(`checked = ${e.target.checked}`);
    const temp = dataSource.map((x) => {
      if (x.fieldName === record.name) {
        x.edit = !x.edit;
      }
      return x;
    });
    setDataSource(temp);
  };
  const columns = [
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: '可编辑',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: any) => {
        return <Checkbox onChange={(e) => onChange(e, record)}></Checkbox>;
      },
    },
    {
      title: '仅可见',
      dataIndex: 'readOnly',
      key: 'readOnly',
      render: (_: any, record: any) => {
        return <Checkbox onChange={(e) => onChange(e, record)}></Checkbox>;
      },
    },
    {
      title: '隐藏',
      dataIndex: 'disable',
      key: 'disable',
      render: (_: any, record: any) => {
        return <Checkbox onChange={(e) => onChange(e, record)}></Checkbox>;
      },
    },
  ];

  return (
    <>
      <Table pagination={false} dataSource={dataSource} columns={columns} />
    </>
  );
}
