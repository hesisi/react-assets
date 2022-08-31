import { Transfer, Tree, Input } from 'antd';
import React, { useState, useMemo, useRef } from 'react';
import { cloneDeep } from 'lodash';

const RoleTransfer = ({ transIdenty = '' }) => {
  const [targetKeys, setTargetKeys] = useState([]);
  const treeC = useRef(null);
  const treeDirection = useRef(null);
  treeDirection.current = 'left';
  treeC.current =
    transIdenty === '人员'
      ? [
          {
            key: '0-0',
            title: 'nick',
            children: [
              { key: '0-0-0', title: '张三' },
              { key: '0-0-1', title: '李四' },
            ],
          },
          {
            key: '0-1',
            title: '0-1',
            children: [
              { key: '0-1-0', title: '0-1-0' },
              { key: '0-1-1', title: '0-1-1' },
            ],
          },
          { key: '0-2', title: '0-2' },
        ]
      : [
          {
            key: '0-0',
            title: '系统管理',
            children: [
              { key: '0-0-0', title: '用户管理' },
              {
                key: '0-0-1',
                title: '角色管理',
                children: [
                  { key: '0-0-1-0', title: '角色信息' },
                  { key: '0-0-1-1', title: '角色用户' },
                  { key: '0-0-1-2', title: '功能权限' },
                ],
              },
              { key: '0-0-2', title: '菜单权限' },
            ],
          },
          {
            key: '0-1',
            title: '品牌监控',
          },
          { key: '0-2', title: '人物画像' },
          { key: '0-3', title: '竞品分析' },
        ];
  const [treeData, setTreeData] = useState(treeC.current);
  const TreeTransfer = ({
    dataSource,
    dataSourceRight,
    targetKeys,
    ...restProps
  }) => {
    const transferDataSource = [];
    const transferDataSourceRight = [];
    // const dataSourceData = dataSource;
    function flatten(list = [], identy = 'left') {
      list.forEach((item) => {
        if (identy === 'left') {
          transferDataSource.push(item);
        } else {
          transferDataSourceRight.push(item);
        }
        flatten(item.children, identy);
      });
    }
    flatten(dataSource);
    flatten(dataSourceRight, 'right');
    const generateTree = (
      treeNodes = [],
      checkedKeys = [],
      identy = 'left',
    ) => {
      // if (treeDirection.current !== identy) {
      //   return
      // }
      return treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled:
          identy === 'left'
            ? checkedKeys.includes(props.key)
            : !checkedKeys.includes(props.key),
        children: generateTree(children, checkedKeys, identy),
      }));
    };

    const isChecked = (selectedKeys, eventKey) =>
      selectedKeys.includes(eventKey);

    /* 树搜索 */
    const filterArrForKey = (tree, searchValue) => {
      if (!(tree && tree.length)) {
        return [];
      }
      let newArr = [];
      newArr = tree.map((item) => {
        if (item?.title?.indexOf(searchValue) !== -1) {
          return item;
        }
        if (item.children && item.children.length) {
          const newChildren = filterArrForKey(item.children, searchValue);
          if (newChildren && newChildren.length) {
            return {
              ...item,
              children: newChildren,
            };
          }
          return null;
        }
        return null;
      });
      newArr = newArr.filter((item) => item != null);
      return newArr;
    };

    /* 构建右树 */
    const creatRightTree = (tree, targetsKeys = []) => {
      console.log(targetsKeys, '78--------');
      if (!(tree && tree.length) || !targetsKeys?.length) {
        return [];
      }
      let newArr = [];
      newArr = tree.map((item) => {
        if (targetsKeys.includes(item.key)) {
          return item;
        }
        if (item.children && item.children.length) {
          const newChildren = creatRightTree(item.children, targetsKeys);
          if (newChildren && newChildren.length) {
            return {
              ...item,
              children: newChildren,
            };
          }
          return null;
        }
        return null;
      });
      newArr = newArr.filter((item) => item != null);
      console.log(newArr, '99-----');
      return newArr;
    };
    let rightTreeData = creatRightTree(treeC.current, targetKeys);
    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        className="tree-transfer"
        showSearch
        listStyle={{
          width: 300,
          height: 400,
        }}
        selectAllLabels={[
          ({ selectedCount, totalCount }) => (
            <span className="trans-title">
              {`全部${transIdenty}`}
              <span>
                {selectedCount}/{totalCount}
              </span>
            </span>
          ),
          ({ selectedCount, totalCount }) => (
            <span className="trans-title">
              {`全部${transIdenty}`}
              <span>
                {selectedCount}/{totalCount}
              </span>
            </span>
          ),
        ]}
        showSelectAll={true}
        render={(item) => item.title}
        rowKey={(record) => record.key}
        locale={{
          searchPlaceholder: '请输入关键字',
          selectAll: '全部',
          itemUnit: '',
          itemsUnit: '',
        }}
        onSearch={(dir, val) => {
          if (dir === 'left') {
            const newDeptList = filterArrForKey(treeC.current, val);
            dataSource = newDeptList;
            return;
          }
          if (dir === 'right') {
            const newDeptList = filterArrForKey(rightTreeData, val);
            dataSourceRight = newDeptList;
          }
        }}
      >
        {({
          direction,
          onItemSelect,
          onItemSelectAll,
          onSelectAll,
          selectedKeys,
        }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys];
            return (
              <Tree
                height={200}
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                disableCheckbox={true}
                treeData={generateTree(dataSource, targetKeys, 'left')}
                onCheck={(_, { node: { key } }) => {
                  treeDirection.current = direction;
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
            );
          }
          {
            /* 右侧树 */
          }
          if (direction === 'right') {
            const checkedKeys = [...selectedKeys];
            return (
              <Tree
                height={200}
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                disableCheckbox={true}
                treeData={generateTree(
                  creatRightTree(dataSourceRight, targetKeys),
                  targetKeys,
                  'right',
                )}
                onCheck={(_, { node: { key } }) => {
                  treeDirection.current = direction;
                  console.log(treeDirection.current, '181-----');
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  console.log(direction, '184-----');
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
            );
          }
        }}
      </Transfer>
    );
  };

  const onChange = (keys) => {
    setTargetKeys(keys);
  };

  return (
    <TreeTransfer
      dataSource={treeData}
      dataSourceRight={cloneDeep(treeData)}
      targetKeys={targetKeys}
      onChange={onChange}
    />
  );
};

export default RoleTransfer;
