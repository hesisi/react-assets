/*
 * @Descripttion: 这里是写公共请求
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-15 11:13:12
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 14:07:41
 */
import request from '../utils/request';
const basePreix = '/assets/messageData';

// post请求实例
// 请求消息类别
export function getMessageType(params) {
  return request(`${basePreix}/countByMessageType`, {
    method: 'get',
    params,
    // data: { ...params },
  });
}

// 分页查询消息
// messageTitle name
// messageType
// messageStatus 0 未读 1已读
export function getMessageList(params) {
  return request(`${basePreix}/listByPage`, {
    method: 'post',
    data: { ...params },
  });
}

// 请求消息类别
export function deleteMessage(params) {
  return request(`${basePreix}/del/${params}`, {
    method: 'delete',
    // params,
    // data: { ...params },
  });
}

export function deleteBtchMessage(params) {
  return request(`${basePreix}/batchDel?ids=${params}`, {
    method: 'delete',
    // data: params,
    // data: { ...params },
  });
}
