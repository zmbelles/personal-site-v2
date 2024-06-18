<template>
  <div class="blog-page">
    <h1>{{ title }}</h1>
    <h2>{{ subHeader }}</h2>
    <p class="publication-date">Published on: February 12, 2024 at 9:05pm CST</p> <!-- Publication date -->
    <div class="introduction">
      <p>{{ intro }}</p>
    </div>
    <div class="content">
      <section v-for="(concern, index) in concerns" :key="index">
        <h2>{{ concern.title }}</h2>
        <p>{{ concern.description }}</p>
        <a v-if="concern.link" :href="concern.link.url" target="_blank">{{ concern.link.text }}</a>
      </section>
    </div>
    <div class="conclusion">
      <h2>Final Thoughts</h2>
      <p>{{ finalThoughts }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPost',
  data() {
    return {
      title: "The N/GPT Module",
      subHeader: "Navigating SuiteScript with OpenAI’s GPT-4 engine",
      intro: `In my role as a NetSuite developer over the past year, I have frequently utilized 
              ChatGPT for generating quick templates for different script types. In the beginning,
              I tried to have ChatGPT do solution design for me, asking it to write specific code
              related to a clients NetSuite Implimentation; exposing it to code that is company property. 
              This raises several questions: Is leveraging ChatGPT in this manner appropriate? What 
              about using it to debug an entire Client Script file? And, more broadly, should the 
              potential of AI to perform developer tasks justify reducing the human workforce? This
              last thought seems extreme but it is a case a coworker heard from a panel at SuiteWorld. 
              With the advent of GPT-4, such practices have become more common, prompting a discussion 
              on the ethical and logical implications of integrating AI into SuiteScript development. 
              This post aims to explore three major concerns related to the use of GPT-4 in SuiteScript 
              coding and offers guidance on employing safe practices to navigate this evolving landscape.`,
      concerns: [
        {
          title: "Ethical/Logical Concern 1: Mined Data",
          description: `ChatGPT as a Large Language Model (LLM) gets better through being trained on real
                        world data. The best place for OpenAI to mine this data is from the conversations
                        it has with its users. This in theory allows OpenAI to use your Intelectual Property
                        if you do not use it properly. 
                        
                        Example: You are have a SuiteApp published on the SuiteApp marketplace, an app that
                        makes your company $4500 per year per client. You decide to make a new version but
                        have run into a bug that you cannot figure out. You give ChatGPT your entire file 
                        and voila! your bug has been fixed. However, now ChatGPT, when retraining occurs, 
                        can enable all of your clients the tools to make a SuiteApp of their own because it
                        was able to train off of the data you gave it from your own SuiteApp.`,
          link: {
            url: "https://openai.com/chatgpt/team",
            text: "Learn more about ChatGPT Team"
          }
        },
        {
          title: "Ethical/Logical Concern 2: Hallucination scales with complexity",
          description: `Hallucinations have always been a concern with LLMs and this problem is 
                        confounded if you attempt to use an LLM to do something along the lines of
                        solution design. From my experience, GPT-4 can reduce development time when 
                        used to create boiler-plate templates, however, that time saved can be wiped 
                        away if you are, say, trying to ask an LLM to connect to a 3rd party API with the 
                        N/https module using data from a custom configuration record with the lowest 
                        possible Big-O Notation. Been there, done that.`
        },
        {
          title: "Ethical/Logical Concern 3: Retention of Information",
          description: `When I first started using SuiteScript professionally, I would often find myself 
                        trying to get ChatGPT to write everything for me. After several months of doing 
                        this, AI had really become a crutch to my entire style of coding and I was not 
                        retaining the information about SuiteScript that I had been trained on. After 
                        stepping back from using ChatGPT and now only using it for templates and boiler-plate, 
                        I have now been able to code much more efficiently and not lean on tools to code.`
        }
      ],
      finalThoughts: `AI has made some phenomenal strides in just the past year but must be used very 
                      carefully. While ChatGPT has shown to me that it can and will always get the right 
                      answer eventually, the time spent to finish a single client case will tend to be 
                      quite high on average as opposed to trusting your skills as a developer to get the 
                      answer yourself or reaching out to a coworker.`
    };
  }
}
</script>
  
  <style scoped>
  .blog-page {
    font-family: "Segoe UI", Arial, sans-serif;
    line-height: 1.6;
    color: #bf8cbe; /* Light-colored text for readability */
    background-color: #181825; /* Dark background */
    max-width: 800px; /* Constrain width */
    margin: 0 auto; /* Center the container */
    padding: 20px;
    border-radius: 8px;
  }
  
  h1,
  h2 {
    color: #dfa8cd; /* Light color for headers */
  }
  
  h1 {
    margin-bottom: 30px;
  }
  
  h2 {
    margin-bottom: 15px;
  }
  
  .introduction,
  .content,
  .conclusion {
    background-color: #362e5f; /* Dark purple background for sections */
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
  }
  .publication-date {
      font-size: 0.9em;
      color: #a8a8a8; /* Choose a suitable color */
      margin-bottom: 20px;
    }
  
  /* Additional styling and responsiveness can be added as needed */
  </style>
  
  