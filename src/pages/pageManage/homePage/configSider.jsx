import { Tabs, Tree, Input, Button } from 'antd';
const { TabPane } = Tabs;
const { Search } = Input;
import {
  SnippetsOutlined,
  DesktopOutlined,
  PlusOutlined,
  DownOutlined,
  OrderedListOutlined,
  BarChartOutlined,
  BarsOutlined,
  DashboardOutlined,
  PictureOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

import { useState, useMemo, useEffect } from 'react';

import './index.less';
import { TreeSelect } from '@formily/antd';

const templateTree = [
  {
    title: '默认模板',
    key: 'default',
    children: [
      {
        title: '单区域',
        key: 'default-single',
        // icon: <DesktopOutlined />,
      },
      {
        title: '页眉和三区域',
        key: 'default-header-three',
        // icon: <DesktopOutlined />,
      },
      {
        title: '上二下三',
        key: 'default-two-three',
        // icon: <DesktopOutlined />,
      },
    ],
  },
  {
    title: '自定义模板',
    key: '1-0',
    children: [],
  },
];
const componentsTree = [
  {
    title: '基本类型',
    key: 'standard',
    children: [
      {
        title: '图片容器',
        key: 'standard-pic',
        icon: <PictureOutlined />,
      },
      {
        title: '今日待办事项',
        key: 'standard-todo',
        icon: <OrderedListOutlined />,
      },
      {
        title: '仪表盘',
        key: 'standard-board',
        icon: <DashboardOutlined />,
      },
      {
        title: '列表视图',
        key: 'standard-list',
        icon: <BarsOutlined />,
      },
      {
        title: '报表图表',
        key: 'standard-charts',
        icon: <BarChartOutlined />,
      },
      // {
      //   title: '富文本',
      //   key: 'standard-editor',
      //   icon: <SnippetsOutlined />,
      // },
    ],
  },
  {
    title: '自定义组件',
    key: 'customer',
    children: [
      {
        title: '',
        key: 'standard-charts',
        icon: (
          <PlusOutlined
            style={{
              fontSize: '22px',
              border: '1px dashed #ccc',
              padding: '4px 14px',
            }}
          />
        ),
      },
    ],
  },
];

// 检索树的前置处理
const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({
      key,
      title: data[i].title,
      icon: data[i].icon,
    });

    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(componentsTree);
const getParentKey = (key, tree) => {
  let parentKey;

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];

    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }

  return parentKey;
};

// 组件生成
const configSider = (props) => {
  const [expandedKeys, setExpandedKeys] = useState(['standard']);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState('');

  const operations = {
    template: <Button type="link">{/* <PlusSquareOutlined /> */}</Button>,
    components: <Button type="link">{/* <PlusSquareOutlined /> */}</Button>,
  };

  const onExpand = (newExpandedKeys) => {
    // 展开树
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e) => {
    // 检索框变化
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, componentsTree);
        }

        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const treeData = useMemo(() => {
    // 检索标红
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.title;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );

        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children),
            icon: item.icon,
          };
        }

        return {
          title,
          key: item.key,
          icon: item.icon,
        };
      });

    return loop(componentsTree);
  }, [searchValue]);

  const treeSelect = (key, type) => {
    // 选中树
    switch (type) {
      case 'component': // 组件
        props.setComponent(key);
        break;
      case 'template': // 模板
        props.setTemplate(key);
        if (window.localStorage.getItem('homeDom')) {
          window.localStorage.removeItem('homeDom');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="sider">
      <div style={{ display: 'flex' }} className="menutab first">
        <BarsOutlined
          className="operation_icon"
          style={{
            color: '#333333',
            position: 'relative',
            top: '16px',
            right: '8px',
            fontSize: '18px',
          }}
        />
        <Tabs tabBarExtraContent={operations.template}>
          <TabPane tab="模板">
            <Tree
              switcherIcon={<DownOutlined />}
              defaultExpandedKeys={['default']}
              treeData={templateTree}
              arrow
              onSelect={(e) => {
                treeSelect(e, 'template');
              }}
            />
          </TabPane>
        </Tabs>
      </div>

      <div style={{ display: 'flex' }} className="menutab second">
        <DatabaseOutlined
          className="operation_icon"
          style={{
            color: '#333333',
            position: 'relative',
            top: '18px',
            right: '8px',
            fontSize: '16px',
          }}
        />
        <Tabs tabBarExtraContent={operations.components}>
          <TabPane tab="组件">
            <Search
              style={{
                marginBottom: 8,
              }}
              placeholder="Search"
              onChange={onChange}
            />
            <Tree
              treeData={treeData}
              showIcon
              switcherIcon={<DownOutlined />}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              defaultExpandParent={true}
              defaultExpandAll={true}
              onSelect={(e) => {
                treeSelect(e, 'component');
              }}
              selectedKeys={selectedKeys}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default configSider;
