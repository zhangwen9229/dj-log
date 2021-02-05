/*
 * @Date: 2021-02-05 11:39:36
 * @LastEditors: zhangwenshun
 * @LastEditTime: 2021-02-05 11:41:11
 * @title: socket相关操作
 * @created by: zhangwenshun
 */

import io from 'socket.io-client'

export const globalSocket = io(process.env.VUE_APP_IO_BASE_URL)
