import { Tooltip } from 'antd';

export const EllipsisTooltip = (props) => {
  const { title, lineClampNum } = props;
  return <Tooltip title={title}>{title}</Tooltip>;
};
