
import { listenServer, removeServerListner } from '@/Business/io'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import styled from 'vue-styled-components'

@Component
export default class MtaInfo extends Vue {
    @Prop({ default () { return [] } })
    logTypeList!: any[]

    handleClick (row) {
      console.log(row)
    }

    originDataList: any[] = []
    dataList: any[] = []

    @Watch('logTypeList')
    onCheckListChanged (value) {
    //   console.log(this.logTypeList)
      this.filterDataList()
    }

    mounted () {
      this.$bus.$on('windowResize', () => {
        this.$nextTick(() => {
          (this.$refs.refTable as any).doLayout()
        })
      })
      this.init()
    }

    init () {
      listenServer('mta', this.listenServerLog, true)
    }

    listenServerLog (res: any) {
      const list = res.extra.data || []
      //   console.log('res.extra.data', list)
      list.forEach((item) => {
        const logDataType = item.log_data_type
        // console.log('log_data_type', logDataType, JSON.stringify(item))
        if (logDataType === 'show') {
          item.page_name = item.cur_page
        }
      })
      this.originDataList.push(...list)

      this.filterDataList()
    }

    beforeDestroy () {
      removeServerListner('mta', this.listenServerLog, true)
    }

    filterDataList () {
      this.dataList = this.originDataList.filter((item) => {
        return this.logTypeList.some((logType) => {
          console.log('logType', logType, item.log_data_type)
          return item.log_data_type.includes(logType)
        })
      })
    }

    clear () {
      this.originDataList = []
      this.dataList = []
    }

    render () {
      return (
        <Wrapper ref="refWrap">
          <el-table
            ref="refTable"
            data={this.dataList}
            height="100%"
            border
                // style={`width: 100%;height:${this.logWrapHeight}px`}
          >
            <el-table-column type="expand"

              {...{
                scopedSlots: {
                  default: scope => {
                    return (
                      <div>
                        {JSON.stringify(scope.row) }
                      </div>
                    )
                  }
                }
              }}
            >
            </el-table-column>
            <el-table-column
            //   fixed
              prop="create_time"
              label="上报时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="log_data_type"
              label="埋点类型"
              width="80">
            </el-table-column>
            <el-table-column
              prop="ref_page_name"
              label="ref_pagename"
              width="120">
            </el-table-column>
            <el-table-column
              prop="page_name"
              label="page_name"
              width="120">
            </el-table-column>
            <el-table-column
              prop="city_name_select"
              label="市区"
              width="120">
            </el-table-column>
            <el-table-column
              prop="poi"
              label="地址"
              width="300">
            </el-table-column>
            <el-table-column
              prop="zip"
              label="邮编"
                    // width="120"
            >
            </el-table-column>
            {/* <el-table-column
              fixed="right"
              label="操作"
              width="200"
              {...{
                scopedSlots: {
                  default: scope => {
                    return (
                      <OneLine>
                        <el-button click={() => this.handleClick(scope.row)} type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                      </OneLine>
                    )
                  }
                }
              }}
            >
            </el-table-column> */
            }
          </el-table>

        </Wrapper >
      )
    }
}

const OneLine = styled.div`
    width: '100%'
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
`
