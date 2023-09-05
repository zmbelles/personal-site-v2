<template>
  <header>
    <div class="nav-left">
      <router-link to="/login">Login</router-link>
    </div>
    <div class="quote">
      <p><i>"I don't write code with bugs in it"</i></p>
      <p>    -Dr. Sun-il Kim</p>
    </div>
    <div class="name">
        Zachary Belles 
    </div>
    <div class="nav-right">
      <nav>
        <div class="nav-links">
            <router-link to="/">Home</router-link>
            <router-link to="/resume">Resume</router-link>
            <router-link to="/contact">Contact Me</router-link>
            <router-link to="/games">Games</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>


<script>
export default {
  name: 'NavBar',
}
</script>


<style scoped>
/* Component-specific styles */
header {
  background-color: #2c2c2c;
  padding: 20px;
}

.nav-left {
  flex: 1;
  align-items: right;
  text-align: right;
  color: #ffffff;
}

.nav-left a {
  color: #ffffff;
}

.nav-left a:visited {
  color: #9510d8;
}

.header-container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 960px;
  padding: 0 20px;
  align-items: center;
}

.name {
  color: #ffffff;
  margin: 4;
  text-align: center;
  padding: 2;
  font-size: 72px;
}

.nav-links {
  display: flex;
  color: #dadada;
  box-shadow: 0 2px 4px rgba(199, 192, 192, 0.1);
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
}

.quote {
  color: #ffffff;
  max-width: 400px;
  text-align: center;
  margin: 0 auto; /* Add this line to center the quote */
}

.nav-links a {
  text-decoration: none;
  color: #dadada;
  padding: 10px;
}
</style>
