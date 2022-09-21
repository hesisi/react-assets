import request from '../utils/request';
const baseUrl = '/api';

export function getFormList(params) {
  return request(`${baseUrl}/form/list`, {
    method: 'GET',
    data: { ...params },
  }).then((res) => res.data);
}
