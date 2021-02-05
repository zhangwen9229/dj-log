
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="home">日志监控平台</el-menu-item>
    <el-menu-item index="mta">埋点监控</el-menu-item>
    <!-- <el-menu-item index="2"
      ><a href="" target="_blank">test</a></el-menu-item> -->
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: 'home'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
      this.$router.push({ name: key })
    }
  },
  watch: {
    '$route': {
      handler (route) {
        this.activeIndex = route.name
      },
      immediate: true
    }
  }
}
</script>

<style>
</style>
