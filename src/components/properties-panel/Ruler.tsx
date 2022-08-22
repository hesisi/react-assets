import { Table, Form, Select, Col, Row, Button, Input } from 'antd';
import React, { useState } from 'react';
const { Option } = Select;

export default function Ruler() {
  return (
    <>
      <Form layout="vertical">
        <Row>
          <Col span={5}>
            <Form.Item label="AND/OR" name="and">
              <Select style={{ width: 80 }}>
                <Option value="anyone">AND</Option>
                <Option value="role">OR</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="字段名称" name="field">
              <Input></Input>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="条件" name="condition">
              <Select style={{ width: 80 }}>
                <Option value="anyone">{'>'}</Option>
                <Option value="role">{'<'}</Option>
                <Option value="person">{'='}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="值" name="value">
              <Input></Input>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button>删除</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
