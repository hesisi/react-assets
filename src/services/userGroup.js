import request from '../utils/request';
const basePreix = '/assets';

// 查询用户分组列表
export function getUserGroupList(params) {
  return request(`${basePreix}/userGroup/list`, {
    method: 'post',
    data: { ...params },
  });
}

// 删除用户分组
export function deleteUserGroup(params) {
  return request(`${basePreix}/userGroup/del/${params}`, {
    method: 'post',
    // data: { ...params },
  });
}

// 更新分组信息
export function updateGroupInfo(params) {
  return request(`${basePreix}/userGroup/update`, {
    method: 'post',
    data: { ...params },
  });
}

// 新增分组信息
export function addGroup(params) {
  return request(`${basePreix}/userGroup/save`, {
    method: 'post',
    data: params,
  });
}

// 删除分组用户
export function deleteGroupUser(params) {
  return request(`${basePreix}/userGroup/removeUser`, {
    method: 'post',
    data: params,
  });
}

// 批量添加用户到分组
export function addGroupUser(params) {
  return request(`${basePreix}/userGroup/addUser`, {
    method: 'post',
    data: params,
  });
}

// 分页查询分组下的用户
export function getGroupUserList(params) {
  return request(`${basePreix}/userGroup/userGroupList`, {
    method: 'post',
    data: params,
  });
}

// 分页查询分组弹框下的用户
export function getGroupUserAddList(params) {
  return request(`${basePreix}/userGroup/userGroupAddList`, {
    method: 'post',
    // params,
    data: params,
  });
}
