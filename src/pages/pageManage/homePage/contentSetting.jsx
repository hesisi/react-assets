import { Tabs } from 'antd';
const { TabPane } = Tabs;

const contentSetting = (props) => {
  return (
    <div className="sider">
      <Tabs defaultActiveKey="components">
        <TabPane tab="组件" key="components">
          {/* TODO:方便查看，记得删除 */}
          <span>当前选中的：{props.selectId}</span>
        </TabPane>
        <TabPane tab="区域" key="region"></TabPane>
      </Tabs>
    </div>
  );
};

export default contentSetting;
