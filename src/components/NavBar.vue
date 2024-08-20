<template>
  <header>
    <!-- <div class="nav-left">
      <router-link to="/login">Login</router-link>
    </div> -->
    <img src="@/assets/Banner.png" alt="Banner" class="banner-image" />
    <div class="nav-right">
      <nav>
        <div class="nav-links">
            <router-link to="/">Home</router-link>
            <router-link to="/resume">Resume</router-link>
            <router-link to="/contact">Contact Me</router-link>
            <router-link to="/games">Games</router-link>
            <router-link to="/blog">Blog</router-link>
            <!-- <router-link to="/Forms">Forms</router-link> -->
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
.banner-image {
  width: 100%;
  height: auto;
  display: block;
}

header {
  background-color: #181825;
  padding: 1rem 0; /* Remains unchanged, already using relative unit */
}

.nav-links {
  display: flex;
  justify-content: center; /* Center links for a balanced look */
  flex-wrap: wrap; /* Allow the nav items to wrap on smaller screens */
  color: #dadada;
  background-color: #362E5F;
  box-shadow: 0 2px 4px rgba(223, 168, 205, 0.5);
  padding: 0.5rem 1rem; /* Adjusted to rem */
}
.nav-links a {
  text-decoration: none;
  color: #B39DDB;
  padding: 0.5rem 0.75rem; /* Use rem for scalable padding */
  margin: 0 3rem; /* Use rem to ensure consistent spacing */
  white-space: nowrap; /* Prevents the text from wrapping */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-links {
    justify-content: space-around; /* Ensures even spacing on smaller screens */
    padding: 0.5rem; /* Adjust padding for smaller screens */
  }

  .nav-links a {
    padding: 0.5rem; /* Adjust link padding on smaller screens */
    margin: 0.25rem; /* Reduce margin on smaller screens */
    font-size: 0.9rem; /* Smaller font size for smaller screens */
  }
}

</style>
