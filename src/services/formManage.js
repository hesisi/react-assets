import request from '../utils/request';
const baseUrl = '/dynamicForm';

/**
 * 动态表单
 */
// 查询动态表单信息
export function getFormList(params) {
  return request(`${baseUrl}/getFormList`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 创建动态表单
export function createForm(params) {
  return request(`${baseUrl}/createForm`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 查询动态表单信息
export function getFormDetails(params) {
  return request(`${baseUrl}/getFormDetails`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 保存动态表单信息
export function saveForm(params) {
  return request(`${baseUrl}/saveForm`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 通过formId删除对应的动态表单
export function deleteFormById(params) {
  return request(`${baseUrl}/deleteFormById`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 批量删除对应的动态表单
export function batchDeleteForm(params) {
  return request(`${baseUrl}/batchDeleteForm`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 通过formId修改动态表单的状态
export function changeFormStatus(params) {
  return request(`${baseUrl}/changeFormStatus`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

/**
 * 动态表单的列表配置Controller
 */
// 批量删除列表配置信息
export function tableBatchDelete(params) {
  return request(`${baseUrl}/table/batchDelete`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 创建动态表单对应的列表配置
export function tableCreate(params) {
  return request(`${baseUrl}/table/create`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 查询列表配置信息
export function tableGetList(params) {
  return request(`${baseUrl}/table/getList`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 查询动态表单列表配置详细信息
export function getTableDetails(params) {
  return request(`${baseUrl}/table/getTableDetails`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 编辑动态表单的列表配置信息
export function tableSave(params) {
  return request(`${baseUrl}/tableData/save`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

// 新建动态表单的列表配置信息
export function tableAdd(params) {
  return request(`${baseUrl}/tableData/create`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

/*  */
export function getTableList(params) {
  return request(`${baseUrl}/tableData/getList`, {
    method: 'POST',
    data: { ...params },
  }).then((res) => res.data);
}

export function deleteTable(params) {
  return request(`${baseUrl}/tableData/batchDelete`, {
    method: 'POST',
    data: params,
  }).then((res) => res.data);
}
