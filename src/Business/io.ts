/*
 * @Date: 2021-02-05 11:39:36
 * @LastEditors: zhangwenshun
 * @LastEditTime: 2021-02-09 21:08:10
 * @title: socket相关操作
 * @created by: zhangwenshun
 */

import Vue from 'vue'
import io from 'socket.io-client'
import store from '@/store'

export const globalSocket = io(process.env.VUE_APP_IO_BASE_URL)

export const FROM_IO = 'FROM_IO'
export const IOEVENTTYPE = {
  Connected: 'io_connect',
  DisConnected: 'io_disconnect'
}

let ioHasConnected = false

function changeIoState () {
  store.commit('changeState', { ioHasConnected })
}

globalSocket.on('connect', () => {
  window.$bus.$emit(FROM_IO, {
    eventName: IOEVENTTYPE.Connected
  })
  ioHasConnected = true
  changeIoState()
})

globalSocket.on('ShakeHandsWithServer', (data: any) => {
  console.log(data)
})

globalSocket.on('disconnect', () => {
  console.log('disconnect')
  window.$bus.$emit(FROM_IO, {
    eventName: IOEVENTTYPE.DisConnected
  })
})

globalSocket.on('changePersonSize', (size: number) => {
  store.commit('changeState', { onlines: size })
})

export function closeIo () {
  globalSocket.close()
  //   store.commit('changeState', { ioHasConnected: false })
  ioHasConnected = false
  changeIoState()
}

export function openIo () {
  globalSocket.open()
  //   store.commit('changeState', { ioHasConnected: false })
  ioHasConnected = false
  changeIoState()
}

export function sendToServer (data) {
  if (!data) { return }
  // 向服务端发送数据
  globalSocket.emit('exchange', data)
}

export function listenServer (eventName, callback, isBroadcast: boolean = false) {
  const realEventName = isBroadcast ? eventName : `${globalSocket.id}_${eventName}`
  console.log('realEventName', realEventName)
  // 接收服务端返回数据
  globalSocket.on(realEventName, callback)
}

export function removeServerListner (eventName, fn: Function | undefined, isBroadcast: boolean = false) {
  if (!eventName) { return }
  const realEventName = isBroadcast ? eventName : `${globalSocket.id}_${eventName}`
  globalSocket.removeListener(realEventName, fn)
}
