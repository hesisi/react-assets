export const iconList = [
  'EditOutlined',
  'FormOutlined',
  'CopyOutlined',
  'ScissorOutlined',
  'DeleteOutlined',
  'SnippetsOutlined',
  'QuestionOutlined',
  'QuestionCircleOutlined',
  'PlusOutlined',
  'PlusCircleOutlined',
  'PauseOutlined',
  'StopOutlined',
  'IssuesCloseOutlined',
  'WarningOutlined',
  'ClockCircleOutlined',
  'CheckSquareOutlined',
  'CheckCircleOutlined',
  'CheckOutlined',
  'CloseSquareOutlined',
  'CloseCircleOutlined',
  'CloseOutlined',
  'ExclamationCircleOutlined',
];

// 列表配置初始化
export const columnInit = {
  isShow: true,
  sorter: false,
  searchEnable: true,
  filterEnable: true,
};

// 按钮配置初始化
export const buttonInit = {
  id: null,
  label: '',
  icon: null,
  method: '',
  iconName: '',
};

export const selectList = {
  isShow: [
    { label: '是', value: true },
    { label: '否', value: false },
  ],
  sortEnable: [
    { label: '可排序', value: true },
    { label: '不可排序', value: false },
  ],
  searchEnable: [
    { label: '可搜索', value: true },
    { label: '不可搜索', value: false },
  ],
  filterEnable: [
    { label: '显示', value: true },
    { label: '不显示', value: false },
  ],
};
