import { Tree, Button } from 'antd';
import { nanoid } from 'nanoid';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import eventBus from '../../../utils/eventBus';

let arr = []; // 存在内存，不受react组件影响
let deleteFlag = false;
function uniqueFunc(arr, uniId) {
  // 过滤掉数组重复的项
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

export default function menuTree(props) {
  const [gData, setGData] = useState();
  // const [deleteFlag, setDeleteFlag] = useState(false);

  const setTreeNode = () => {
    const treeData = uniqueFunc(arr, 'key') || [];
    if (
      props.config &&
      treeData.length >= 0 &&
      !props.config.formValue.isEdit
    ) {
      // 新增一个结点
      treeData.push({
        title: props.config.formValue.menuname,
        key: nanoid(),
        ...props.config.formValue,
        icon: props.config.comIcons,
        iconIndex: props.config.iconIndex,
      });
      arr = [...treeData];
      setGData(arr);
      props.setTree(arr); // 返回给父组件
      deleteFlag = false;
    } else if (props.config?.formValue?.isEdit) {
      // 修改一个结点，找到对应结点进行修改
      const form = props.config?.formValue;
      const temp = (data) => {
        data.forEach((item) => {
          if (item.key === form.key) {
            item = Object.assign(item, {
              ...form,
              key: nanoid(),
              title: form.menuname,
              icon: props.config.comIcons,
              iconIndex: props.config.iconIndex,
            });
          } else if (item.children) {
            temp(item.children);
          }
        });
        return data;
      };
      arr = temp(arr);
      setGData([...arr]); // 这样才可以动态更新掉视图上的数据
      props.setTree(arr);
    } else {
      // 预览返回的时候，从内存取
      setGData([...arr]);
      props.setTree(arr);
    }
  };

  useEffect(() => {
    setTreeNode();
  }, [props.submitFlag]);

  useEffect(() => {
    // 清空树的所有结点
    eventBus.addListener('nodeClear', (node) => {
      arr = node;
      setGData(node); // 这样才可以动态更新掉视图上的数据
      props.setTree(node);
    });
  }, []);

  const onDrop = (info) => {
    // 拖拽函数
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }

        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const data = [...gData]; // Find dragObject

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置

        item.children.unshift(dragObj); // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });

      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    arr = [...data];
    setGData(data);
    props.setTree(arr);
  };

  const nodeDelete = (v) => {
    // 结点删除
    const temp = (data) => {
      data.forEach((item, index) => {
        if (item.key === v.key) {
          data.splice(index, 1);
        } else if (item.children) {
          temp(item.children);
        }
      });
      return data;
    };
    arr = temp(arr);
    setGData([...arr]); // 这样才可以动态更新掉视图上的数据
    props.setTree(arr);
    deleteFlag = true; // 删除标识
    props.setForm({
      formValue: {},
      comIcons: {},
      isEdit: false,
    });
  };

  const onSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    if (deleteFlag) {
      props.setForm({
        // 回显后点击删除需要清空表单
        formValue: null,
        comIcons: null,
      });
      return;
    } // 删除也会触发onSelect但是无需回显
    props.setForm({
      formValue: {
        ...selectedNodes[0],
        menuname: selectedNodes[0]?.title || selectedNodes[0]?.menuname || '',
      },
      comIcons: selectedNodes[0]?.icon || null,
      isEdit: true,
    });

    deleteFlag = false;
  };

  return (
    <Tree
      defaultExpandAll
      treeData={gData}
      showIcon
      draggable
      blockNode
      onDrop={onDrop}
      onSelect={onSelect}
      titleRender={(v) => {
        return (
          <span>
            {v.title}
            <Button
              type="link"
              className="tree-btn__delete"
              size="small"
              onClick={() => nodeDelete(v)}
            >
              <CloseOutlined />
            </Button>
          </span>
        );
      }}
    />
  );
}
