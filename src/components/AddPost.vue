<template>
    <form @submit="onSubmit" class="add-form">
      <div class="form-control">
        <label>Title</label>
        <input type="text" v-model="title" name="title" placeholder="Add Title" />
      </div>
      <div class="form-control">
        <label>Content</label>
        <textarea v-model="content" name="content" placeholder="Add Content"></textarea>
      </div>
      <div class="form-control">
        <label>Date</label>
        <input type="text" v-model="date" name="date" placeholder="Add Date" />
      </div>
  
      <input type="submit" value="Save Post" class="btn btn-block" />
    </form>
  </template>
  
  <script>
  export default {
    name: 'AddPost',
    data() {
      return {
        title: '',
        content: '',
        date: '',
      }
    },
    methods: {
      onSubmit(e) {
        e.preventDefault()
  
        if (!this.title || !this.content || !this.date) {
          alert('Please fill in all fields')
          return
        }
  
        const newPost = {
          title: this.title,
          content: this.content,
          date: this.date,
        }
  
        this.$emit('add-post', newPost)
  
        this.title = ''
        this.content = ''
        this.date = ''
      },
    },
  }
  </script>
  
  <style scoped>
  .add-form {
    margin-bottom: 40px;
  }
  
  .form-control {
    margin: 20px 0;
  }
  
  .form-control label {
    display: block;
  }
  
  .form-control input,
  .form-control textarea {
    width: 100%;
    height: 40px;
    margin: 5px;
    padding: 3px 7px;
    font-size: 17px;
  }
  
  .form-control textarea {
    height: 120px;
  }
  
  </style>
  