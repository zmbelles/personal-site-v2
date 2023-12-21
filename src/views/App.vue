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
import Navbar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>

<style>
html,
body {
  height: 100%; /* Make sure html and body cover the full height of the viewport */
  margin: 0; /* Remove the default margin */
  background-color: #181825; /* Set the background color */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #181825;
}

.footer {
  background-color: #181825;
  color: #ffffff;
}
a:visited {
  color: #9510d8;
}
</style>
