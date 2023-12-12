<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
    <footer class="footer">
      Made by <a href="http://github.com/zmbelles">Zachary Belles</a> in Vue.js 
      <p>&copy;2023 All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
import Navbar from '@/components/NavBar.vue';


export default {
  name: 'App',
  components: {
    Navbar,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.footer {
  background-color: #181825;
  color: #ffffff    
}
</style>
