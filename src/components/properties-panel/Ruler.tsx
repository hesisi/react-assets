import { Table, Form, Select, Col, Row, Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
const { Option } = Select;
const { TextArea } = Input;
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface ruleDTO {
  /**条件*/
  condition: string;
  /**字段名称*/
  name: string;
  /**and/or*/
  andor: string;
  /**条件值*/
  value: string;
}
export default function Ruler() {
  const [ruleList, setRuleList] = useState<ruleDTO[]>([]);
  useEffect(() => {
    setRuleList([
      {
        andor: '',
        condition: '',
        name: '',
        value: '',
      },
    ]);
  }, []);
  const addLine = () => {
    const temp = [...ruleList];
    temp.push({
      andor: '',
      condition: '',
      name: '',
      value: '',
    });
    setRuleList(temp);
  };
  const removeLine = (index: any) => {
    const temp = [...ruleList];
    temp.splice(index, 1);
    setRuleList(temp);
  };

  return (
    <>
      {ruleList.map((x, index) => (
        <Row key={index} style={{ marginBottom: 10, marginTop: 10 }}>
          <Col span={5}>
            <label>AND/OR</label>
            <Select
              defaultValue={x?.andor || ''}
              style={{ width: 80 }}
              disabled={index === 0}
            >
              <Option value="anyone">AND</Option>
              <Option value="role">OR</Option>
            </Select>
          </Col>
          <Col span={6}>
            <label>字段名称</label>
            <Select defaultValue={x?.name || ''} style={{ width: 80 }}>
              <Option value="field1">{'field1'}</Option>
              <Option value="field2">{'field2'}</Option>
              <Option value="field3">{'field3'}</Option>
            </Select>
          </Col>
          <Col span={5}>
            <label>条件</label>
            <Select defaultValue={x?.condition || ''} style={{ width: 80 }}>
              <Option value="anyone">{'>'}</Option>
              <Option value="role">{'<'}</Option>
              <Option value="person">{'='}</Option>
            </Select>
          </Col>
          <Col span={5}>
            <label>值</label>
            <Input defaultValue={x?.value || ''} style={{ width: 100 }}></Input>
          </Col>
          <Col
            span={3}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <a
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => removeLine(index)}
            >
              <DeleteOutlined />
            </a>
          </Col>
        </Row>
      ))}
      <div>
        <Button type="dashed" icon={<PlusCircleOutlined />} onClick={addLine}>
          增加行
        </Button>
      </div>
      <div style={{ marginTop: 10 }}>
        <label>条件表达式</label>
        <TextArea style={{ marginTop: 10 }} rows={4} />
      </div>
    </>
  );
}
