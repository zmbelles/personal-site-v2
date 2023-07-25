<template>
  <div class="blog-post">
    <h2>{{ post.title }}</h2>
    <p>{{ post.date }}</p>
    <div v-html="post.content"></div>
  </div>
</template>

<script>
export default {
  name: 'BlogPost',
  props: {
    post: Object,
  },
}
</script>

<style scoped>
.blog-post {
  background: #f4f4f4;
  margin: 5px;
  padding: 10px 20px;
}

.blog-post h2 {
  color: #333;
  margin-bottom: 5px;
}

.blog-post p {
  color: #888;
  margin-bottom: 10px;
}

.blog-post div {
  color: #555;
}
</style>
