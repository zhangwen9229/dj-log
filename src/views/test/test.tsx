
import { Component, Prop, Vue } from 'vue-property-decorator'

import styles from './test.scss'

@Component
export default class Test extends Vue {
  @Prop() private msg!: string;

  render () {
      return (
          <div class={styles.div}>{this.msg}</div>
      )
  }
}
