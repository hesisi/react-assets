import './login.less';
import { Space, Select, Form, Button, Input, Row, Col, Checkbox } from 'antd';
const testImg = require('../../assets/images/登录页.png');

const Login = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
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
            <Form.Item name="username">
              <Input
                placeholder="请输入邮箱或用户名"
                className="right-form__input"
                style={{
                  marginBottom: '20px',
                }}
              />
            </Form.Item>
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
