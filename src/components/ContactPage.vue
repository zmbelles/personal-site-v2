<template>
  <title>Contact</title>
  <body class="contact">
    <div class="contact-container">
      <div class="form-head">Get in Touch</div>
      <form ref="form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="fullName">Name:</label>
          <input type="text" id="first" v-model="fullName" placeholder="Enter your name" required /><br />
          <label for="email">Email Address:</label>
          <input type="email" id="email" v-model="reply_to" placeholder="Enter your email" required />
          <label for="message">Message:</label>
          <textarea class="textArea" id="message" v-model="message" placeholder="Your message" required></textarea>
        </div>
        <button type="submit">Submit</button><br /><br />
        <footer>
          <b>Form powered by </b><a href="https://www.emailjs.com/">EmailJS</a>
        </footer>
      </form>
    </div>
    <div class="response" v-if="isSubmitted">
      <p>
        Thank you {{ firstName }}, I will respond to your request within 7 days.
      </p>
    </div>
    <div class="response" v-if="isError">
      <p>
        We're sorry {{ firstName }}, but something went wrong when processing your request. Please try again later. Error: {{ errorName }}.
      </p>
    </div>
  </body>
</template>

<script>
import emailjs from "@emailjs/browser";
export default {
  data() {
    return {
      fullName: "",
      reply_to: "",
      isSubmitted: false,
      isError: false,
      errorName: "",
      message: "",
    };
  },
  methods: {
    submitForm() {
      const publicKey = process.env.VUE_APP_EMAILJS_PUBLIC_KEY;
      emailjs
        .send(
          "service_8uk1odc",
          "template_ieqs9um",
          {
            message: this.message,
            reply_to: this.reply_to,
            fullName: this.fullName,
          },
          publicKey
        )
        .then(
          () => {
            this.isSubmitted = true;
            this.fullName = "";
            this.reply_to = "";
            this.message = "";
          },
          (error) => {
            this.errorName = error.text;
            this.isError = true;
          }
        );
    },
  },
};
</script>

<style scoped>
.contact {
  background-color: #181825;
  font-family: 'Roboto', sans-serif;
  padding: 50px;
  color: #E0E0E0;
}

.contact-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  background-color: #362E5F;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
}

.form-head {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  text-align: center; /* Center align text and inline elements */
}

.form-group label {
  display: inline-block;
  margin-bottom: 5px;
  text-align: left;
  width: 100%;
}

input,
textarea {
  width: 100%; 
  max-width: 95%; 
  padding: 10px;
  border: 1px solid #6C63FF;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #181825;
  color: #E0E0E0;
}

.textArea {
  width: calc(100% - 20px); /* Adjusting for padding */
  max-width: 100%;
  height: 200px;
}

button {
  width: 100%; /* Ensure button is centered and full width */
  padding: 10px;
  background-color: #6C63FF;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #9F87FF;
}

button:active {
  background-color: #4C43B0;
}

</style>
