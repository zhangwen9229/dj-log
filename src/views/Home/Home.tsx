
import { Component, Prop, Vue } from 'vue-property-decorator'
import GlidingWindowLog from '@/components/GlidingWindowLog.vue'
import io from 'socket.io-client'

import '@/assets/css/utils.scss'
import styles from './home.module.scss'

@Component({
  components: {
    'gliding-window-log': GlidingWindowLog
  }
})
export default class Test extends Vue {
  cache: string[] = []
  status = 'idle'
  socket: any;
  connected = false

  mounted () {
    this.init()
  }

  init () {
    console.log(process.env)
    this.socket = io(process.env.VUE_APP_IO_BASE_URL)
    this.socket.on('connect', () => {
      console.log(this.socket.id)
      this.connected = true
      this.onStart()
    })
    this.socket.on('disconnect', () => {
      console.log('disconnect')
      this.connected = false
    })
    this.socket.emit(
      'exchange',
      {
        target: 'Dkn3UXSu8_jHvKBmAAHW',
        payload: {
          msg: 'test'
        }
      }, (data: any) => {
        console.log(data)
      }
    )

    this.socket.emit(
      'exchange',
      {
        target: 'Dkn3UXSu8_jHvKBmAAHW',
        payload: {
          msg: '同比'
        }
      }, (data: any) => {
        console.log(data) // data will be 'woot'
      }
    )

    this.socket.on('res', (data: any) => {
      console.log(data)
    })
    this.socket.on('log', (data: any) => {
      console.log(' ------ -- - -- - - -- - -')
      console.log(data)
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
      <div class='height100 vflex'>
        <div class={styles.controllersWrap}>
          <el-row class={['flex1', styles.row]} type="flex" justify="end">
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
