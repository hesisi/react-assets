import { Collapse } from 'antd';
import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import React, { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { cloneDeep } from 'lodash';

import './leftList.less';

const { Panel } = Collapse;
function UserLeftList(props) {
  const {
    data,
    handleGroupClick,
    handleEdit,
    handleDelete,
    handleAddGroup,
    handleGroupChildClick,
    groupId,
    title = '用户分组管理',
  } = props;
  const [listData, setListData] = useState([]);
  const [listChildData, setListChildData] = useState({});
  const [id, setId] = useState('shouye');
  const [childid, setCId] = useState(null);
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    const newArr = [
      {
        key: 'shouye',
        typeName: '首页',
      },
    ];
    const newData = data.map((item) => {
      item['listChildData'] = [];
      return item;
    });
    setListData(newArr.concat(newData));
  }, [data, groupId]);

  const handleGClick = (id) => {
    console.log(id, '47------');
    let childData = localStorage.getItem('flowGroup')
      ? JSON.parse(localStorage.getItem('flowGroup'))
      : [];
    childData = childData.filter((item) => {
      /* 仅展示启用的流程 */
      return id.includes(item.proessGroup + '') && item.status === 'enable';
    });
    const oldChildData = cloneDeep(listData).map((item) => {
      if (item.key + '' === id[0] + '') {
        return {
          ...item,
          listChildData: childData || [],
        };
      }
      return {
        ...item,
      };
    });

    console.log(oldChildData, '68------');
    // let oldChild = cloneDeep(listChildData);
    let oldChild = [];
    oldChild[id[0]] = childData;
    setListChildData(oldChild);
    setListData(oldChildData);
    setId(id[0]);
    setCId(null);
    handleGroupClick && handleGroupClick(id);
    handleGroupChildClick && handleGroupChildClick(null);
  };

  const handleGroupCClick = (e, item, parent) => {
    e && e.stopPropagation();
    setCId(item.id);
    handleGroupChildClick &&
      handleGroupChildClick(
        item ? { ...item, groupType: parent?.typeName || '' } : item,
      );
  };

  return (
    <div className="list-cont cont-center">
      <div className="list-cont-content">
        <Scrollbars>
          <div>
            {listData.map((x) => (
              <div
                onClick={() => handleGClick([x.key + ''])}
                className={
                  id === x.key + ''
                    ? 'list-item active group'
                    : 'list-item normal group'
                }
                key={x.key}
              >
                <div className="group-wrapper">{x.typeName}</div>
                <div>
                  {listChildData[x.key + '']
                    ? listChildData[x.key + ''].map((item) => (
                        <div
                          className={
                            childid === item.id
                              ? 'list-item active'
                              : 'list-item normal'
                          }
                          key={item.id}
                          onClick={(e) => handleGroupCClick(e, item, x)}
                        >
                          {item.proessName}
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
}

export default memo(UserLeftList);
