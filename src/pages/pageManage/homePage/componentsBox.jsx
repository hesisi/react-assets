import { Input, Tree } from 'antd';
import React, { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
const { Search } = Input;
const x = 3;
const y = 2;
const z = 1;
const defaultData = [
  {
    key: 'standard',
    title: '标准',
    children: [
      { key: 'standard-1', title: '主页图片' },
      { key: 'standard-2', title: '待办事项提醒' },
      { key: 'standard-3', title: '仪表盘' },
    ],
  },
];

const dataList = [];

const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({
      key,
      title: data[i].title,
    });

    if (node.children) {
      generateList(node.children);
    }
  }
};

generateList(defaultData);

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

const componentsBox = (props) => {
  const [expandedKeys, setExpandedKeys] = useState(['standard']);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [active, setActive] = useState(nanoid());

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
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
          };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData);
  }, [searchValue]);

  const onSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    if (selectedNodes[0]) {
      props.setComKey([...props.comKey, selectedNodes[0].key]);
    }
    props.setActive(nanoid());
  };
  return (
    <div>
      <Search
        style={{
          marginBottom: 8,
        }}
        placeholder="Search"
        onChange={onChange}
        allowClear={true}
      />
      {treeData.length > 0 && (
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={treeData}
          defaultExpandParent={true}
          defaultExpandAll={true}
          onSelect={onSelect}
        />
      )}
    </div>
  );
};

export default componentsBox;
