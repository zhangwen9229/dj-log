
import { Component, Prop, Vue } from 'vue-property-decorator'

import './test.scss'
// const styles = require('./test.scss')
// console.log(styles)

@Component
export default class Test extends Vue {
  @Prop() private msg!: string;

  render () {
    return (
      <div class="div">{this.msg}</div>
    )
  }
}
