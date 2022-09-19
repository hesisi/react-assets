import request from '../utils/request';
const basePreix = '/assets';
//获取用户信息
export function getUserList(params) {
  return request(`${basePreix}/user/listByPage`, {
    method: 'post',
    data: params,
  });
}
//新建用户
export function addOneUser(params) {
  return request(`${basePreix}/user/add`, {
    method: 'post',
    data: { ...params },
  });
}
//批量添加
export function addUserByUpload(params) {
  return request(`${basePreix}/user/upload`, {
    method: 'post',
    data: params,
  });
}
//删除用户
export function deleteUser(params) {
  return request(`${basePreix}/user/batchDelete`, {
    method: 'post',
    data: params,
  });
}
//批量分组
export function addUsersToGroups(params) {
  return request(`${basePreix}/user/addUsersToGroups`, {
    method: 'post',
    data: params,
  });
}
//密码重置
export function resetPasswd(params) {
  return request(`${basePreix}/user/resetPasswd/${params}`, {
    method: 'get',
  });
}
//编辑用户
export function updateOneUser(params) {
  return request(`${basePreix}/user/update`, {
    method: 'post',
    data: { ...params },
  });
}
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

/* 保存用户角色 */
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

// 修改用户密码
export function getUserChangePasswd(params) {
  return request(`${basePreix}/user/ChangePasswd`, {
    method: 'get',
    params,
  });
}
