<template>
  <div class="blog-page">
    <div class="blog-post">
      <h2 class="blog-post-title">
        <router-link to="/blog/times-in-netsuite" class="post-link"
          >Upgrade your Advanced PDF's</router-link
        >
      </h2>
      <p class="blog-post-body">
        Learn how to enhance your NetSuite documents with NoToSerif fonts.
      </p>
    </div>
    <div class="blog-post">
      <h2 class="blog-post-title">
        <router-link to="/blog/promises-in-netsuite" class="post-link">
          Using Promises in Your SuiteScripts
        </router-link>
      </h2>
      <p class="blog-post-body">
        Discover the power of Promises in JavaScript for efficient SuiteScript development in NetSuite.
      </p>
    </div>
    <!-- Add more blog posts here -->
  </div>
</template>

<script>
export default {
  name: "BlogPage",
  // Your script here
};
</script>

<style scoped>
.blog-page {
  display: flex;
  flex-direction: column; /* Aligns children vertically */
  justify-content: center; /* Centers children vertically */
  align-items: center; /* Centers children horizontally */
  background-color: #181825;
  padding: 20px; /* Adds some space between the cards */
}

.blog-post {
  background-color: #362e5f;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  text-align: center;
  max-width: 400px;
  width: 100%;
  margin-bottom: 20px; /* Spacing between cards */
}

.blog-post-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #dfa8cd;
}

.blog-post-body {
  color: #bfa8cd;
  margin-bottom: 10px;
  line-height: 1.6;
}

.post-link {
  text-decoration: none;
  color: #9510d8;
  cursor: pointer;
}

.post-link:hover {
  text-decoration: underline;
}
</style>
