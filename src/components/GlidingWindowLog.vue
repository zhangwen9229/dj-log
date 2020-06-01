<template>
  <div class="gliding-window-log-wrap">
    <div class="title-wrap" ref="windowHeaderRef">
      <div class="line-index no">No</div>
      <div class="line-os">OS</div>
      <div class="line-url">Url</div>
      <div class="line-msg">Message</div>
      <div class="line-ua">UA</div>
      <div class="line-extra">Extra</div>
      <div class="line-errortime">ErrorTime</div>
      <div
        class="line-clientip"
        :style="showPadding ? {paddingRight: `${this.barwidth}px`} : ''"
      >ClientIp</div>
    </div>
    <div :id="id" class="gliding-window-log" ref="windowContentRef">
      <div class="row" v-for="item in logWindow" :id="'log-line-'+item.index" :key="item.index">
        <div class="line-index">{{item.index }}</div>
        <div class="line-os">{{item.line.os || ' '}}</div>
        <div class="line-url">{{item.line.url || ' '}}</div>
        <div class="line-msg">
          <div>{{item.line.msg || ' '}}</div>
        </div>
        <div class="line-ua">{{item.line.ua || ' '}}</div>
        <div class="line-extra">
          <pre>{{ item.line.extra ? getExraMsg(item.line.extra) : ' '}}</pre>
        </div>
        <div class="line-errortime">{{item.line.errorTime || ' '}}</div>
        <div class="line-clientip">{{item.line.clientIps ? item.line.clientIps.join(',') : ' '}}</div>
        <!-- <div v-if="item.line" class="line-content">{{item.line}}</div> -->
        <!-- <br v-else /> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id', 'cache', 'status', 'capacity'],
  data () {
    return {
      tick: 1, // 窗口数
      currentEndIndex: -1, // 记录改变lockScroll状态时的最末log的index
      lockScroll: true, // 滚动锁定，为true时始终滚动条沉底
      output: [],
      barwidth: 0,
      showPadding: false,
      setTimeoutMap: {}
    }
  },
  computed: {
    logWindow () {
      // 当前显示的log窗口的所有log
      if (this.lockScroll) {
      }
      // 只是告诉在lockScroll更新时刷新logWindow
      // 因为有暗箱操作，所以需要在滚动条触底时（lockScroll为true）更新logWindow
      let size = this.capacity * this.tick
      let start = this.currentEndIndex - size + 1
      if (start < 0) {
        start = 0
      }
      return this.output.slice(start, this.currentEndIndex + 1)
    },
    isRunning () {
      return this.status === 'running'
    }
  },
  watch: {
    status () {
      if (this.isRunning) {
        this.output = []
        this.addLine()
      }
      this.tick = 1
      this.lockScroll = true
    },
    output () {
      if (this.lockScroll) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
      this.currentEndIndex = this.output.length - 1
    },
    lockScroll () {
      if (this.isRunning) {
        this.tick = 1
      }
      this.currentEndIndex = this.output.length - 1
    }
  },
  methods: {
    getExraMsg (extra) {
      let msg = ''
      extra = extra || {}
      console.log('----sdg-s-dg--')
      console.log(extra)
      for (const key in extra) {
        if (extra.hasOwnProperty(key)) {
          let value = extra[key]
          try {
            value = JSON.parse(value)
            console.log(value)
          } catch (error) {
          }
          value = value.componentStack || value
          if (typeof value === 'object') {
            value = JSON.stringify(value)
          }
          console.log(value.message, JSON.stringify(value))
          msg += `${key}:\n${value}\n`
        }
      }
      return msg
    },
    scrollToBottom () {
      let logBody = document.getElementById(this.id)
      if (logBody) {
        logBody.scrollTop = logBody.scrollHeight
      }
    },
    bindScrollbar () {
      let logDiv = document.getElementById(this.id)
      logDiv.addEventListener('scroll', e => {
        if (this.output.length > this.capacity) {
          if (
            e.target.scrollTop + logDiv.clientHeight ===
            logDiv.scrollHeight
          ) {
            // 判断触底
            this.lockScroll = true
          } else {
            // 尝试往上滚
            this.lockScroll = false
          }
        }

        if (
          ((this.isRunning && !this.lockScroll) || !this.isRunning) &&
          this.output.length !== 0 &&
          e.target.scrollTop === 0
        ) {
          // 触顶增加tick
          let last = this.logWindow[this.logWindow.length - 1]
          let index = last.index - this.capacity * this.tick
          if (index > 0 && this.logWindow.length < this.output.length) {
            this.tick++
            this.$nextTick(() => {
              document.getElementById('log-line-' + index).scrollIntoView()
            })
          }
        }
      })
    },
    // cache向output推num条日志，silent决定是否触发output的数组侦听
    flush (num, silent) {
      silent = silent || false
      let intercept = this.cache.splice(0, num).map((item, i) => {
        return {
          line: item,
          index: this.output.length + i
        }
      })

      if (silent) {
        // vue变异方法是在继承了原生方法的基础上写的监听数组的方法，所以用原生的push.apply不会有监听
        [].push.apply(this.output, intercept)
      } else {
        this.output = this.output.concat(intercept)
      }
    },
    // 增加行数，考虑不同状态下的向output推log的策略
    // 1. 在运行且非滚动锁定时，silent为true，界面logWindow不会因为output变化而变化
    // 2. 没有在运行时（完成，停止，失败），日志直接全给，silent为false
    // 3. 在运行时且滚动锁定时，50条以外的log直接给，最新的50条一条条刷动画
    addLine () {
      if ((this.isRunning && !this.lockScroll) || !this.isRunning) {
        // 为了避免运行＋滚动的性能问题，就不实时给界面了
        this.flush(this.cache.length, this.isRunning)
      } else {
        if (this.cache.length > 50) {
          // 只刷最后50条
          this.flush(this.cache.length - 50)
        } else {
          let item = this.cache.shift()
          if (item) {
            this.output.push({
              line: item,
              index: this.output.length
            })
          }
        }
      }
      if (this.isRunning || this.cache.length > 0) {
        // let frequency = Math.min((1 / this.cache.length) * 1000, 100)

        if (this.output.length >= 6000) {
          this.output.splice(0, 1000)
          // this.output = this.output
        }

        const st = setTimeout(() => {
          this.addLine()
          delete this.setTimeoutMap[st]
        }, 100)
        this.setTimeoutMap[st] = 1

        const flag = this.hasScrollbar()
        if (flag && !this.showPadding) {
          this.showPadding = true
        } else if (!flag && this.showPadding) {
          this.showPadding = false
        }
      }
    },
    // 判断是否有滚动条的方法
    hasScrollbar () {
      let logBody = document.getElementById(this.id)
      return (
        logBody.scrollHeight > (logBody.innerHeight || logBody.clientHeight)
      )
    },
    // 计算滚动条宽度的方法
    // 新建一个带有滚动条的 div 元素，通过该元素的 offsetWidth 和 clientWidth 的差值即可获得
    getScrollbarWidth () {
      var scrollDiv = document.createElement('div')
      scrollDiv.style.cssText =
        'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
      document.body.appendChild(scrollDiv)
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      return scrollbarWidth
    },
    clearTmp () {
      this.output = []
    },
    clear () {
      for (const key in this.setTimeoutMap) {
        clearInterval(key)
      }
      this.output = []
    }
  },
  mounted () {
    this.barwidth = this.getScrollbarWidth()
    console.log('this.barwidth', this.barwidth)
    this.bindScrollbar()

    this.$refs.windowContentRef.addEventListener('scroll', (e) => {
      this.$refs.windowHeaderRef.scrollLeft = e.target.scrollLeft
    }, false)

    this.$refs.windowHeaderRef.addEventListener('scroll', (e) => {
      this.$refs.windowContentRef.scrollLeft = e.target.scrollLeft
    }, false)
  },
  beforeDestroy () {
    for (const key in this.setTimeoutMap) {
      console.log(key)
      clearInterval(key)
    }
  }
}
</script>

