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
import { useState, useEffect } from 'react';
import { userLogin, getUserLoginValidatePic } from '@/services/userLogin';
const Login = () => {
  const [showLabel, setShowLabel] = useState('');
  const [validatePic, setValidatePic] = useState('');
  const [validateUuid, setValidateUuid] = useState('');
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    const params = {
      ...values,
      uuid: validateUuid,
    };
    userLogin(params)
      .then((res) => {
        if (res?.data?.isSuccess > 0) {
          const { data } = res.data;
          window.localStorage.setItem('loginToken', data.token);
          window.localStorage.setItem('username', params.username) || '';
          if (!data.isReset) {
            history.push('resetPassword');
          } else {
            history.push('homeIndex');
          }
        }
        //  else {
        //   message.error(res?.data?.message);
        // }
      })
      .catch(() => {
        // 报错时，重新请求验证码
        form.setFieldValue('code', '');
        getValidatePic();
      });
  };
  const changeShowLabel = (lable) => {
    if (showLabel === lable && lable === 'username') {
      return <span className="right-login__label">邮箱或用户名</span>;
    } else if (showLabel === lable && lable === 'password') {
      return <span className="right-login__label">密码</span>;
    } else if (showLabel === lable && lable === 'code') {
      return <span className="right-login__label">验证码</span>;
    } else {
      return <span className="right-login__label"></span>;
    }
  };
  const getValidatePic = () => {
    getUserLoginValidatePic().then((res) => {
      if (res?.data?.isSuccess > 0) {
        setValidatePic('data:image/jpg;base64,' + res.data.data.img);
        setValidateUuid(res.data.data.uuid);
      } else {
        message.error(res?.data?.message);
      }
    });
  };
  useEffect(() => {
    getValidatePic();
    form.setFieldValue(
      'username',
      window.localStorage.getItem('username') || '',
    );
  }, []);

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

          <Form name="normal_login" onFinish={onFinish} form={form}>
            {/* <span className='right-login__label' >邮箱或用户名</span> */}
            {changeShowLabel('username')}
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '用户名不能为空！',
                },
              ]}
            >
              <Input
                type="username"
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
            {changeShowLabel('code')}
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: '验证码不能为空！',
                },
              ]}
            >
              <Row justify="space-between" wrap={false}>
                <Col>
                  <Input
                    type="code"
                    placeholder="请输入验证码"
                    className="right-form__input"
                    onFocus={() => {
                      setShowLabel('code');
                    }}
                    onBlur={() => {
                      setShowLabel('');
                    }}
                  />
                </Col>
                <Col>
                  <img
                    className="valid-pic"
                    src={validatePic}
                    alt="验证码"
                    onClick={() => {
                      getValidatePic();
                    }}
                  ></img>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
