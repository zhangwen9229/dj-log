
import { Component, Prop, Vue } from 'vue-property-decorator'
import GlidingWindowLog from '@/components/GlidingWindowLog.vue'
import io from 'socket.io-client'

import '@/assets/css/utils.scss'
import styles from './home.module.scss'
import { globalSocket } from '@/Business/io'

@Component({
  components: {
    'gliding-window-log': GlidingWindowLog
  }
})
export default class Home extends Vue {
  cache: string[] = []
  status = 'idle'
  socket: any;
  connected = false
  onlines = 0;

  mounted () {
    this.init()
  }

  ioConnected () {
    // 向服务端发送数据
    this.socket.emit('exchange', {

    })

    // 接收服务端返回数据
    this.socket.on(this.socket.id, (data: any) => {
      console.log(data)
    })
  }

  emitToServer () {

  }

  init () {
    console.log(process.env)
    this.socket = globalSocket
    this.socket.on('connect', () => {
      console.log(this.socket.id)
      this.connected = true
      this.ioConnected()
      this.onStart()
    })
    this.socket.on('disconnect', () => {
      console.log('disconnect')
      this.connected = false
    })

    this.socket.on('connected', (data: any) => {
      console.log(data)
    })

    this.socket.on('changePersonSize', (size: number) => {
      this.onlines = size
    })

    this.socket.on('log', (data: any) => {
      // console.log(' ------ -- - -- - - -- - -')
      // console.log(data)
      Array.prototype.push.apply(this.cache, [data])
    })
  }

  onClear () {
    console.log('clear')
    // clear 前必须关闭socket 监听
    this.socket.close()
    this.onStop();
    (this.$refs.log as any).clear()
  }

  onClearTmp () {
    (this.$refs.log as any).clearTmp()
  }

  onStop () {
    this.status = 'stop'
  }

  onStart () {
    this.status = 'running'
  }

  onRestartSocket () {
    this.socket.open()
  }

  render () {
    return (
      <div class={`vflex ${styles.containerWrap}`}>
        <div class={styles.controllersWrap}>
          <el-row class={['flex1', styles.row]} type="flex" justify="end">
            <el-col class={styles.onlines}>当前人数:{this.onlines}</el-col>
            <el-button onclick={this.onClear} disabled={!this.connected}>停止监听并清空</el-button>
            <el-button type="success" onclick={this.onRestartSocket} disabled={this.connected}>继续监听</el-button>
            <el-button type="danger" onclick={this.onStop} disabled={this.status !== 'running'}>停止</el-button>
            <el-button type="primary" onclick={this.onStart} disabled={this.status === 'running' || !this.connected}>继续</el-button>
            <el-button onclick={this.onClearTmp}>清空</el-button>
          </el-row>
        </div>
        <div class={styles.logWrap}>
          <gliding-window-log id="log" ref="log" cache={this.cache} status={this.status} capacity={50}></gliding-window-log>
        </div>
      </div>
    )
  }
}
