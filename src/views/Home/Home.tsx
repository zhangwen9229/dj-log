
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
            console.log(' ------ -- - -- - - -- - -')

            console.log(data)

            Array.prototype.push.apply(this.cache, (JSON.stringify(data) as any))
        })
    }

    render () {
        return (
            <div class={utils.height100}>
                <div class={styles.controllersWrap}>111</div>
                <div>
                    <gliding-window-log id="log" cache={this.cache} status={this.status} capacity={50}></gliding-window-log>
                </div>
            </div>
        )
    }
}
