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
import './layoutPreview.less';
import React, { useEffect, useState, useRef } from 'react';
import image from '../../assets/test.jpg';

export default function pageBuid() {
  let domStorage = window.localStorage.getItem('layoutTemplate');
  const [dom, setDom] = useState([]);
  useEffect(() => {
    setDom(JSON.parse(domStorage));
  }, []);
  const [targetDom, setTargetDom] = useState('');
  const [targetID, setTargetID] = useState('');

  const formRef = useRef(null);
  const [form] = Form.useForm();
  const width = Form.useWatch('width', form);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const addCol = () => {
    const doms = [...dom];
    doms.push({
      id: nanoid(),
      parent: 0,
      children: [],
      style: {
        height: '160px',
      },
      col: 24,
      type: '',
    });

    setDom(doms);
  };
  const save = () => {
    formRef.current.submit();
  };
  const selectDom = (e, x) => {
    e.stopPropagation();
    setTargetID(x.id);
    formRef.current.setFieldsValue({
      target: x.id,
      col: x.col,
      height: x.style.height,
      type: x.type,
    });
    console.log(form);
  };
  const setDomStyle = (form) => {
    console.log(form);
    const doms = [...dom];
    doms.map((x) => {
      if (x.id == targetID) {
        x.style = {
          width: form.width,
          height: form.type == 'table' ? '290px' : form.height,
          background: form.type == 'table' ? '#ffffff' : '',
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
    });
  };
  const onFinish = (values) => {
    console.log('Success:', values);
    setDomStyle(values);
  };
  const preview = () => {};
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
              className={x.id == targetID ? 'active addedItem' : 'addedItem'}
              id={x.id}
              style={{ ...x.style }}
            >
              <Template type={x.type}></Template>
            </div>
          </Col>
        ))}
      </Row>
    );
  };
  const handleDelete = () => {
    const doms = [...dom];
    console.log(targetID);
    const newArr = doms.filter((x) => x.id != targetID);
    console.log(newArr);
    setDom(newArr);
    clearPanel();
  };
  return (
    <div style={{ padding: '10px', height: '100%' }}>
      <Row style={{ height: '100%' }}>
        <Col span={24}>
          <div className="build-cont" onClick={() => clearPanel()}>
            {renderDoms(dom)}
          </div>
        </Col>
      </Row>
    </div>
  );
}
