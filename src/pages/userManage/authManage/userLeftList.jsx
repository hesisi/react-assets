import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import React, { memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import './leftList.less';

function UserLeftList(props) {
  const {
    data,
    handleGroupClick,
    handleEdit,
    handleDelete,
    handleAddGroup,
    groupId,
    title = '用户分组管理',
  } = props;
  const [listData, setListData] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
    console.log(data, '18-----');
    setListData(data);
    setId(groupId);
  }, [data, groupId]);

  return (
    <div className={'list-cont'}>
      <div className={'header-u'}>
        <h3 className={'title'}>{title}</h3>
        <InfoCircleOutlined />
        <a
          style={{ color: '#0d6bff', marginLeft: 'auto', cursor: 'pointer' }}
          onClick={() => handleAddGroup()}
        >
          <PlusCircleOutlined />
        </a>
      </div>
      <div className="list-cont-content">
        <Scrollbars>
          {listData.map((x) => (
            <div
              className={id === x.id ? 'list-item active' : 'list-item normal'}
              key={x.id}
              onClick={() => handleGroupClick(x.id)}
            >
              {x.name}
              <span className="groupOperate">
                <span onClick={() => handleEdit(x.id)}>
                  <FormOutlined />
                </span>
                <span onClick={() => handleDelete([x.id])}>
                  <DeleteOutlined />
                </span>
              </span>
            </div>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
}

export default memo(UserLeftList);
