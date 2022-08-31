import {
  Table,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Rate,
  DatePicker,
  Space,
  Popconfirm,
  Row,
  Col,
  InputNumber,
  Slider,
  Password,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CloseOutlined,
  SearchOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import React, {
  useState,
  useMemo,
  useRef,
  createElement,
  useContext,
} from 'react';
import { nanoid } from 'nanoid';
import moment from 'moment';
import './index.less';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const App = (props) => {
  // const [formVisible, setFormVisible] = useState(true); //TODO:
  const [formVisible, setFormVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editFlag, setEditFlag] = useState(false);
  const [index, setIndex] = useState(-1);
  const formRef = useRef(null);
  const searchFormRef = useRef(null);

  const formColumn = JSON.parse(window.localStorage.getItem('formMap'));
  const formItemObj =
    formColumn[props.formCode]['formily-form-schema']?.schema?.properties;
  const labelCol =
    formColumn[props.formCode]['formily-form-schema']['form']['labelCol'];
  const wrapperCol =
    formColumn[props.formCode]['formily-form-schema']['form']['wrapperCol'];
  const formItem = [];
  const searchItem = [];
  const tableProp =
    formColumn[props.formCode]['formily-table-schema']?.schema?.properties[
      'f47t417jdf5'
    ]['properties'];

  const objSetFunc = (data, arr) => {
    for (let key in data) {
      arr.push({
        name: data[key].title || data[key].name,
        label: data[key].title,
        type: data[key]['x-component'],
        rules: [
          {
            required: data[key]?.required || false,
            message: `please input ${data[key].title}`,
          },
        ],
        id: data[key]['x-designable-id'],
      });
    }
  };
  objSetFunc(formItemObj, formItem);
  objSetFunc(tableProp, searchItem);

  const formInit = {};
  const searchFormInit = {};
  const objInit = (data, obj) => {
    if (!data) return;
    // 遍历map生成对象
    const keyList = Object.keys(data);
    keyList.forEach((e) => {
      obj[e] = null;
    });
  };
  objInit(formItemObj, formInit);
  objInit(tableProp, searchFormInit);
  const FormattedDateTime = (dateString) => {
    const year = dateString.getFullYear();
    const momth = (dateString.getMonth() + 1).toString().padStart(2, '0');
    const date = dateString.getDate().toString().padStart(2, '0');
    return `${year}-${momth}-${date}`;
  };
  // 设置表格
  const columnsInit = formItem.map((e) => {
    switch (e.type) {
      case 'DatePicker':
        return {
          title: e.label,
          dataIndex: e.name,
          key: e.id,
          render: (time) => {
            if (time && moment(time)._isAMomentObject) {
              return moment(time).format('YYYY-MM-DD');
            } else if (typeof time === 'string') {
              return FormattedDateTime(new Date(time));
            }
            return '';
          },
        };

      default:
        return {
          title: e.label,
          dataIndex: e.name,
          key: e.id,
        };
    }
  });
  const columns = columnsInit.concat({
    title: 'operation',
    dataIndex: 'operation',
    render: (_, record, index) => {
      return (
        <>
          <Button
            type="link"
            onClick={() => {
              rowDelete(_, record, index);
            }}
          >
            Delete
          </Button>
          <Button
            type="link"
            onClick={() => {
              rowEdit(_, record, index);
            }}
          >
            Edit
          </Button>
        </>
      );
    },
  });

  const rowDelete = (_, record, index) => {
    //  行删除
    if (index === 0 && dataSource.length === 1) {
      setDataSource([]);
    } else {
      setDataSource(dataSource.filter((e, i) => i !== index));
    }
  };
  const rowEdit = (_, record, index) => {
    //  行编辑
    setIndex(index);
    setEditFlag(true);
    setFormVisible(true);
    for (let e in record) {
      const reg = /^(\d{4})-(\d{2})-(\d{2})$/g;
      if (
        record[e] &&
        record[e].length > 10 &&
        reg.test(record[e]?.slice(0, 10))
      ) {
        record[e] = moment(record[e]);
      }
    }
    formRef.current.setFieldsValue(record);
  };

  const handleOk = () => {
    formRef.current.validateFields().then(() => {
      // 表单提交
      if (!editFlag) {
        setDataSource([
          ...dataSource,
          { ...formRef.current.getFieldsValue(), key: nanoid() },
        ]);
      } else {
        // 编辑
        const arr = [...dataSource];
        arr[index] = {
          ...formRef.current.getFieldsValue(),
          key: arr[index].key,
        };
        setDataSource(arr);
      }

      setEditFlag(false);
      setFormVisible(false);
      formRef.current.resetFields();
    });
  };

  const handleCancel = () => {
    // 取消
    formRef.current.resetFields();
    setFormVisible(false);
    setEditFlag(false);
  };

  const createElementList = (type) => {
    switch (type) {
      case 'Input':
        return <Input />;
      case 'Input.TextArea':
        return <TextArea rows={4} />;
      case 'Rate':
        return <Rate />;
      case 'NumberPicker':
        return <InputNumber />;
      case 'DatePicker':
        return <DatePicker picker="date" />;
      case 'Slider':
        return <Slider />;

      default:
        break;
    }
  };

  const onSearch = () => {
    window.localStorage.setItem('dataSource', JSON.stringify(dataSource));

    if (dataSource.length === 0) return;
    const obj = { ...searchFormRef.current.getFieldsValue() };
    const keys = Object.keys(searchFormRef.current.getFieldsValue());
    const values = Object.values(searchFormRef.current.getFieldsValue()).filter(
      (e) => e !== null,
    );
    if (values.length === 0) return;
    const arr = [];
    dataSource.forEach((item) => {
      keys.forEach((e) => {
        if (item[e]?.indexOf(obj[e]) === undefined) return;
        if (item[e]?.indexOf(obj[e]) !== -1) {
          arr.push(item);
        }
      });
    });
    setDataSource([...new Set(arr)]);
  };

  const onReset = () => {
    searchFormRef.current.resetFields();
    setDataSource(JSON.parse(window.localStorage.getItem('dataSource')));
  };

  return (
    <div className="test-app">
      {/* 表单对话框 */}
      <Modal
        title="Basic Modal"
        visible={formVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{
            span: labelCol,
          }}
          wrapperCol={{
            span: wrapperCol,
          }}
          initialValues={formInit}
          ref={formRef}
        >
          {formItem.map((e) => (
            <Form.Item label={e.name} name={e.name} rules={e.rules} key={e.id}>
              {/* TODO:delete */}
              {createElementList(e.type)}
            </Form.Item>
          ))}
        </Form>
      </Modal>

      <Space direction="vertical" size={30}>
        <Row wrap justify="space-between">
          <Col>
            <Form
              name="basic"
              labelCol={{
                span: labelCol,
              }}
              wrapperCol={{
                span: wrapperCol,
              }}
              initialValues={searchFormInit}
              ref={searchFormRef}
              layout="inline"
            >
              {searchItem.map((e) => (
                <Form.Item
                  label={e.name}
                  name={e.name}
                  rules={e.rules}
                  key={e.id}
                >
                  {createElementList(e.type)}
                </Form.Item>
              ))}
            </Form>
          </Col>

          <Col span={5}>
            <Space>
              <Button
                onClick={() => {
                  setFormVisible(true);
                }}
                type="primary"
              >
                <PlusOutlined />
                add
              </Button>

              <Button onClick={onSearch}>
                <SearchOutlined />
                search
              </Button>

              <Button onClick={onReset} type="primary">
                <RedoOutlined />
                reset
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ position: ['none', 'none'] }}
        />
      </Space>
    </div>
  );
};

export default App;
