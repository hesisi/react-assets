import { ISchema } from '@formily/react';

export const Custom: ISchema = {
  type: 'object',
  properties: {
    isShow: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    // value: {
    //   type: "string",
    //   "x-decorator": "FormItem",
    //   "x-component": "Input",
    //   "x-component-props": {
    //     placeholder: "请输入要展示的文本",
    //   },
    // },
  },
};
