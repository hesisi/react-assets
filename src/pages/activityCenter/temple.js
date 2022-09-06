import moment from 'moment';

export const temp = {
  /* 申请表单模板 */
  applyLeave: {
    oddNumbers: 'xxxx1', // 申请单号
    applyPeople: '小六', // 申请人
    applyNode: '王总', // 流程节点
    applyType: '年假', // 请假类型
    startTime: moment().format('YYYY-MM-DD'), // 开始时间
    endTime: moment().add(7, 'days').format('YYYY-MM-DD'), // 结束时间
    applyDays: '40', // 请假天数
  },
  /* 审批表单模板 */
  approver: {
    approvePeople: '', // 审批人
    approveDes: '', // 审批意见
  },
};
