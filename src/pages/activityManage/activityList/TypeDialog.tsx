import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table, Modal, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PlusOutlined, MinusCircleFilled } from '@ant-design/icons';
import { Message } from 'element-react';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  typeIndex: string;
  typeName: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title}不能为空.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  typeIndex: string;
  typeName: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export default function TypeDialog(props: any) {
  const _processGroup = window.localStorage.getItem('processGroup') || '';
  const processGroup =
    _processGroup != ''
      ? JSON.parse(_processGroup)
      : [
          {
            key: 1,
            typeIndex: '1',
            typeName: '默认分组',
          },
        ];
  const { isTypeVisible, setIsTypeVisible } = props;
  const [dataSource, setDataSource] = useState<DataType[]>(processGroup);

  const [count, setCount] = useState(
    processGroup[processGroup.length - 1].key + 1,
  );

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: '80px',
      render: (_: any, record: { key: React.Key }) => {
        const findId = dataSource.findIndex((item) => item.key === record.key);
        if (findId === 0) {
          return null;
        } else {
          return dataSource.length >= 1 ? (
            //   <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.key)}>
            //     <a>删除</a>
            //   </Popconfirm>
            <MinusCircleFilled
              onClick={() => handleDelete(record.key)}
              style={{ color: '#40a9ff', fontSize: '20px' }}
            />
          ) : null;
        }
      },
    },
    {
      title: '编号',
      dataIndex: 'key',
      width: '80px',
      render: (_: any, record: { key: React.Key }) => {
        const findId = dataSource.findIndex((item) => item.key === record.key);
        console.log(findId);
        return <span>{findId + 1}</span>;
      },
    },
    {
      title: '流程分组',
      dataIndex: 'typeName',
      editable: true,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      typeIndex: `${count}`,
      typeName: `新建分组${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.typeIndex === item.typeIndex);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const SaveLocal = async () => {
    window.localStorage.setItem('processGroup', JSON.stringify(dataSource));
    console.log(dataSource);
    setIsTypeVisible(false);
  };

  return (
    <div>
      <Modal
        title="流程分组"
        visible={isTypeVisible}
        onOk={SaveLocal}
        onCancel={() => {
          setIsTypeVisible(false);
          setDataSource(processGroup);
        }}
        className="default-modal"
        cancelText="取消"
        okText="确认"
      >
        <PlusOutlined
          onClick={handleAdd}
          style={{ color: '#40a9ff', fontSize: '20px' }}
        />
        <Table
          components={components}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
        />
      </Modal>
    </div>
  );
}
