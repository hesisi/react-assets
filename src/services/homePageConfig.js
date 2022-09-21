import request from '../utils/request';
const baseUrl = '/assets';
// post请求实例
export function saveUserHomePageConfig(params) {
  return request(`${baseUrl}/homepageManager/saveOrUpdate`, {
    method: 'post',
    data: { ...params },
  });
}
export function deleteUserHomePageConfig(params) {
  return request(`${baseUrl}/homepageManager/delete`, {
    method: 'post',
    // data: { ...params }
  });
}
export function selectUserHomePageConfig(params) {
  return request(`${baseUrl}/homepageManager/selectOne`, {
    method: 'post',
    silence: true,
    // data: { ...params }
  });
}
