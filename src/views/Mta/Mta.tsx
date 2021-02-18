
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
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

  formInline = {
    pin: '',
    deviceId: ''
  }

  checkList=['pv']

  query () {

  }

  clear () {
    (this.$refs.refMtaInfo as any).clear()
  }

  mounted () {

  }

  render () {
    return (
      <Wrapper ref="refWrap">
        <ControllersWrap>
          <el-row class="row" type="flex" justify="end">
            <div class="onlines">当前人数:{this.onlines}</div>
            <el-col>
              <el-form inline={true} vModel={this.formInline} class="form-inline">
                <el-checkbox-group vModel={this.checkList} class="checkboxWrap">
                  <el-checkbox label="pv"></el-checkbox>
                  <el-checkbox label="click" ></el-checkbox>
                  <el-checkbox label="show"></el-checkbox>
                </el-checkbox-group>
                <el-form-item label="DJ_Pin" >
                  <el-input vModel={this.formInline.pin} placeholder="请输入到家pin"></el-input>
                </el-form-item>
                <el-form-item label="DeviceId">
                  <el-input vModel={this.formInline.deviceId} placeholder="请输入DeviceId"></el-input>
                </el-form-item>
                {/* <el-form-item label="活动区域">
                  <el-select vModel={this.formInline.deviceId} placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item> */}
                <el-form-item>
                  <el-button type="primary" click={() => this.query()}>查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button click={this.clear}>清空</el-button>
                </el-form-item>
              </el-form>

            </el-col>
          </el-row>
        </ControllersWrap>

        <mta-info ref="refMtaInfo" logTypeList={this.checkList}/>

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
        height: 100%;
        .onlines {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content:center;
          flex: 0 0 auto;
          padding-left: 20px;
        }
        .form-inline {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .el-form-item {
          margin-bottom: 0;
        }
        .checkboxWrap {
          margin-right: 60px;
        }
    }
`