<style lang='scss' scoped>
.gliding-window-log-wrap {
  background-color: #37393d;
  color: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title-wrap {
    // position: absolute;
    // top: 0;
    // z-index: 2;
    width: 100%;
    display: flex;
    height: 40px;
    background-color: #131313 !important;
    color: #ffffff !important;
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    > div {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    .no {
      width: 40px;
      justify-content: flex-end !important;
      background-color: #131313 !important;
      color: #ffffff !important;
    }
  }
  .row {
    display: flex;
    align-items: stretch;
    min-height: 22px;
    width: 100%;
    > div {
      min-height: 22px;
      max-height: 200px;
      display: flex;
      // align-items: center;
      justify-content: center;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      word-break: break-word;
      overflow-y: auto;
      pre {
        word-wrap: break-word;
        white-space: pre-wrap;
        margin: 0;
      }
    }
  }
  .line-index {
    //   position: absolute;
    //   left: 0;
    color: #4d4e50;
    width: 40px;
    flex: 0 0 40px;
    background-color: #2e2e2e;
    text-align: right;
    justify-content: flex-end !important;
    padding-right: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .line-os {
    width: 80px;
    flex: 0 0 80px;
  }
  .line-url {
    width: 200px;
    flex: 0 0 200px;
    text-align: left;
  }
  .line-msg {
    width: 100px;
    flex: 0 0 100px;
    text-align: left;
  }
  .line-ua {
    width: 300px;
    flex-shrink: 0;
    text-align: left;
  }
  .line-extra {
    // width: 200px;
    // flex: 0 0 200px;
    justify-self: start;
    flex: 1;
    min-width: 200px;
    text-align: left;
  }
  .line-errortime {
    width: 160px;
    flex: 0 0 160px;
  }
  .line-clientip {
    width: 150px;
    flex: 0 0 150px;
  }
  .line-content {
    white-space: nowrap;
    margin-left: 10px;
    padding-left: 20px;
    color: #ccc;
  }
  .line-content:hover {
    background-color: #555;
  }
}
.gliding-window-log {
  position: relative;
  overflow: auto;
  flex: 1;
  background-color: #37393d;
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  line-height: 22px;
  min-height: 300px;
}
</style>
