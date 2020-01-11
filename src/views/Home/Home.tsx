
import { Component, Prop, Vue } from 'vue-property-decorator'
import GlidingWindowLog from '@/components/GlidingWindowLog.vue'
import io from 'socket.io-client'

import utils from '@/assets/css/utils.scss'
import styles from './home.scss'

@Component({
    components: {
        'gliding-window-log': GlidingWindowLog
    }
})
export default class Test extends Vue {
    cache: string[] = []
    status = 'idle'
    socket: any;
    text: string = 'hello word'

    mounted () {
        this.init()
    }

    init () {
        this.socket = io('http://localhost:7001')
        this.socket.on('connect', () => {
            console.log(this.socket.id)
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
            this.status = 'running'
        })
    }

    render () {
        return (
            <div class={[utils.height100, utils.vflex]}>
                <div class={styles.controllersWrap}>
                    {this.text}
                    <input v-model={this.text}></input>
                </div>
                <div class={styles.logWrap}>
                    <gliding-window-log id="log" cache={this.cache} status={this.status} capacity={50}></gliding-window-log>
                </div>
            </div>
        )
    }
}
