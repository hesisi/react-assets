import { Tooltip } from 'antd';
import moment from 'moment';

export const EllipsisTooltip = (props) => {
  const { title, lineClampNum } = props;
  return <Tooltip title={title}>{title}</Tooltip>;
};

export const TimeEllipsisTooltip = (props) => {
  const { title, lineClampNum } = props;
  return (
    <Tooltip title={moment(title).format('YYYY-MM-DD HH:mm:ss')}>
      {moment(title).format('YYYY-MM-DD HH:mm:ss')}
    </Tooltip>
  );
};
