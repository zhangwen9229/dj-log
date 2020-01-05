<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <gliding-window-log id="log" :cache="cache" :status="status" :capacity="50"></gliding-window-log>
    <Test msg="test111"></Test>
    <button @click="ontest">test throw</button>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Test from './test/test'
import GlidingWindowLog from '@/components/GlidingWindowLog.vue'

import io from 'socket.io-client'
const socket = io('http://localhost:7001')

export default {
  name: 'home',
  components: {
    Test,
    'gliding-window-log': GlidingWindowLog
  },
  data () {
    return {
      cache: [],
      status: 'idle'
    }
  },
  computed: {
    isRunning () {
      return this.status === 'running'
    }
  },
  mounted () {
    socket.on('connect', () => {
      console.log(socket.id)
    })
    socket.emit('exchange', {
      target: 'Dkn3UXSu8_jHvKBmAAHW',
      payload: {
        msg: 'test'
      }
    }, (data) => {
      console.log(data)
    })

    socket.emit('exchange', {
      target: 'Dkn3UXSu8_jHvKBmAAHW',
      payload: {
        msg: '同比'
      }
    }, (data) => {
      console.log(data) // data will be 'woot'
    })

    socket.on('res', (cb) => {
      console.log(cb)
    })
  },
  methods: {
    ontest () {
      throw new TypeError('eeee')
    }
  }
}
// var a = 1
// b = c
</script>
