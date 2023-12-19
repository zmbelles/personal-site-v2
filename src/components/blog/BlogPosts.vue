<template>
    <div class="blog-posts">
      <div v-for="post in blogPosts" :key="post.id" class="blog-post">
        <BlogPost
          @toggle-reminder="$emit('toggle-reminder', post.id)"
          @delete-post="$emit('delete-post', post.id)"
          :post="post"
          @emit-to-blog-page="$emit('emit-to-blog-page', $event)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import BlogPost from './BlogPost'
  
  export default {
    name: 'BlogPosts',
    props: {
      blogPosts: Array,
    },
    components: {
      BlogPost,
    },
    emits: ['delete-post', 'toggle-reminder', 'emit-to-blog-page'],
  }
  </script>
  
  <style scoped>
  /* Styles for the BlogPosts component */
  .blog-posts {
    display: grid;
    grid-gap: 20px;
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
  }
  
  .blog-post {
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  .blog-post:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .blog-post h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .blog-post p {
    color: #888;
    margin-bottom: 10px;
  }
  
  .blog-post .body {
    line-height: 1.6;
  }
  </style>
  