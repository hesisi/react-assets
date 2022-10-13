export const fieldConfigs = [
  {
    label: '字段标识',
    name: 'prop',
    type: 'input',
  },
  {
    label: '标题',
    name: 'label',
    type: 'input',
  },
  {
    label: '描述',
    name: 'description',
    type: 'textarea',
  },
  {
    label: '默认值',
    name: 'defaultValue',
    type: 'input',
  },
  {
    label: '占位提示',
    name: 'placeholder',
    type: 'input',
  },
];

const componentConfig = {
  prefix: {
    label: '前缀',
    name: 'prefix',
    type: 'input',
  },
  suffix: {
    label: '后缀',
    name: 'suffix',
    type: 'input',
  },
  clearable: {
    label: '允许清除内容',
    name: 'clearable',
    type: 'switch',
  },
};

export const componentConfigs = (type) => {
  const configs = [];
  const { prefix, suffix, clearable } = componentConfig;
  switch (type) {
    case 'input':
      configs.push(prefix, suffix, clearable);
      break;
    case 'textarea':
      configs.push(clearable);
      break;
    default:
      return [];
  }
  return configs;
};
