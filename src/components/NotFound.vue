<template>
  <div class="not-found">
    <div class="nf-card">
      <p class="nf-code">404</p>
      <h1>That page doesn’t exist</h1>
      <p class="nf-body">
        The link may be out of date, or the address may have a typo in it.
      </p>
      <div class="nf-links">
        <router-link to="/">Home</router-link>
        <router-link to="/blog">Blog</router-link>
        <router-link to="/seating-chart">Seating Chart</router-link>
        <router-link to="/games">Games</router-link>
        <router-link to="/contact">Contact</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 56vh;
  background-color: #181825;
  padding: 2rem 1rem;
}

.nf-card {
  background-color: #362e5f;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 32rem;
  width: 100%;
  text-align: center;
}

.nf-code {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3rem;
  margin: 0;
  color: #b39ddb;
  letter-spacing: 0.1em;
}

.nf-card h1 {
  color: #ffffff;
  font-size: 1.5rem;
  margin: 0.25rem 0 0.75rem;
}

.nf-body {
  color: #bfa8cd;
  margin: 0 0 1.5rem;
}

.nf-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.25rem;
}

.nf-links a {
  color: #b39ddb;
}
</style>
