import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 系统错误捕获
const errorHandler = (error:any, vm: any, info: any) => {
  console.error('抛出全局异常')
  console.error(vm)
  console.error(error)
  console.log(info)
  let { message, name, script = '', line = 0, column = 0, stack } = error
  // 在vue提供的error对象中，script、line、column目前是空的。但这些信息其实在错误栈信息里可以看到。
  // script = !_.isUndefined(script) ? script : ''
  // line = !_.isUndefined(line) ? line : 0
  // column = !_.isUndefined(column) ? line : 0
  // 解析错误栈信息
  let stackStr = stack ? stack.toString() : `${name}:${message}`

  console.log(message, name, script, line, column, stackStr)
}

Vue.config.errorHandler = errorHandler
Vue.prototype.$throw = errorHandler

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// if (process.env.NODE_ENV !== 'production') {
//   (function () {
//     var script = document.createElement('script')
//     script.src = '/lib/error.js'
//     document.body.appendChild(script)
//     script.onload = function () {
//       (window as any).errLogReport({
//         data: {
//           productname: 'dj-log' // 产品名称
//         },
//         url: 'http://127.0.0.1:7001/api/log/create' // 上报地址
//       })
//     }
//   })()
// }
