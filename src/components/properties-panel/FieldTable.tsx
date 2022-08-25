import { Space, Table, Checkbox } from 'antd';
import { useState, useEffect } from 'react';

export default function FieldTable(props: any) {
  const data = [
    {
      key: '1',
      fieldName: '申请人',
      edit: false,
      readOnly: false,
      hide: false,
    },
    {
      key: '2',
      fieldName: '休假类型',
      edit: false,
      readOnly: false,
      hide: false,
    },
    {
      key: '3',
      fieldName: '开始日期',
      edit: false,
      readOnly: false,
      hide: false,
    },
    {
      key: '4',
      fieldName: '结束日期',
      edit: false,
      readOnly: false,
      hide: false,
    },
    {
      key: '5',
      fieldName: '请假原因',
      edit: false,
      readOnly: false,
      hide: false,
    },
    {
      key: '6',
      fieldName: '上传附件',
      edit: false,
      readOnly: false,
      hide: false,
    },
  ];
  const [dataSource, setDataSource] = useState(data);

  const onChange = (e: any, record: any) => {
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
        return (
          <Checkbox
            defaultChecked
            onChange={(e) => onChange(e, record)}
          ></Checkbox>
        );
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
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        style={{ marginTop: 10 }}
      />
    </>
  );
}
