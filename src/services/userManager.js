import request from '../utils/request';
const basePreix = '/assets';

// 查询角色列表
export function getRoleList(params) {
  return request(`${basePreix}/role/list`, {
    method: 'post',
    data: { ...params },
  });
}

// 更新角色信息
export function updateRoleInfo(params) {
  return request(`${basePreix}/role/update`, {
    method: 'post',
    data: { ...params },
  });
}

// 新增角色信息
export function addRole(params) {
  return request(`${basePreix}/role/add`, {
    method: 'post',
    data: { ...params },
  });
}

// 角色删除
export function deleteRole(params) {
  return request(`${basePreix}/role/delete/${params}`, {
    method: 'get',
    // params,
    // data: { ...params },
  });
}

/* 获取角色用户 */
export function getRoleUser(params) {
  return request(`${basePreix}/userRole/query`, {
    method: 'post',
    data: { ...params },
  });
}

/* 保存用户橘色 */
export function updateRoleUser(id, params) {
  return request(`${basePreix}/userRole/update/${id}`, {
    method: 'post',
    data: params,
  });
}

// 获取角色功能
export function getRoleFunction(params) {
  return request(`${basePreix}/rolePermission/query`, {
    method: 'post',
    data: params,
  });
}

/* 保存角色功能 */
export function updateRoleFunction(id, params) {
  return request(`${basePreix}/rolePermission/update/${id}`, {
    method: 'post',
    data: params,
  });
}
