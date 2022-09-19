import './login.less';
import {
  Space,
  Select,
  Form,
  Button,
  Input,
  Row,
  Col,
  Checkbox,
  message,
} from 'antd';
const testImg = require('../../assets/images/登录页.png');
import { history } from 'umi';
import { useState } from 'react';

const Login = () => {
  const [showLabel, setShowLabel] = useState('');
  const onFinish = (values) => {
    if (values.password1 !== values.password2) {
      message.error('两次输入的密码不同，请确认后重新输入');
      return;
    }
    localStorage.setItem('username', values.username);
    history.push('login');
  };
  const changeShowLabel = (label) => {
    // 修改显示label
    if (showLabel === label && label === 'username') {
      return <span className="right-login__label">邮箱/手机/账号</span>;
    } else if (showLabel === label && label === 'password1') {
      return <span className="right-login__label">新密码</span>;
    } else if (showLabel === label && label === 'password2') {
      return <span className="right-login__label">确认密码</span>;
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

          <div className="right-title__reset">
            <p className="title-reset">修改默认密码</p>
            <a href="/login" className="title-link">
              跳过
            </a>
          </div>

          <Form name="normal_login" onFinish={onFinish}>
            {changeShowLabel('username')}
            <Form.Item name="username">
              <Input
                placeholder="请输入邮箱/手机号/账号"
                className="right-form__input"
                onFocus={() => {
                  setShowLabel('username');
                }}
                onBlur={() => {
                  setShowLabel('');
                }}
              />
            </Form.Item>

            {/* 输入密码 */}
            {changeShowLabel('password1')}
            <Form.Item
              name="password1"
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
                  setShowLabel('password1');
                }}
                onBlur={() => {
                  setShowLabel('');
                }}
                autoComplete="off"
              />
            </Form.Item>

            {/* 二次确认密码 */}
            {changeShowLabel('password2')}
            <Form.Item
              name="password2"
              rules={[
                {
                  required: true,
                  message: '请输入正确的密码',
                },
              ]}
            >
              <Input
                type="password"
                placeholder="请再次输入密码"
                className="right-form__input"
                onFocus={() => {
                  setShowLabel('password2');
                }}
                onBlur={() => {
                  setShowLabel('');
                }}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="right-login__btn btn-confirm"
              >
                确认
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
