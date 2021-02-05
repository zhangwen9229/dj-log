
import { Component, Vue } from 'vue-property-decorator'
import GlidingWindowLog from '@/components/GlidingWindowLog.vue'

import '@/assets/css/utils.scss'
import styles from './home.module.scss'
import { closeIo, globalSocket, listenServer, openIo, removeServerListner } from '@/Business/io'
import { mapState } from 'vuex'

@Component({
  components: {
    'gliding-window-log': GlidingWindowLog
  },
  computed: {
    ...mapState({
      '_onlines': (state: any) => state.onlines,
      ioHasConnected (state: any) {
        if (state.ioHasConnected) {
          this.ioConnected()
          this.onStart()
        }
        return state.ioHasConnected
      }
    })
  }
})
export default class Home extends Vue {
  cache: string[] = []
  status = 'idle'
  socket: any;

  public get connected () : string {
    return (this as any).ioHasConnected
  }

  public get onlines () : string {
    return (this as any)._onlines
  }

  mounted () {
    this.init()
  }

  ioConnected () {
    // 接收服务端返回数据
    // listenServer('receiveLog', this.listenServer)
  }

  listenServerLog (data: any) {
    Array.prototype.push.apply(this.cache, [data])
  }

  init () {
    console.log(process.env)

    listenServer('log', this.listenServerLog, true)
  }

  beforeDestroy () {
    removeServerListner('log', this.listenServerLog, true)
  }

  onClear () {
    console.log('clear')
    // clear 前必须关闭socket 监听
    closeIo()
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
    openIo()
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
