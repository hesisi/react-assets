/*
 * @Descripttion: 这里放封装的公共方法
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-15 11:21:40
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-02 16:55:18
 */

// 生成uuid
export function getUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; 
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
}