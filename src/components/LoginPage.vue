<template>
    <div class="login-container">
      <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" />
            <div class="error" v-if="!isUsernameValid">
              Username must be at least 6 characters long.
            </div>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" />
            <div class="error" v-if="!isPasswordValid">
              Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a special character.
            </div>
            <div class="accepted" v-if="isAccepted">
              Welcome, {{  username }}
            </div>
            <div class="accepted" v-if="!isAccepted">
              please enter your password
            </div>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        isUsernameValid: false,
        isPasswordValid: false,
        isAccepted: false,
      };
    },
    methods: {
      submitForm() {
      // Validate the username and password
      this.isUsernameValid = this.username.length >= 6;
      this.isPasswordValid = this.validatePassword(this.password);

      // If both username and password are valid, perform login logic
      if (this.isUsernameValid && this.isPasswordValid) {
        this.isAccepted = true;
        // Create a crypto object to provide the missing crypto functionality
        
      }
    },
      validatePassword(password) {
        // Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a special character
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        return passwordRegex.test(password);
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .login-form {
    background-color: #ffffff;
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .error {
    color: red;
    margin-top: 5px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #9510D8;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  