import './login.less';
import { Space, Select, Form, Button, Input, Row, Col, Checkbox } from 'antd';
const testImg = require('../../assets/images/登录页.png');
import { history } from 'umi';
import { useState } from 'react';

const Login = () => {
  const [showLabel, setShowLabel] = useState('');
  const onFinish = (values) => {
    history.push('homeIndex');
  };
  const changeShowLabel = (lable) => {
    if (showLabel === lable && lable === 'username') {
      return <span className="right-login__label">邮箱或用户名</span>;
    } else if (showLabel === lable && lable === 'password') {
      return <span className="right-login__label">密码</span>;
    } else {
      return <span className="right-login__label"></span>;
    }
  };
  return (
    <div className="login">
      <div className="login-card">
        {/* 左侧内容 */}
        <div className="login-card__left">
          <p className="left-title">Connectivity Asset</p>

          <Space size={20}>
            {['降本增效', '快速交付', '提高效率', '沉淀资产'].map((e) => {
              return (
                <p className="left-des" key={e}>
                  {e}
                </p>
              );
            })}
          </Space>

          <img className="left-pic" src={testImg}></img>
        </div>

        {/* 右侧内容 */}
        <div className="login-card__right">
          <Select
            defaultValue="Chinese"
            style={{
              width: 140,
              color: '#858585',
              fontSize: '16px',
            }}
            className="right-select"
          >
            <Select.Option value="Chinese">简体中文(CN)</Select.Option>
            <Select.Option value="English">英文(EN)</Select.Option>
          </Select>

          <p className="right-title">欢迎回来</p>

          <Form name="normal_login" onFinish={onFinish}>
            {/* <span className='right-login__label' >邮箱或用户名</span> */}
            {changeShowLabel('username')}
            <Form.Item name="username">
              <Input
                placeholder="请输入邮箱或用户名"
                className="right-form__input"
                onFocus={() => {
                  setShowLabel('username');
                }}
                onBlur={() => {
                  setShowLabel('');
                }}
              />
            </Form.Item>
            {/* <span className='right-login__label' >密码</span> */}
            {changeShowLabel('password')}
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入正确的密码',
                },
              ]}
            >
              <Input
                type="password"
                placeholder="请输入密码"
                className="right-form__input"
                onFocus={() => {
                  setShowLabel('password');
                }}
                onBlur={() => {
                  setShowLabel('');
                }}
              />
            </Form.Item>
            <Form.Item>
              <Row justify="space-between">
                <Col>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="right-login__checkbox">
                      记住密码
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <a className="login-form-forgot" href="">
                    忘记密码？
                  </a>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="right-login__btn"
              >
                登录
              </Button>
              {/* Or <a href="">register now!</a> */}
            </Form.Item>
          </Form>

          <div className="right-login__register">
            <span>没有账号？</span>
            <a href="" style={{ textDecoration: 'underline' }}>
              点击注册
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
