import { Transfer, Tree, Input, Empty } from 'antd';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import localForage from 'localforage';
import { cloneDeep } from 'lodash';
import { creatRightTree, filterArrForKey } from './treeUtil';

const RoleTransfer = ({
  transIdenty = '',
  groupItem,
  treeUserData = [],
  transData,
  transTargetKeys,
  saveRoleUser,
}) => {
  const [targetKeys, setTargetKeys] = useState([]);
  const checkedLeftKeys = useRef(null);
  const checkedRightKeys = useRef(null);
  const treeC = useRef(null);
  const treeDirection = useRef(null);
  const treeRight = useRef(null);
  treeDirection.current = 'left';
  treeC.current = [];
  treeRight.current = [];
  const [treeData, setTreeData] = useState(treeC.current);

  const onChange = async (keys) => {
    saveRoleUser && saveRoleUser(keys);
    setTargetKeys(keys);
  };

  const TreeTransfer = ({
    dataSource,
    dataSourceRight,
    targetKeys,
    ...restProps
  }) => {
    const transferDataSource = [];
    const transferDataSourceRight = [];

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

    /* 构造树 控制树节点disabled属性 */
    const generateTree = (
      treeNodes = [],
      checkedKeys = [],
      identy = 'left',
    ) => {
      return treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled:
          identy === 'left'
            ? checkedKeys.includes(props.key)
            : !checkedKeys.includes(props.key),
        children: generateTree(children, checkedKeys, identy),
      }));
    };

    let rightTreeData = creatRightTree(treeC.current, targetKeys);

    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        // onSelectChange={handleSelectChange}
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
            const checkedKeys = Array.from(
              new Set([...selectedKeys, ...targetKeys]),
            );
            return dataSource?.length ? (
              <Tree
                height={280}
                blockNode
                checkable
                // checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                disableCheckbox={true}
                treeData={generateTree(dataSource, targetKeys, 'left')}
                onCheck={(_, e) => {
                  const { node, halfCheckedKeys, checkedNodes } = e;
                  checkedLeftKeys.current = _;
                  onItemSelectAll(selectedKeys, false);
                  const selectItems = _.filter(
                    (item) => !targetKeys.includes(item),
                  );
                  onItemSelectAll(selectItems, true);
                }}
                onSelect={(checkedKeysArr, e) => {}}
              />
            ) : (
              <div>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            );
          }
          {
            /* 右侧树 */
          }
          if (direction === 'right') {
            const checkedKeys = Array.from(new Set([...selectedKeys]));

            return dataSourceRight?.length ? (
              <Tree
                height={280}
                blockNode
                checkable
                // checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                // disableCheckbox={true}
                treeData={generateTree(
                  creatRightTree(dataSourceRight, targetKeys),
                  targetKeys,
                  'right',
                )}
                onCheck={(_, e) => {
                  const { node, halfCheckedKeys, checkedNodes } = e;
                  checkedRightKeys.current = _;
                  onItemSelectAll(selectedKeys, false);
                  onItemSelectAll(checkedRightKeys.current, true);
                }}
                onSelect={(checkedKeysArr, { checkedNodes }) => {}}
              />
            ) : (
              <div>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            );
          }
        }}
      </Transfer>
    );
  };

  useEffect(async () => {
    if (transData) {
      setTreeData(transData || []);
    }
    if (transTargetKeys) {
      setTargetKeys(transTargetKeys);
    }
  }, [groupItem, transData, transTargetKeys]);

  const TreeTransferKj = useMemo(() => {
    if (treeData && treeC?.current) {
      if (treeData.length) {
        treeC.current = treeData;
      }
      return (
        <TreeTransfer
          dataSource={treeData}
          dataSourceRight={cloneDeep(treeData)}
          targetKeys={targetKeys}
          onChange={onChange}
        />
      );
    } else {
      return null;
    }
  }, [treeData, targetKeys]);

  return <>{TreeTransferKj}</>;
};

export default RoleTransfer;
