import { useEffect, useRef } from 'react';
import { Tabs, InputNumber, Input, Form } from 'antd';
const { TabPane } = Tabs;

const contentSetting = (props) => {
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
          bg: e.target.value,
        });
        break;
      case 'colGapColor':
        props.setProperty({
          ...props.property,
          colGapColor: e.target.value,
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

  return (
    <div className="sider">
      <Tabs defaultActiveKey="region">
        <TabPane tab="组件" key="components">
          {/* TODO:方便查看，记得删除 */}
          <span>当前选中的：{props.selectId}</span>
        </TabPane>
        <TabPane tab="区域" key="region">
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              colGap: '10',
              colGapColor: '#ffffff',
              bg: '#fafafa',
            }}
            form={form}
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
              <Input onChange={(e) => onChange(e, 'colGapColor')} />
            </Form.Item>

            <Form.Item label="背景色" name="bg">
              <Input onChange={(e) => onChange(e, 'bg')} />
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
};

export default contentSetting;
