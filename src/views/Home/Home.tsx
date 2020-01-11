
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

    mounted () {
      this.init()
    }

    init () {
      this.socket = io('http://localhost:7001')
      this.socket.on('connect', () => {
        console.log(this.socket.id)
      })
      this.socket.on('disconnect', () => { console.log('disconnect') })
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
        this.status = 'running'
      })
    }

    onClear () {
      console.log('clear');
      (this.$refs.log as any).clear()
    }

    onStop () {
      this.socket.close()
    }

    onRestart () {
      this.socket.open()
    }

    render () {
      return (
        <div class='height100 vflex'>
          <div class={styles.controllersWrap}>
            <el-row class={[ 'flex1', styles.row ]} type="flex" justify="end">
              <el-button type="primary" onclick={this.onClear}>清空</el-button>
              <el-button type="primary" onclick={this.onStop}>停止</el-button>
              <el-button type="primary" onclick={this.onRestart}>继续监听</el-button>
            </el-row>
          </div>
          <div class={styles.logWrap}>
            <gliding-window-log id="log" ref="log" cache={this.cache} status={this.status} capacity={50}></gliding-window-log>
          </div>
        </div>
      )
    }
}
