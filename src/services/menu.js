import request from '../utils/request';
const basePreix = '/assets';

// 获取权限菜单
export function getMenuList(params) {
  return request(`${basePreix}/auth/findAll`, {
    method: 'get',
  });
}

/* 菜单保存 */
export function saveMenuList(params) {
  return request(`${basePreix}/auth/savePermission`, {
    method: 'post',
    data: params,
  });
}
