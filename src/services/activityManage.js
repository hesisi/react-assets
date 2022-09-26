import request from '../utils/request';
const basePreix = '/department';
const basePreix2 = '/processGroup';

//创建表单
export function saveActivity(params) {
  return request(`${basePreix}/deployment`, {
    method: 'post',
    data: params,
  });
}
// 更新流程状态
export function updateActivity(params) {
  return request(`${basePreix}/updateProInstState`, {
    method: 'post',
    data: params,
  });
}
// 开始流程
export function startActivity(params) {
  return request(`${basePreix}/start`, {
    method: 'post',
    data: params,
  });
}
// 创建流程
export function createActivity(params1) {
  return request(`${basePreix}/create/${params1}`, {
    method: 'get',
  });
}
// 流程列表
export function findActivityList(params) {
  return request(`${basePreix}/findAllDepartment`, {
    method: 'post',
    data: params,
  });
}
// 获取流程流程图
export function getXml(params) {
  return request(`${basePreix}/getXml/${params}`, {
    method: 'get',
  });
}
// 获取流程流程图
export function getGroupByCondition(params) {
  return request(`${basePreix2}/findByCondition`, {
    method: 'post',
    data: params,
  });
}
