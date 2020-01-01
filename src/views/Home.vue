<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Test msg="test111"></Test>
    <button @click="ontest">test throw</button>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Test from './test/test'

export default {
  name: 'home',
  components: {
    Test
  },
  methods: {
    ontest () {
      throw new TypeError('eeee')
    }
  }
}
// var a = 1
// b = c
</script>
