import { useEffect, useRef, forwardRef, useState } from 'react';
import { SwapOutlined } from '@ant-design/icons';
import {
  Tabs,
  InputNumber,
  Input,
  Form,
  Collapse,
  Switch,
  Button,
  Modal,
} from 'antd';
const { Panel } = Collapse;
const { TabPane } = Tabs;
import './contentSetting.less';
const contentSetting = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const onChange = (e, type) => {
    switch (type) {
      case 'colGap':
        props.setProperty({
          ...props.property,
          colGap: `${e}px`,
        });
        break;
      case 'bg':
        props.setProperty({
          ...props.property,
          bg: `#${e.target.value}`,
        });
        break;
      case 'colGapColor':
        props.setProperty({
          ...props.property,
          colGapColor: `#${e.target.value}`,
        });
        break;
      case 'radius':
        props.setProperty({
          ...props.property,
          radius: `${e}px`,
        });
        break;
      // case 'height':
      //   props.setProperty({
      //     ...props.property,
      //     height: e.target.value,
      //   });
      //   break;
      // case 'width':
      //   props.setProperty({
      //     ...props.property,
      //     width: e.target.value,
      //   });
      //   break;
      default:
        break;
    }
  };
  const [xShow, setXshow] = useState();
  const [tabShow, setTabShow] = useState();
  const [wordShow, setWordShow] = useState();
  const [isActive, setIsActive] = useState('first');
  const [yShow, setYshow] = useState();
  const [tabYShow, setTabYShow] = useState();
  const [wordYShow, setWordYShow] = useState();
  const [isTabActive, setIsTabActive] = useState('first');
  const [title, setTitle] = useState();
  const [isTitleRowActive, setIsTitleActive] = useState('left');
  const [isTitleColumnActive, setIsTitleColumnActive] = useState('top');

  const [labelShow, setLabelShow] = useState();

  const [dealMethodActive, setDealMethodActive] = useState('first');

  const [getMethodActive, setGetMethodActive] = useState('first');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [xAxisProps, setXAxisProp] = useState({
    xFontSize: 0,
  });
  // 此处是eCHARTS图表配置的方法
  const changeSwitch = (e, type) => {
    switch (type) {
      case 'x':
        setXshow(e);
        break;
      case 'y':
        setYshow(e);
        break;
      case 'tab':
        setTabShow(e);
        break;
      case 'tabY':
        setTabYShow(e);
        break;
      case 'word':
        setWordShow(e);
        break;
      case 'wordY':
        setWordYShow(e);
        break;
      case 'title':
        setTitle(e);
        break;
      case 'label':
        setLabelShow(e);
        break;
    }
    // props.getDataFrom({value:e,type})
  };
  const changeIsActive = (data) => {
    data === 'first' ? setIsActive('first') : setIsActive('second');
  };
  const changeIsTabActive = (data) => {
    data === 'first' ? setIsTabActive('first') : setIsTabActive('second');
  };
  const changeIsTitleRowActive = (data) => {
    switch (data) {
      case 'left':
        setIsTitleActive('left');
        break;
      case 'middle':
        setIsTitleActive('middle');
        break;
      case 'right':
        setIsTitleActive('right');
        break;
      default:
        break;
    }
  };
  const changeIsTitleColumnActive = (data) => {
    switch (data) {
      case 'top':
        setIsTitleColumnActive('top');
        break;
      case 'middle':
        setIsTitleColumnActive('middle');
        break;
      case 'bottom':
        setIsTitleColumnActive('bottom');
        break;
      default:
        break;
    }
  };
  const changeDealMethodActive = (data) => {
    data === 'first'
      ? setDealMethodActive('first')
      : setDealMethodActive('second');
  };
  const changeGetMethodActive = (data) => {
    data === 'first'
      ? setGetMethodActive('first')
      : setGetMethodActive('second');
  };
  const changeFontSize = (e) => {
    setXAxisProp({ xFontSize: e });
    props.getDataFrom({ value: xAxisProps });
  };
  // useEffect(() => {
  //   form.resetFields();
  //   const ele = document.getElementById(`${props.selectId}`);
  //   if (!ele) return;
  //   if (ele.style.maxWidth) {
  //     form.setFieldValue('width', ele.style.maxWidth.slice(0, -2));
  //   }
  //   if (ele.style.height) {
  //     form.setFieldValue('height', ele.style.height.slice(0, -2));
  //   }
  // }, [props.selectId]);
  const handleCancel = (data) => {
    setIsModalVisible(data);
  };

  return (
    <div className="sider">
      <Modal
        title="自定义方法转换数据"
        centered
        footer={null}
        visible={isModalVisible}
        onCancel={() => handleCancel(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>

        <p>Some contents...</p>
      </Modal>
      <Tabs defaultActiveKey="region">
        <TabPane tab="组件" key="components">
          {props.componentData[0] === 'standard-charts' && props.selectId ? (
            //此处是对图文报表的配置
            <div className="echarts_style">
              <Collapse accordion>
                <Panel header="X轴配置" key="1">
                  <div>
                    <span className="spanName">X轴线显示</span>
                    <Switch onChange={(e) => changeSwitch(e, 'x')}></Switch>
                  </div>
                  {xShow ? (
                    <div>
                      <div>
                        <span className="spanName">轴线类型</span>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isActive === 'first'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isActive === 'first' ? '#fff' : '#000',
                            borderBottomLeftRadius: '4px',
                            borderTopLeftRadius: '4px',
                          }}
                          onClick={() => changeIsActive('first')}
                        >
                          实线
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isActive === 'second'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isActive === 'second' ? '#fff' : '#000',
                            borderBottomRightRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                          onClick={() => changeIsActive('second')}
                        >
                          虚线
                        </button>
                      </div>
                      <div className="formInput">
                        <span className="spanName">颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <span className="spanName">网格线</span>
                    <Switch onChange={(e) => changeSwitch(e, 'tab')}></Switch>
                  </div>
                  {tabShow ? (
                    <div>
                      <div>
                        <span className="spanName">轴线类型</span>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTabActive === 'first'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isTabActive === 'first' ? '#fff' : '#000',
                            borderBottomLeftRadius: '4px',
                            borderTopLeftRadius: '4px',
                          }}
                          onClick={() => changeIsTabActive('first')}
                        >
                          实线
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTabActive === 'second'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isTabActive === 'second' ? '#fff' : '#000',
                            borderBottomRightRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                          onClick={() => changeIsTabActive('second')}
                        >
                          虚线
                        </button>
                      </div>
                      <div className="formInput">
                        <span className="spanName">颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <span className="spanName">文字</span>
                    <Switch onChange={(e) => changeSwitch(e, 'word')}></Switch>
                  </div>
                  {wordShow ? (
                    <div>
                      <div className="formInput">
                        <span className="spanName">颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">字体大小</span>
                        <InputNumber
                          addonAfter="px"
                          onChange={(e) => changeFontSize(e)}
                        />
                      </div>
                    </div>
                  ) : null}
                </Panel>
                <Panel header="Y轴配置" key="2">
                  <div>
                    <span className="spanName">Y轴线显示</span>
                    <Switch onChange={(e) => changeSwitch(e, 'y')}></Switch>
                  </div>
                  {yShow ? (
                    <div>
                      <div>
                        <span className="spanName">轴线类型</span>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isActive === 'first'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isActive === 'first' ? '#fff' : '#000',
                            borderBottomLeftRadius: '4px',
                            borderTopLeftRadius: '4px',
                          }}
                          onClick={() => changeIsActive('first')}
                        >
                          实线
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isActive === 'second'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isActive === 'second' ? '#fff' : '#000',
                            borderBottomRightRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                          onClick={() => changeIsActive('second')}
                        >
                          虚线
                        </button>
                      </div>
                      <div className="formInput">
                        <span className="spanName">颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <span className="spanName">网格线</span>
                    <Switch onChange={(e) => changeSwitch(e, 'tabY')}></Switch>
                  </div>
                  {tabYShow ? (
                    <div>
                      <div>
                        <span className="spanName">轴线类型</span>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTabActive === 'first'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isTabActive === 'first' ? '#fff' : '#000',
                            borderBottomLeftRadius: '4px',
                            borderTopLeftRadius: '4px',
                          }}
                          onClick={() => changeIsTabActive('first')}
                        >
                          实线
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTabActive === 'second'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color: isTabActive === 'second' ? '#fff' : '#000',
                            borderBottomRightRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                          onClick={() => changeIsTabActive('second')}
                        >
                          虚线
                        </button>
                      </div>
                      <div className="formInput">
                        <span className="spanName">颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <span className="spanName">文字</span>
                    <Switch onChange={(e) => changeSwitch(e, 'wordY')}></Switch>
                  </div>
                  {wordYShow ? (
                    <div>
                      <div className="formInput">
                        <span className="spanName">颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">字体大小</span>
                        <InputNumber addonAfter="px" />
                      </div>
                    </div>
                  ) : null}
                </Panel>
                <Panel header="位置配置" key="3">
                  <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{
                      left: '20',
                      right: '20',
                      bottom: '20',
                      top: '20',
                    }}
                  >
                    <Form.Item label="上边距" name="top">
                      <InputNumber
                        // onChange={(e) => onChange(e, 'radius')}
                        addonAfter="px"
                      />
                    </Form.Item>

                    <Form.Item label="右边距" name="right">
                      <InputNumber
                        // onChange={(e) => onChange(e, 'radius')}
                        addonAfter="px"
                      />
                    </Form.Item>

                    <Form.Item label="下边距" name="bottom">
                      <InputNumber
                        // onChange={(e) => onChange(e, 'radius')}
                        addonAfter="px"
                      />
                    </Form.Item>

                    <Form.Item label="左边距" name="left">
                      <InputNumber
                        // onChange={(e) => onChange(e, 'radius')}
                        addonAfter="px"
                      />
                    </Form.Item>
                  </Form>
                </Panel>
                <Panel header="标题配置" key="4">
                  <div>
                    <span className="spanName">标题开关</span>
                    <Switch onChange={(e) => changeSwitch(e, 'title')}></Switch>
                  </div>
                  {title ? (
                    <div>
                      <div className="formInput">
                        <span className="spanName">标题内容</span>
                        <Input placeholder="标题" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">标题颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">标题背景</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                      <div>
                        <span className="spanName">水平对齐</span>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTitleRowActive === 'left'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color:
                              isTitleRowActive === 'left' ? '#fff' : '#000',
                            borderBottomLeftRadius: '4px',
                            borderTopLeftRadius: '4px',
                          }}
                          onClick={() => changeIsTitleRowActive('left')}
                        >
                          居左
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTitleRowActive === 'middle'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color:
                              isTitleRowActive === 'middle' ? '#fff' : '#000',
                          }}
                          onClick={() => changeIsTitleRowActive('middle')}
                        >
                          居中
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTitleRowActive === 'right'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color:
                              isTitleRowActive === 'right' ? '#fff' : '#000',
                            borderBottomRightRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                          onClick={() => changeIsTitleRowActive('right')}
                        >
                          居右
                        </button>
                      </div>
                      <div>
                        <span className="spanName">垂直对齐</span>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTitleColumnActive === 'top'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color:
                              isTitleColumnActive === 'top' ? '#fff' : '#000',
                            borderBottomLeftRadius: '4px',
                            borderTopLeftRadius: '4px',
                          }}
                          onClick={() => changeIsTitleColumnActive('top')}
                        >
                          顶部
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTitleColumnActive === 'middle'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color:
                              isTitleColumnActive === 'middle'
                                ? '#fff'
                                : '#000',
                          }}
                          onClick={() => changeIsTitleColumnActive('middle')}
                        >
                          居中
                        </button>
                        <button
                          className="buttonBtn"
                          style={{
                            backgroundColor:
                              isTitleColumnActive === 'bottom'
                                ? '#1890ff'
                                : 'rgb(232 232 232)',
                            color:
                              isTitleColumnActive === 'bottom'
                                ? '#fff'
                                : '#000',
                            borderBottomRightRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                          onClick={() => changeIsTitleColumnActive('bottom')}
                        >
                          底部
                        </button>
                      </div>
                      <div className="formInput">
                        <span className="spanName">字体大小</span>
                        <InputNumber addonAfter="px" />
                      </div>
                    </div>
                  ) : null}
                </Panel>
                <Panel header="标签配置" key="5">
                  <div>
                    <span className="spanName">文本标签</span>
                    <Switch onChange={(e) => changeSwitch(e, 'label')}></Switch>
                  </div>
                  {labelShow ? (
                    <div>
                      <div className="formInput">
                        <span className="spanName">标签颜色</span>
                        <Input placeholder="rgba(0,0,0,0)" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">字体大小</span>
                        <InputNumber addonAfter="px" />
                      </div>
                    </div>
                  ) : null}
                </Panel>
                <Panel header="显示配置" key="6">
                  <div>
                    <div className="formInput">
                      <span className="spanName">背景色</span>
                      <Input placeholder="rgba(0,0,0,0)" />
                    </div>
                    <div className="formInput">
                      <span className="spanName">柱体宽度</span>
                      <InputNumber addonAfter="%" />
                    </div>
                    <div className="formInput">
                      <span className="spanName">线条宽度</span>
                      <InputNumber addonAfter="%" />
                    </div>
                    <div>
                      <span className="spanName">展示比例</span>
                      <Switch></Switch>
                    </div>
                    <div className="formInput">
                      <span className="spanName">面积透明度</span>
                      <InputNumber max={1} min={0} />
                    </div>
                  </div>
                </Panel>
                <Panel header="数据字典" key="7">
                  <div>
                    <span className="spanName">获取方式</span>
                    <button
                      className="buttonBtn"
                      style={{
                        backgroundColor:
                          getMethodActive === 'first'
                            ? '#1890ff'
                            : 'rgb(232 232 232)',
                        color: getMethodActive === 'first' ? '#fff' : '#000',
                        borderBottomLeftRadius: '4px',
                        borderTopLeftRadius: '4px',
                      }}
                      onClick={() => changeGetMethodActive('first')}
                    >
                      静态数据
                    </button>
                    <button
                      className="buttonBtn"
                      style={{
                        backgroundColor:
                          getMethodActive === 'second'
                            ? '#1890ff'
                            : 'rgb(232 232 232)',
                        color: getMethodActive === 'second' ? '#fff' : '#000',
                        borderBottomRightRadius: '4px',
                        borderTopRightRadius: '4px',
                      }}
                      onClick={() => changeGetMethodActive('second')}
                    >
                      API接口
                    </button>
                  </div>
                  {getMethodActive === 'first' ? (
                    <div>
                      <div className="formInput">
                        <span className="spanName">静态数据</span>
                        <textarea
                          placeholder="必须为json格式"
                          style={{ outline: 'none', borderColor: '#e6e6e6' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="formInput">
                        <span className="spanName">请求方式</span>
                        <select
                          style={{
                            outline: 'none',
                            borderColor: '#e6e6e6',
                            width: '160px',
                          }}
                        >
                          <option value="GET请求">GET请求</option>
                          <option value="POST请求">POST请求</option>
                        </select>
                      </div>
                      <div className="formInput">
                        <span className="spanName">接口地址</span>
                        <textarea
                          placeholder="请输入api接口请求地址"
                          style={{ outline: 'none', borderColor: '#e6e6e6' }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="formInput">
                    <span className="spanName">data</span>
                    <Input placeholder="data值-对应字典" />
                  </div>
                  <div className="formInput">
                    <span className="spanName">name</span>
                    <Input placeholder="name值-对应字典" />
                  </div>
                  <div className="formInput">
                    <span className="spanName">value</span>
                    <Input placeholder="value值-对应字典" />
                  </div>
                  <div className="formInput">
                    <span className="spanName">series</span>
                    <Input placeholder="series值-对应字典" />
                  </div>
                  <div className="formInput">
                    <span className="spanName">total</span>
                    <Input placeholder="total值-对应字典" />
                  </div>
                </Panel>
                <Panel header="数据处理" key="8">
                  <div>
                    <span className="spanName">处理方式</span>
                    <button
                      className="buttonBtn"
                      style={{
                        backgroundColor:
                          dealMethodActive === 'first'
                            ? '#1890ff'
                            : 'rgb(232 232 232)',
                        color: dealMethodActive === 'first' ? '#fff' : '#000',
                        borderBottomLeftRadius: '4px',
                        borderTopLeftRadius: '4px',
                      }}
                      onClick={() => changeDealMethodActive('first')}
                    >
                      字段映射
                    </button>
                    <button
                      className="buttonBtn"
                      style={{
                        backgroundColor:
                          dealMethodActive === 'second'
                            ? '#1890ff'
                            : 'rgb(232 232 232)',
                        color: dealMethodActive === 'second' ? '#fff' : '#000',
                        borderBottomRightRadius: '4px',
                        borderTopRightRadius: '4px',
                      }}
                      onClick={() => changeDealMethodActive('second')}
                    >
                      方法转换
                    </button>
                  </div>
                  {dealMethodActive === 'first' ? (
                    <div>
                      <div className="formInput">
                        <span className="spanName">data</span>
                        <Input placeholder="data" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">name</span>
                        <Input placeholder="name" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">value</span>
                        <Input placeholder="value" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">series</span>
                        <Input placeholder="series" />
                      </div>
                      <div className="formInput">
                        <span className="spanName">total</span>
                        <Input placeholder="total" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="formInput">
                        <span className="spanName">处理方法</span>
                        <Button
                          type="primary"
                          onClick={() => handleCancel(true)}
                          icon={<SwapOutlined />}
                        >
                          编辑转换方法
                        </Button>
                      </div>
                    </div>
                  )}
                </Panel>
                <Panel header="关联字段" key="9">
                  <div className="formInput">
                    <span className="spanName">关联字段</span>
                    <Input placeholder="请输入API请求必传字段" />
                  </div>
                </Panel>
              </Collapse>
            </div>
          ) : (
            <span>当前选中的：{props.selectId}</span>
          )}
        </TabPane>
        <TabPane tab="区域" key="region">
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              colGap: '10',
              colGapColor: 'ffffff',
              bg: 'fafafa',
              radius: '0',
            }}
            form={form}
            ref={ref}
          >
            <Form.Item label="间隙" name="colGap">
              <InputNumber
                onChange={(e) => {
                  onChange(e, 'colGap');
                }}
                addonAfter="px"
              />
            </Form.Item>

            <Form.Item label="间隙色" name="colGapColor">
              <Input
                onChange={(e) => onChange(e, 'colGapColor')}
                addonBefore="#"
              />
            </Form.Item>

            <Form.Item label="背景色" name="bg">
              <Input onChange={(e) => onChange(e, 'bg')} addonBefore="#" />
            </Form.Item>

            <Form.Item label="圆角" name="radius">
              <InputNumber
                onChange={(e) => onChange(e, 'radius')}
                addonAfter="px"
              />
            </Form.Item>

            {/* <Form.Item label="宽度" name="width">
              <Input onChange={(e) => onChange(e, 'width')} addonAfter="px" />
            </Form.Item>

            <Form.Item label="高度" name="height">
              <Input onChange={(e) => onChange(e, 'height')} addonAfter="px" />
            </Form.Item> */}
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
});

export default contentSetting;
