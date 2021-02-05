<template>
  <!-- <div id="app"> -->
  <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
  </div>-->
  <!-- <router-view /> -->
  <!-- </div> -->
  <el-container id="app">
    <el-header>
      <we-header/>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import Header from './components/common/Header'
export default {
  components: {
    'we-header': Header
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.el-header,
.el-main {
  padding: 0 !important;
}
.el-main {
  display: flex!important;
  flex-direction: column!important;;
}
</style>
