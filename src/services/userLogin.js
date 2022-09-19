import request from '../utils/request';
const basePreix = '/assets';
//用户登录
export function userLogin(params) {
  return request(`${basePreix}/login`, {
    method: 'post',
    data: params,
  });
}
//获取登录验证码
export function getUserLoginValidatePic() {
  return request(`${basePreix}/getCode`, {
    method: 'get',
  });
}
