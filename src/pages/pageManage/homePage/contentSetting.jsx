import { Tabs, InputNumber, Input, Form } from 'antd';
const { TabPane } = Tabs;

const contentSetting = (props) => {
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
      default:
        break;
    }
  };

  const onFormInputChange = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className="sider">
      <Tabs defaultActiveKey="components">
        <TabPane tab="组件" key="components">
          {/* TODO:方便查看，记得删除 */}
          <span>当前选中的：{props.selectId}</span>
        </TabPane>
        <TabPane tab="区域" key="region">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              colGap: 10,
              bg: '#fafafa',
              colGapColor: '#ffffff',
            }}
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
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default contentSetting;
