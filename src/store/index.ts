import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    onlines: 0,
    ioHasConnected: false
  },
  mutations: {
    changeState (state: any, payload) {
      if (typeof payload !== 'object') {
        return
      }
      console.log('changeState', payload)
      for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          state[key] = payload[key]
        }
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
