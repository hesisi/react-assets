/*
 * @Descripttion: 这里是写公共请求
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-15 11:13:12
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-15 14:07:41
 */
import request from "../utils/request";

// post请求实例
export function getUserInfoReq(params){
    return request(`/baseic/v1`, {
        method: 'post',
        data: { ...params }
    })
}