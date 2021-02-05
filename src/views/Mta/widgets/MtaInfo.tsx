
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import styled from 'vue-styled-components'

@Component
export default class MtaInfo extends Vue {
  handleClick (row) {
    console.log(row)
  }

    tableData = [{
      date: '2016-05-02 06:07:12',
      page_name: 'home',
      ref_pagename: '',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1518 弄',
      zip: 200333
    }, {
      date: '2016-05-02 06:07:22',
      page_name: 'storeinfo',
      ref_pagename: 'home',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1518 弄',
      zip: 200333
    }]

    mounted () {
      this.$bus.$on('windowResize', () => {
        this.$nextTick(() => {
          (this.$refs.refTable as any).doLayout()
        })
      })
    }

    render () {
      return (
        <Wrapper ref="refWrap">
          <el-table
            ref="refTable"
            data={this.tableData}
            height="100%"
            border
            // style={`width: 100%;height:${this.logWrapHeight}px`}
          >
            <el-table-column
              fixed
              prop="date"
              label="上报时间"
              width="170">
            </el-table-column>
            <el-table-column
              prop="ref_pagename"
              label="ref_pagename"
              width="120">
            </el-table-column>
            <el-table-column
              prop="page_name"
              label="page_name"
              width="120">
            </el-table-column>
            <el-table-column
              prop="city"
              label="市区"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              width="300">
            </el-table-column>
            <el-table-column
              prop="zip"
              label="邮编"
              // width="120"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
              { ...{
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
              } }
            >
            </el-table-column>
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
