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
export default function Ruler(props: any) {
  const { form, flowId, element } = props;
  const _data_ = window.localStorage.getItem('formMap');
  const _data = _data_ ? JSON.parse(_data_) : [];
  const data: any[] =
    _data == ''
      ? []
      : form == undefined
      ? []
      : Object.values(_data[form]['formily-form-schema'].schema.properties);
  const _ruleList_ = window.localStorage.getItem(`${element.id + form}`);
  const _ruleList = _ruleList_ ? JSON.parse(_ruleList_) : [];
  const [dataSource, setDataSource] = useState(data);
  const [words, setWords] = useState('');

  const [ruleList, setRuleList] = useState<ruleDTO[]>([]);
  useEffect(() => {
    let ruleList: any[] = [];
    console.log(form);
    if (_ruleList.id === element.id && form === _ruleList.formId) {
      ruleList = _ruleList.ruleList;
    } else {
      ruleList = [
        {
          andor: '',
          condition: '',
          name: '',
          value: '',
        },
      ];
    }
    setRuleList(ruleList);
  }, []);
  const [ruleWord, setRuleWord] = useState<any[]>([]);
  useEffect(() => {
    let temp = words;
    const arr = ruleWord.map((x, index) => {
      return ` ${x.andor || ''} ${x.name || ''} ${x.condition || ''} ${
        x.value || ''
      }`;
    });
    const wordTemp = arr.toString();
    setWords(wordTemp);
  }, [ruleWord]);

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
  const feildChange = (value: string, index: any) => {
    const arr = [...ruleWord];
    if (ruleWord[index]) {
      const temp: any = { ...ruleWord[index] };
      temp.name = value;
      arr[index] = temp;
    } else {
      const temp: any = {};
      temp.name = value;
      arr.push(temp);
    }
    setRuleWord(arr);
    window.localStorage.setItem(
      `${element.id + form}`,
      JSON.stringify({ id: element.id, formId: form, ruleList: arr }),
    );
  };
  const conditionChange = (value: string, index: any) => {
    console.log(value, ruleWord[index]);
    const arr = [...ruleWord];
    if (ruleWord[index]) {
      const temp: any = { ...ruleWord[index] };
      temp.condition = value;
      arr[index] = temp;
    } else {
      const temp: any = {};
      temp.condition = value;
      arr.push(temp);
    }
    setRuleWord(arr);
    window.localStorage.setItem(
      `${element.id + form}`,
      JSON.stringify({ id: element.id, formId: form, ruleList: arr }),
    );
  };
  const valueChange = (e: any, index: any) => {
    console.log(e.target.value);
    const arr = [...ruleWord];
    if (ruleWord[index]) {
      const temp: any = { ...ruleWord[index] };
      temp.value = e.target.value;
      arr[index] = temp;
    } else {
      const temp: any = {};
      temp.value = e.target.value;
      arr.push(temp);
    }
    setRuleWord(arr);
    window.localStorage.setItem(
      `${element.id + form}`,
      JSON.stringify({ id: element.id, formId: form, ruleList: arr }),
    );
  };
  const andorChange = (value: string, index: any) => {
    const arr = [...ruleWord];
    if (ruleWord[index]) {
      const temp: any = { ...ruleWord[index] };
      temp.andor = value;
      arr[index] = temp;
    } else {
      const temp: any = {};
      temp.andor = value;
      arr.push(temp);
    }
    setRuleWord(arr);
    window.localStorage.setItem(
      `${element.id + form}`,
      JSON.stringify({ id: element.id, formId: form, ruleList: arr }),
    );
  };
  const updataRuleValue = () => {};
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
              onChange={(value) => andorChange(value, index)}
            >
              <Option value="AND">AND</Option>
              <Option value="OR">OR</Option>
            </Select>
          </Col>
          <Col span={6}>
            <label>字段名称</label>
            <Select
              defaultValue={x?.name || ''}
              style={{ width: 80 }}
              onChange={(value) => feildChange(value, index)}
            >
              {dataSource.map((item) => {
                return <Option value={item.name}>{item.title}</Option>;
              })}
            </Select>
          </Col>
          <Col span={5}>
            <label>条件</label>
            <Select
              defaultValue={x?.condition || ''}
              style={{ width: 80 }}
              onChange={(value) => conditionChange(value, index)}
            >
              <Option value=">">{'>'}</Option>
              <Option value="<">{'<'}</Option>
              <Option value="=">{'='}</Option>
            </Select>
          </Col>
          <Col span={5}>
            <label>值</label>
            <Input
              defaultValue={x?.value || ''}
              style={{ width: 100 }}
              onChange={(e) => valueChange(e, index)}
            ></Input>
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
        <TextArea style={{ marginTop: 10 }} value={words} rows={4} />
      </div>
    </>
  );
}
