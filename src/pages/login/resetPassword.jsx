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
  Tooltip,
} from 'antd';
const testImg = require('../../assets/images/登录页.png');
import { history } from 'umi';
import { useState, useRef } from 'react';
import { getUserChangePasswd } from '@/services/userManager';
import { QuestionCircleOutlined } from '@ant-design/icons';

const Login = () => {
  const [showLabel, setShowLabel] = useState('');
  const formRef = useRef(null);
  const reg =
    /^(?![a-z]+$)(?![A-Z]+$)(?![\W_]+$)(?![0-9]+$)[a-zA-Z0-9\W_]{8,12}$/;
  // /^(?![d]+$)(?![a-z]+$)(?![A-Z]+$)(?![\x21-\x7e]+$)[da-zA-z]{8,12}$/;

  // 表单提交
  const onFinish = (values) => {
    setPassword({ id: values.username, pwd: values.password1 });
  };

  // 调用接口重设密码
  const setPassword = (params) => {
    getUserChangePasswd({ ...params })
      .then((res) => {
        localStorage.setItem('username', params.id);
        history.push('login');
      })
      .catch(() => {
        message.error('修改密码失败，请稍后再试');
      });
  };

  // 修改显示label
  const changeShowLabel = (label) => {
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

  // 跳过修改密码
  const jumpToLogin = () => {
    const { username } = formRef.current.getFieldsValue();
    setPassword({ id: username, pwd: '' });
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
            <Button type="link" className="title-link" onClick={jumpToLogin}>
              跳过
            </Button>
          </div>

          <Form name="normal_login" onFinish={onFinish} ref={formRef}>
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
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('请输入正确的密码');
                    } else if (reg.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('密码不符合规范');
                    }
                  },
                }),
              ]}
            >
              <Input
                type="password"
                placeholder="请输入密码"
                className="right-form__input"
                onFocus={() => {
                  setShowLabel('password1');
                }}
                onBlur={(e) => {
                  setShowLabel('');
                }}
                autoComplete="off"
                suffix={
                  <Tooltip title="英文字母大写、小写、数字、特殊字符，需要至少包含其中2个，8~12位数。">
                    <QuestionCircleOutlined style={{ color: '#c5bfbf' }} />
                  </Tooltip>
                }
              />
            </Form.Item>

            {/* 二次确认密码 */}
            {changeShowLabel('password2')}
            <Form.Item
              name="password2"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('请输入正确的密码');
                    } else if (value === getFieldValue('password1')) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        '两次输入的密码不同，请确认后重新输入',
                      );
                    }
                  },
                }),
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
                suffix={
                  <Tooltip title="英文字母大写、小写、数字、特殊字符，需要至少包含其中2个，8~12位数。">
                    <QuestionCircleOutlined style={{ color: '#c5bfbf' }} />
                  </Tooltip>
                }
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
