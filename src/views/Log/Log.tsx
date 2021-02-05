
import { Component, Prop, Vue } from 'vue-property-decorator'
import styled from 'vue-styled-components'

@Component
export default class Home extends Vue {
  render () {
    return (
      <Wrapper>

      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
    height: 100vh;
    background: papayawhip;
`
