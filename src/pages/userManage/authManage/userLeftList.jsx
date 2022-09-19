import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons';
import { Empty } from 'antd';
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
    const initId = groupId || data?.[0]?.id || null;
    setListData(data);
    setId(initId);
    if (data?.length && !groupId && groupId !== 0) {
      handleGroupClick(data[0]);
    }
  }, [data, groupId]);

  return (
    <div className={'list-cont'}>
      <div className={'header-u'}>
        <span className="header-icon">
          <CodeSandboxOutlined />
        </span>
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
          {listData?.length ? (
            listData.map((x) => (
              <div
                className={
                  id === x.id ? 'list-item active' : 'list-item normal'
                }
                key={x.id}
                onClick={() => handleGroupClick(x)}
              >
                {x.name}
                <span
                  className={
                    id === x.id ? 'groupOperate show' : 'groupOperate hide'
                  }
                >
                  <span onClick={(e) => handleEdit(e, x.id)}>
                    <FormOutlined />
                  </span>
                  <span onClick={(e) => handleDelete(e, [x.id])}>
                    <DeleteOutlined />
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </Scrollbars>
      </div>
    </div>
  );
}

export default memo(UserLeftList);
