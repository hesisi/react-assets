import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'GET /api/form/list': mockjs.mock({
    'list|100': [
      {
        createTime: '@date()',
        formCode: '@guid()',
        formDesc: '@word()',
        formName: '@word()',
        'formStatus|+1': ['enable', 'disabled'],
        formUrl: `/formManage/formPreview/table?formCode=${'@guid()'}`,
        updateName: '@word()',
        updateTime: '@date()',
      },
    ],
  }),
};
