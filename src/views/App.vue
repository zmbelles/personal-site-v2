<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
    <footer class="footer">
      <br><br>
      <div class="social-media-links">
        <a href="https://www.facebook.com/zachary.belles.372" target="_blank">
            <img src="@/assets/facebook.jpg" alt="Facebook" class="social-media-logo">
        </a>
        <a href="https://www.instagram.com/zachb1997/" target="_blank">
            <img src="@/assets/instagram.jpg" alt="Facebook" class="social-media-logo">
        </a>
        <a href="https://www.linkedin.com/in/zachary-belles-333b42108/" target="_blank">
            <img src="@/assets/linkedin.png" alt="LinkedIn">
        </a>
        <!-- Add other social media links similarly -->
    </div>
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
footer .social-media-links a {
    display: inline-block; /* Align links in a line */
    margin: 0 10px; /* Add some horizontal spacing */
}

footer .social-media-links img {
    height: 40px; /* Set a fixed height for logos */
    width: auto; /* Maintain aspect ratio */
}
.social-media-logo {
    border-radius: 50%; /* Makes the image circular */
    width: 40px;  /* Set a fixed width */
    height: 40px; /* Set a fixed height, equal to width for a perfect circle */
    object-fit: cover; /* Ensures the image covers the area without stretching */
}
a:visited {
  color: #9510d8;
}
</style>
