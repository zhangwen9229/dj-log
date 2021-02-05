
import { Component, Prop, Vue } from 'vue-property-decorator'
import styled from 'vue-styled-components'
import { mapState } from 'vuex'
import MtaInfo from './widgets/MtaInfo'

@Component({
  components: {
    'mta-info': MtaInfo
  },
  computed: {
    ...mapState({
      '_onlines': (state: any) => state.onlines
    })
  }
})
export default class Home extends Vue {
  public get onlines (): string {
    return (this as any)._onlines
  }

  mounted () {

  }

  render () {
    return (
      <Wrapper ref="refWrap">
        <ControllersWrap>
          <el-row class="row" type="flex" justify="end">
            <el-col class="onlines">当前人数:{this.onlines}</el-col>
          </el-row>
        </ControllersWrap>

        <mta-info/>

      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    background: papayawhip;
`
const ControllersWrap = styled.div`
    height: 60px;
    flex: 0 0 60px;
    display: flex;
    align-items: center;
    .row {
        padding-right: 30px;
        flex:1;
        .onlines {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content:center;
        }
    }
`
