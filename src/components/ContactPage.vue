<template>
  <title>Contact</title>
  <body class="contact">
    <div class="contact-container">
      <div class="form-head" style="color: #ffffff"><b>Get in touch</b></div>
      <form ref="form" @submit.prevent="submitForm">
        <div class="form-group">
          <br />
          <label for="fullName" style="color: #ffffff">Name:</label>
          <input type="text" id="first" v-model="fullName" /><br />
          <label for="email" style="color: #ffffff">Email Address: </label>
          <input type="text" id="email" v-model="reply_to" />
          <label for="message" style="color: #ffffff">Message:</label>
          <textarea class="textArea" type="text" id="message" v-model="message"></textarea>
        </div>
        <button type="submit">Submit</button><br /><br />
        <footer style="color: #181825"><b>Form powered by </b><a href="https://www.emailjs.com/"><b>EmailJS</b></a></footer>
      </form>
    </div>
    <div class="response" v-if="isSubmitted">
      <p>
        Thank you {{ firstName }}, I will respond to your request within 7 days.
      </p>
    </div>
    <div class="response" v-if="isError">
      <p>
        We're sorry {{ firstName }}, but something went wrong when processing your request. Please try \
        again later. Error: {{ errorName }}.
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
      console.log(`the public key is: `,publicKey);
      emailjs
        .send(
          "service_8uk1odc",
          "template_ieqs9um",
          {
            message: this.message,
            reply_to: this.reply_to,
            fullName: this.fullName,
          },
          "VU8oH3QKSdAU-CPe1",
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
  font-family: Arial, sans-serif;
  padding: 50px;
}
.contact-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  max-width: 400px;
  background-color: #362E5F;
  margin: 0 auto;
}
.form-head {
  font-family: Arial, sans-serif;
  font-size: 48px;
  color:#000000;
}
.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
}
.textArea {
  width: 360px;
  height: 200px;
  max-width: 360px;
  max-height: 200px;
}
.response {
  color: #ffffff
}
input {
  width: 80%;
  padding: 8px;
  border: 2px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #9510d8;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #b700ff;
}

button:active {
  background-color: #5c067d;
}
a:visited {
  color: #181825; 
}
</style>
