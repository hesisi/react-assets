import {
  Col,
  Row,
  Button,
  Form,
  Input,
  Select,
  Carousel,
  Space,
  Table,
  Tag,
  Image,
} from 'antd';
import { nanoid } from 'nanoid';
const { Option } = Select;
import './index.less';
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import image from './test.jpg';
import { PlusOutlined } from '@ant-design/icons';

import TodoList from '@/components/todoList';
import LineChart from '@/components/lineChart';
import GaugeChart from '@/components/gaugeChart';
import ListCom from '@/components/listCom';
import CarouselBanner from '@/components/carouselBanner';

const pageBuild = forwardRef((props, ref) => {
  const [dom, setDom] = useState([]);
  const [targetDom, setTargetDom] = useState('');
  const [targetID, setTargetID] = useState('');

  const formRef = useRef(null);
  const [form] = Form.useForm();
  const width = Form.useWatch('width', form);

  // const handleChange = (value) => {
  //   console.log(`selected ${value}`);
  // };

  const addCol = () => {
    const doms = [...dom];
    doms.push({
      id: nanoid(),
      parent: 0,
      children: [],
      style: {
        height: '160px',
        borderRadius: '0px',
      },
      col: 24,
      type: '',
      component: null,
      componentName: '',
    });

    setDom(doms);
  };
  const save = () => {
    formRef.current.submit();
  };
  const selectDom = (e, x) => {
    props.setSelectId(x.id);
    e.stopPropagation();
    setTargetID(x.id);
    formRef.current.setFieldsValue({
      target: x.id,
      col: x.col,
      height: x.style.height,
      radius: x.style.borderRadius,
      type: x.type,
    });
  };
  const setDomStyle = (form) => {
    const doms = [...dom];
    doms.map((x) => {
      if (x.id == targetID) {
        x.style = {
          width: form.width,
          height: form.type == 'table' ? '290px' : form.height,
          background: form.type == 'table' ? '#ffffff' : '',
          borderRadius: form.type === 'table' ? '0px' : form.radius,
        };
        (x.col = form.col), (x.type = form.type);
      }
      return x;
    });
    setDom(doms);
  };
  const clearPanel = () => {
    setTargetID('');
    formRef.current.setFieldsValue({
      target: '',
      col: '',
      width: '',
      height: '',
      radius: '',
    });
  };
  const onFinish = (values) => {
    setDomStyle(values);
  };
  const preview = () => {
    window.localStorage.setItem('layoutTemplate', JSON.stringify(dom));
  };
  useImperativeHandle(ref, () => ({
    preview,
  }));

  function renderChild(children) {
    return children.map((child) => (
      <Col
        span={child.col}
        style={{ padding: '5px 5px 0' }}
        key={child.id}
        onClick={(e) => {
          selectDom(e, child);
        }}
      >
        <div
          className={child.parent ? 'childItem' : 'addedItem'}
          id={child.id}
          style={{ ...child.style }}
        ></div>
      </Col>
    ));
  }
  const contentStyle = {
    height: '160px',
    borderRadius: '0px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const tableData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const Template = (props) => {
    const { type } = props;
    if (type == 'banner') {
      return (
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
      );
    } else if (type == 'table') {
      return <Table columns={tableColumns} dataSource={tableData} />;
    } else if (type == 'image') {
      return <Image width={200} src={image} />;
    } else {
      return <></>;
    }
  };

  const renderComponent = (com, id) => {
    console.log('renderComponent', com, targetID, id);
    switch (com) {
      case 'standard-pic':
        return (
          <CarouselBanner className="dom-component dom-component__carousel" />
        );
      case 'standard-todo':
        return <TodoList className="dom-component dom-component__todo" />;
      case 'standard-charts':
        return (
          <LineChart id={targetID ? targetID : id} className="dom-component" />
        );
      case 'standard-board':
        return (
          <GaugeChart id={targetID ? targetID : id} className="dom-component" />
        );
      case 'standard-list':
        return <ListCom className="dom-component dom-component__todo" />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    let domArr = dom.map((e) => {
      if (e.id === targetID) {
        e.component = renderComponent(props.component[0], e.id);
        e.componentName = props.component[0];
      }
      return e;
    });
    if (localStorage.getItem('layoutTemplate')) {
      domArr = JSON.parse(localStorage.getItem('layoutTemplate')).map((e) => {
        e.component = renderComponent(e.componentName, e.id);
        return e;
      });
    }
    setDom(domArr);
  }, [props.component]);

  const renderDoms = (arr) => {
    return (
      <Row>
        {arr.map((x) => (
          <Col
            span={x.col}
            style={{ padding: '5px 5px 0' }}
            key={x.id}
            onClick={(e) => {
              selectDom(e, x);
            }}
          >
            <div
              className={
                x.id == targetID ? 'active-build addedItem' : 'addedItem'
              }
              // id={x.id}
              style={{ ...x.style }}
            >
              {x.component ? (
                <>{x.component}</>
              ) : (
                <>
                  <PlusOutlined
                    style={{ color: '#1890ff', fontSize: '30px' }}
                  />
                  <p className="dom-text">请从组件库选择您想放置的组件</p>
                </>
              )}
            </div>
          </Col>
        ))}
      </Row>
    );
  };
  const handleDelete = () => {
    const doms = [...dom];
    const newArr = doms.filter((x) => x.id != targetID);
    setDom(newArr);
    clearPanel();
  };

  return (
    <div style={{ padding: '10px', height: '100%' }}>
      <Row style={{ height: '100%' }}>
        <Col span={18}>
          <div className="build-cont" onClick={() => clearPanel()}>
            {renderDoms(dom)}
          </div>
        </Col>
        <Col span={6}>
          <div className="right-menu">
            <div className={'tool'}>
              <Button
                type="primary"
                id={'test1'}
                onClick={addCol}
                style={{ marginRight: '10px' }}
              >
                Add Col
              </Button>
              {/* <Button type="primary" id={'test1'} onClick={preview}>
                Save
              </Button> */}
            </div>
            <div className={'cont-panel'}>
              <h4>属性</h4>
              <Form
                ref={formRef}
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                onFinish={onFinish}
                initialValues={{
                  target: '',
                }}
              >
                <Form.Item label="Target" name="target">
                  <Input disabled={true} value={targetID} />
                </Form.Item>
                {/*<Form.Item*/}
                {/*  label="Width"*/}
                {/*  name="width"*/}
                {/*>*/}
                {/*  <Input />*/}
                {/*</Form.Item>*/}
                <Form.Item label="Col-Span" name="col">
                  <Input />
                </Form.Item>
                <Form.Item label="Height" name="height">
                  <Input />
                </Form.Item>
                <Form.Item label="Radius" name="radius">
                  <Input />
                </Form.Item>
                {/* <Form.Item label="Type" name="type">
                  <Select
                    defaultValue=""
                    style={{ width: 120 }}
                    onChange={handleChange}
                  >
                    <Option value="table">Table</Option>
                    <Option value="banner">Banner</Option>
                    <Option value="image">Image</Option>
                  </Select>
                </Form.Item> */}
              </Form>
              <div style={{ padding: '10px' }}>
                <Button onClick={save} style={{ marginRight: '10px' }}>
                  Save
                </Button>
                <Button onClick={handleDelete} style={{ marginRight: '10px' }}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default pageBuild;
