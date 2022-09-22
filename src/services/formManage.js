import request from '../utils/request';
const baseUrl = '/dynamicForm';

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
