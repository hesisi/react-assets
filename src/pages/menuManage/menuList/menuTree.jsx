import React, { memo, useState, useRef, useEffect, Popconfirm } from 'react';
import { Tree, Tooltip, Input, Modal } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { munuDefaultTree } from '../../../../config/routesDy';
import { list } from './iconBox';
import { cloneDeep } from 'lodash';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { getMenuList } from '@/services/menu';
import { getUUID } from '@/utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;
const { confirm } = Modal;

const defaultTreeParaent = [];
let curerntTree = [];

let defaultTrreData = {
  current: [],
};

function menuTree(props) {
  // let localSelectedKeys = localStorage.getItem('selectedKeys') || '[]';
  // if (localSelectedKeys && typeof localSelectedKeys === 'string') {
  //   localSelectedKeys = JSON.parse(localSelectedKeys);
  // }
  // let localExpandedKeys =
  //   localStorage.getItem('menuTreeOnExpand') || '["00-top"]';
  // if (localExpandedKeys && typeof localExpandedKeys === 'string') {
  //   localExpandedKeys = JSON.parse(localExpandedKeys);
  // }

  const formRef = useRef();
  const [treeData, setTreeData] = useState(defaultTreeParaent);
  const [autoParentExpand, setAutoParentExpand] = useState(true); //是否展示删除按钮
  const [operType, setOperType] = useState(''); //区别Modal弹出框的类型，(添加，修改，删除用的是一个Modal)
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const getTreeNode = async () => {
    // todo: 后续接接口保存的tree data
    setIsLoading(false);
    // 获取保存treeData 初始化
    const treeSaveDataInit = await getMenuList();
    if (!treeSaveDataInit?.data?.data) {
      await localForage.removeItem('menuTreePermission');
    }
    const treeSaveData = treeSaveDataInit?.data?.data || [];
    if (treeSaveData?.children && treeSaveData?.children.length) {
      defaultTrreData.current = [];
      const temp = (data) => {
        data.forEach((item) => {
          item.key = item.code;
          item.address = item.path;
          item.title = item.name;
          item['iconIndex'] = item.icon ? item.icon * 1 : -1;
          item['icon'] =
            item['iconIndex'] === 0 ||
            (item['iconIndex'] && item['iconIndex'] >= 0)
              ? React.createElement(list[item.iconIndex])
              : null;
          defaultTrreData.current.push(item);
          if (item?.children?.length) {
            temp(item.children);
          }
        });
        return data;
      };
      const treeInit = temp([treeSaveData]);
      setExpandedKeys([treeInit[0].key] || []);
      setTreeData([...treeInit]); // 这样才可以动态更新掉视图上的数据
      curerntTree = [...treeInit];
      props.setTree([...treeInit]);
    }
  };

  const editTreeNodeConfig = () => {
    const form = props.config?.formValue;
    /* 页面初始化回填curerntTree */
    if (!form) {
      setTreeData([...curerntTree]);
      props.setTree(curerntTree);
      return;
    }
    defaultTrreData.current = defaultTrreData.current.map((item) => {
      if (item.key === form.key) {
        return {
          ...item,
          ...form,
          title: form.menuname,
          icon:
            props.config.iconIndex >= 0
              ? React.createElement(list[props.config.iconIndex])
              : null,
          iconIndex: props.config.iconIndex,
        };
      }
      return item;
    });

    const temp = (data) => {
      data.forEach((item) => {
        if (item.key === form.key) {
          item = Object.assign(item, {
            ...form,
            title: form.menuname,
            icon:
              props.config.iconIndex >= 0
                ? React.createElement(list[props.config.iconIndex])
                : null,
            iconIndex: props.config.iconIndex,
          });
        } else if (item.children) {
          temp(item.children);
        }
      });
      return data;
    };
    const arr = temp(treeData);
    setTreeData([...arr]); // 这样才可以动态更新掉视图上的数据
    curerntTree = [...arr];
    props.setTree(arr);
  };

  useEffect(() => {
    getTreeNode();
  }, []);

  useEffect(() => {
    editTreeNodeConfig();
  }, [props.submitFlag]);

  const onSelect = async (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
    // localStorage.setItem('selectedKeys', JSON.stringify(selectedKeys));
    const { selectedNodes } = info;
    if (!selectedNodes.length) {
      props.setForm({
        formValue: {},
      });
      return;
    }
    const selectNodeInfo = defaultTrreData.current.filter(
      (item) => item.key === selectedNodes[0].key,
    );

    console.log(selectNodeInfo, '151----');
    //这里写点击tree节点的事件逻辑 选中展示节点配置信息
    props.setForm({
      formValue: {
        ...selectNodeInfo[0],
        menuname: selectNodeInfo[0]?.title || '',
      },
      comIcons: selectNodeInfo[0]?.icon || null,
      isEdit: true,
    });
  };

  const operateTrreNode = (tree, oper, operNode, nodeKey) => {
    tree.forEach((item, index) => {
      if (item.key === nodeKey) {
        /* 添加操作 */
        if (oper === 'add') {
          item.children.push(operNode);
        }
        /* 删除 */
        if (oper === 'delete') {
          tree.splice(index, 1);
        }
        /* 编辑 */
        if (oper === 'update') {
          onSelect([item.key], { selectedNodes: [{ key: item.key }] });
        }
      }
      if (item.children && item.children.length) {
        item.children = operateTrreNode(item.children, oper, operNode, nodeKey);
      }
    });
    return tree;
  };

  //添加按钮弹出添加Modal
  const handleOperateSub = (e, node, operateIdenty) => {
    e && e.stopPropagation();

    if (operateIdenty === 'delete') {
      confirm({
        title: '确认删除该菜单项吗',
        icon: <ExclamationCircleOutlined />,
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          if (!node) {
            return;
          }
          const newTreeDataOper = operateTrreNode(
            cloneDeep(treeData),
            operateIdenty,
            {},
            node.key,
          );
          defaultTrreData.current = defaultTrreData.current.filter(
            (item) => item.key !== node.key,
          );
          curerntTree = newTreeDataOper;
          setTreeData(newTreeDataOper);
          props.setTree(newTreeDataOper);
          console.log(newTreeDataOper, '212----');
          // const firstKey = newTreeDataOper?.[0]?.children?.[0]?.key
          onSelect([], {
            selectedNodes: [],
          });
          setOperType(operateIdenty);
        },
        onCancel() {},
      });
    } else {
      const newNode =
        operateIdenty === 'add'
          ? {
              title:
                node.title === '全部菜单'
                  ? `Parent-${node.children.length + 1}`
                  : `${node.title}-${node.children.length + 1}`,
              key: getUUID(),
              children: [],
              oper: 'add',
            }
          : {};

      const newTreeDataOper = operateTrreNode(
        cloneDeep(treeData),
        operateIdenty,
        newNode,
        node.key,
      );

      if (operateIdenty === 'add') {
        defaultTrreData.current.push(newNode);
      }
      if (operateIdenty === 'delete') {
        defaultTrreData.current = defaultTrreData.current.filter(
          (item) => item.key !== node.key,
        );
      }

      curerntTree = newTreeDataOper;
      setTreeData(newTreeDataOper);
      props.setTree(newTreeDataOper);
      setOperType(operateIdenty);
      if (operateIdenty === 'add') {
        const oldExpandKeys = cloneDeep(expandedKeys);
        if (oldExpandKeys.includes(node.key)) {
          return;
        }
        oldExpandKeys.push(node.key);
        setExpandedKeys(oldExpandKeys);
      }
    }
  };

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

  /* tree 前端搜索 */
  const handleTreeChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = defaultTrreData.current
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoParentExpand(true);
  };

  //增删改组件
  const getNodeTree = (data) => {
    if (!(data && data.length)) {
      return [];
    }

    const menu = (node) => {
      const strTitle = node.title;
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

      return (
        <div className="tree-node-wrapper">
          <span className="tree-node-title">{title}</span>
          <span className="icon-wrapper">
            <span
              className="icon-add"
              onClick={(e) => handleOperateSub(e, node, 'add')}
            >
              <Tooltip placement="bottom" title="添加子节点">
                <PlusOutlined />
              </Tooltip>
            </span>
            {node.code !== '00-top' ? (
              <>
                <span
                  className="icon-edit"
                  onClick={(e) => handleOperateSub(e, node, 'update')}
                >
                  <Tooltip placement="bottom" title="修改节点">
                    <EditOutlined />
                  </Tooltip>
                </span>
                <span
                  className="icon-remove"
                  onClick={(e) => handleOperateSub(e, node, 'delete')}
                >
                  <Tooltip placement="bottom" title="删除该节点">
                    <DeleteOutlined />
                  </Tooltip>
                </span>
              </>
            ) : null}
          </span>
        </div>
      );
    };
    return data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.key}
            title={<>{menu(item, false)}</>}
            icon={item?.icon}
          >
            {getNodeTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.key} title={<>{menu(item)}</>} icon={item?.icon} />
      );
    });
  };

  const onExpand = (newExpandedKeys) => {
    // localStorage.setItem('menuTreeOnExpand', JSON.stringify(newExpandedKeys));
    setExpandedKeys(newExpandedKeys);
    setAutoParentExpand(false);
  };

  return (
    <>
      {isLoading === true ? null : (
        <div className="menu-tree-wrapper">
          <div className="menu-tree-wrapper-top">
            <div>
              <Search
                placeholder="请输入菜单名字"
                onChange={handleTreeChange}
                style={{ width: 252, marginBottom: '10px' }}
              />
            </div>
          </div>

          <div
            className="menu-tree-wrapper-content"
            style={{ marginRight: '20px' }}
          >
            <Scrollbars style={{ width: '100%', height: '100%' }}>
              <Tree
                showIcon
                blockNode
                // multiple
                defaultExpandAll
                // defaultExpandedKeys={}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                autoExpandParent={autoParentExpand}
                onSelect={onSelect}
                // treeData={treeDataShow}
                style={{ width: '250px' }}
              >
                {getNodeTree(treeData)}
              </Tree>
            </Scrollbars>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(menuTree);
