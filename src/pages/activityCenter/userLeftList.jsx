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
      <div className="list-cont-content">
        <Scrollbars>
          {listData.map((x) => (
            <div
              className={id === x.id ? 'list-item active' : 'list-item normal'}
              key={x.id}
              onClick={() => handleGroupClick(x.id)}
            >
              {x.name}
            </div>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
}

export default memo(UserLeftList);
