import { Avatar, List } from 'antd';
import React from 'react';
import styles from './header.less';

const ContentHeader = (props) => (
  <div className={styles.contentHeader}>
    {props.title || ''}
    <div className={styles.contentOperate}>{props.opreateArea || null}</div>
  </div>
);

export default ContentHeader;
