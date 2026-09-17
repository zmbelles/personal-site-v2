<template>
  <div class="contact container">
    <div class="contact-intro">
      <p class="eyebrow">Contact</p>
      <h1>Let's talk NetSuite</h1>
      <p class="lede">
        Questions about SuiteScript, a project you'd like a hand with, a reference
        request, or feedback on something here. Send a message and I'll reply
        within 7 days.
      </p>

      <ul class="channels">
        <li>
          <span class="channel-label">Email</span>
          <a href="mailto:zmbelles97@gmail.com">zmbelles97@gmail.com</a>
        </li>
        <li>
          <span class="channel-label">LinkedIn</span>
          <a href="https://www.linkedin.com/in/zachary-belles-333b42108/" target="_blank" rel="noopener">zachary-belles</a>
        </li>
        <li>
          <span class="channel-label">GitHub</span>
          <a href="https://github.com/zmbelles" target="_blank" rel="noopener">zmbelles</a>
        </li>
      </ul>
    </div>

    <div class="form-card">
      <div v-if="isSubmitted" class="notice notice--success" role="status">
        <h2>Thanks{{ sentName ? ", " + sentName : "" }}!</h2>
        <p>Your message is on its way. I'll respond within 7 days.</p>
        <button type="button" class="btn btn--ghost btn--sm" @click="isSubmitted = false">Send another</button>
      </div>

      <form v-else ref="form" @submit.prevent="submitForm">
        <div class="field">
          <label for="fullName">Name</label>
          <input id="fullName" v-model="fullName" type="text" autocomplete="name" placeholder="Your name" required />
        </div>
        <div class="field">
          <label for="email">Email address</label>
          <input id="email" v-model="reply_to" type="email" autocomplete="email" placeholder="you@company.com" required />
        </div>
        <div class="field">
          <label for="message">Message</label>
          <textarea id="message" v-model="message" rows="7" placeholder="What can I help with?" required></textarea>
        </div>

        <p v-if="isError" class="notice notice--error" role="alert">
          Sorry, something went wrong sending your message. Please try again later,
          or email me directly. Error: {{ errorName }}.
        </p>

        <button type="submit" class="btn btn--primary submit" :disabled="isSending">
          {{ isSending ? "Sending…" : "Send message" }}
        </button>
        <p class="powered">Form powered by <a href="https://www.emailjs.com/" target="_blank" rel="noopener">EmailJS</a></p>
      </form>
    </div>
  </div>
</template>

<script>
import emailjs from "@emailjs/browser";

export default {
  name: "ContactPage",
  data() {
    return {
      fullName: "",
      reply_to: "",
      message: "",
      sentName: "",
      isSending: false,
      isSubmitted: false,
      isError: false,
      errorName: "",
    };
  },
  methods: {
    submitForm() {
      const publicKey = process.env.VUE_APP_EMAILJS_PUBLIC_KEY;
      this.isSending = true;
      this.isError = false;
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
            this.sentName = this.fullName.trim().split(/\s+/)[0];
            this.isSubmitted = true;
            this.fullName = "";
            this.reply_to = "";
            this.message = "";
          },
          (error) => {
            this.errorName = error.text || "unknown";
            this.isError = true;
          }
        )
        .finally(() => {
          this.isSending = false;
        });
    },
  },
};
</script>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(32px, 6vw, 72px);
  padding-block: clamp(48px, 8vw, 88px) clamp(64px, 10vw, 112px);
}

.contact h1 {
  font-size: clamp(2.25rem, 5.5vw, 3.5rem);
  font-weight: 600;
  margin: 12px 0 0;
}

.lede {
  color: var(--text-muted);
  font-size: 1.0625rem;
  max-width: 48ch;
  margin: 16px 0 0;
}

.channels {
  list-style: none;
  margin: 36px 0 0;
  padding: 0;
  display: grid;
  gap: 2px;
  border-top: 1px solid var(--border);
}

.channels li {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  overflow-wrap: anywhere;
}

.channel-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
  padding-top: 3px;
}

.form-card {
  padding: clamp(24px, 4vw, 36px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-strong);
  background:
    radial-gradient(ellipse at 100% 0%, rgba(116, 103, 176, 0.22), transparent 55%),
    var(--surface);
  box-shadow: var(--shadow);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-soft);
}

input,
textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--border-strong);
  background: var(--bg-deep);
  color: var(--text);
  font: 400 1rem/1.5 var(--font-sans);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

textarea {
  resize: vertical;
  min-height: 150px;
}

input::placeholder,
textarea::placeholder {
  color: var(--text-faint);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(179, 157, 219, 0.2);
}

.submit {
  width: 100%;
  margin-top: 4px;
}

.powered {
  margin: 14px 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--text-faint);
}

.notice {
  margin: 0 0 18px;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 0.9375rem;
}

.notice--error {
  border: 1px solid rgba(239, 143, 143, 0.4);
  background: rgba(239, 143, 143, 0.08);
  color: #f3b4b4;
}

.notice--success {
  margin: 0;
  padding: 8px 0;
}

.notice--success h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.notice--success p {
  color: var(--text-muted);
  margin: 10px 0 20px;
}

@media (max-width: 860px) {
  .contact {
    grid-template-columns: 1fr;
  }
}
</style>
