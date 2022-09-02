import moment from 'moment';

export const temp = {
  applyLeave: {
    oddNumbers: 'xxxx1',
    applyPeople: '小六',
    applyNode: '王总',
    applyType: '年假',
    startTime: moment().format('YYYY-MM-DD'),
    endTime: moment().add(7, 'days').format('YYYY-MM-DD'),
    applyDays: '40',
  },
};
