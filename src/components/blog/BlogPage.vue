<template>
  <div class="blog-page">
    <div class="blog-post">
      <h2 class="blog-post-title">
        <router-link to="/blog/find-a-niche" class="post-link"
          >Find A Niche and Fill It</router-link>
      </h2>
      <p class="blog-post-body">
        Understanding how to navigate the heavily competitive job market for Computer Science graduates
      </p>
    </div>
    <div class="blog-post">
      <h2 class="blog-post-title">
          <router-link to="/blog/be-intentional" class="post-link">
            Be Intentional
          </router-link>
      </h2>
      <p class="blog-post-body">
          My software development Tips and Tricks for 2024
      </p>
    </div>
    <div class="blog-post">
      <h2 class="blog-post-title">
        <router-link to="/blog/first-year-lessons" class="post-link">
          Triumphs&#44; Trials&#44; and Takeaways
        </router-link>
      </h2>
      <p class="blog-post-body">
        What I&#39;ve learned in my First Year as a Professional Developer
      </p>
    </div>
    <div class="blog-post">
      <h2 class="blog-post-title">
        <router-link to="/blog/gpt-in-netsuite" class="post-link">
          The N/GPT Module
        </router-link>
      </h2>
      <p class="blog-post-body">
        Navigating SuiteScript with OpenAI&#39;s GPT-4 engine
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
    <div class="blog-post">
      <h2 class="blog-post-title">
        <router-link to="/blog/times-in-netsuite" class="post-link"
          >Upgrade your Advanced PDF&#39;s</router-link
        >
      </h2>
      <p class="blog-post-body">
        Learn how to enhance your NetSuite documents with NoToSerif fonts.
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
