import moment from 'moment';
export const timeDays = (startTime, endTime) => {
  if (startTime && endTime) {
    return moment(endTime).diff(moment(startTime), 'day');
  }
  return '';
};
