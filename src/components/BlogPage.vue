<template>
  <div class="blog-page">
    <AddPost v-show="showAddPost" @add-post="addPost" />
    <div class="blog-posts">
      <div v-for="post in blogPosts" :key="post.post_id" class="blog-post">
        <router-link :to="'/blog/' + post.post_id" class="post-link">
          <h2 class="blog-post-title">{{ post.title }}</h2>
        </router-link>
        <div class="blog-post-body">{{ truncateText(post.body, 200) }}</div>
        <p class="blog-post-date">{{ formatDate(post.post_date) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AddPost from './AddPost';

export default {
  name: 'BlogPage',
  props: {
    showAddPost: Boolean,
  },
  components: {
    AddPost,
  },
  data() {
    return {
      blogPosts: [],
    };
  },
  methods: {
    async addPost(post) {
      try {
        const response = await fetch('http://localhost:5000/posts', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(post),
        });
        if (!response.ok) {
          throw new Error('Failed to add post');
        }
        const data = await response.json();
        this.blogPosts.push(data);
      } catch (error) {
        console.error(error);
        // Handle the error case, such as showing an error message to the user
      }
    },
    async fetchPosts() {
      try {
        const response = await fetch('http://localhost:5000/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        // Handle the error case, such as showing an error message to the user
      }
    },
    formatDate(dateString) {
      // Implement your logic to format the date string here
      // For example:
      // const date = new Date(dateString)
      // return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      return dateString;
    },
    truncateText(text, maxLength) {
      if (text.length <= maxLength) {
        return text;
      }
      return text.slice(0, maxLength) + '...';
    },
  },
  async created() {
    try {
      this.blogPosts = await this.fetchPosts();
    } catch (error) {
      console.error(error);
      // Handle the error case, such as showing an error message to the user
    }
  },
};
</script>

<style scoped>
.blog-page {
  padding: 20px;
}

.blog-posts {
  display: grid;
  grid-gap: 20px;
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
}

.blog-post {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
}

.blog-post-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.blog-post-date {
  color: #888;
  margin-bottom: 10px;
}

.blog-post-body {
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
