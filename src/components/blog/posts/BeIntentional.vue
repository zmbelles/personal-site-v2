<template>
  <div class="blog-page">
    <h1>{{ title }}</h1>
    <p class="publication-date">
      Published on: September 24, 2024 at 9:00am CST
    </p>
    <div class="introduction">
      <p>{{ preamble }}</p>
    </div>
    <div class="content">
      <section>
        <h2>{{ section1.title }}</h2>
        <p>{{ section1.body1 }}</p>
        <ul class="issues">
          <li v-for="(item, index) in section1.issues" :key="index">
            {{ item }}
          </li>
        </ul>
        <p>{{ section1.body2 }}</p>
      </section>
      <section>
        <h2>{{ section2.title }}</h2>
        <ol class="numbered-list">
            <li v-for="(tip, index) in section2.tips" :key="index">
            <strong>{{ tip.title }}</strong>
            <p>{{ tip.description }}</p>
						<p class="example" v-if="tip.example">{{ tip.example }}</p>
            </li>
        </ol>
      </section>
    </div>
    <div class="conclusion">
      <h2>{{ conclusion.title }}</h2>
      <p>{{ conclusion.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogPostIntentional",
  data() {
    return {
      title: "Be Intentional",
      preamble: `Coming from a small liberal arts school, I have seen my fair share of poorly written code from my years in college. 
                  However, no amount of code hastily written hours before the assignment is due could have prepared me for the Software 
                  Development war crimes I have come to find.`,
      section1: {
        title: "Intentional Programming",
        body1: `Be it NetSuite, Salesforce, or any other SaaS application, the main glaring issue that keeps seeming to crop up is a lack 
                  of intentionality. When you write code for software, I implore you to always be intentional with what you write. What might 
                  I mean by this? To be intentional would be to follow the standards of software development in a post-AI boom world. 
                  Here is a brief run down of some of the things I have found in production environments that I would classify as unintentional programming:`,
        issues: [
          "Unencrypted API keys inside codebase",
          "Triple nested for loops",
          "Comments that clearly indicate the use of ChatGPT (e.g., //Please make sure to replace this with the actual name of your file)",
          "Large hunks of commented-out code despite using source control to track changes",
          "5 different file naming conventions",
          "Minimal commenting",
          "Record deletion scripts that pull data from a static CSV of record ID’s",
          "Minimal null checking",
          "Auto-generated IDs",
        ],
        body2: `I beseech you to always be intentional with your Software Development because when you are not, these vulnerabilities 
                  materialize quite expeditiously.`,
      },
      section2: {
        title: "2024 Tips for Software Developers",
        tips: [
          {
            title: "Be intentional with your programming.",
            description: `Software development isn’t something you do for the pay; the pay comes from the skill and intentionality 
                            of the services you provide; good developers are paid well because they’re good. You should program because 
                            you have a passion for computers and development, not because you want a nice paycheck. If it is something you do because you love it, you should also 
                            always put your best foot forward when designing or maintaining a system.`,
          },
          {
            title: "The documentation is (almost) always right.",
            description: `I have only once or twice seen NetSuite’s own documentation wrong about something. When you start digging 
                            into 3rd-party APIs, especially startups, the documentation is often less reliable*. If either you do not know 
                            something, or the documentation isn’t very helpful, reach out to the developers.`,
						example: `*I cannot stress enough how helpful it can be to reach out to 3rd party API developers. For instance, one 3rd party API startup I 
						was using while working with a former employer had some wrong documentation. After reaching out to them, they were able to show me the proper 
						methods and syntax and update their documentation. In another instance, they even created a new endpoint to connect to that did exactly what we needed.`
          },
          {
            title: "Understand the client's needs and ask the why.",
            description: `I have even fallen victim to this in the past and written sub-optimal code because either I didn’t fully grasp what the clients need was, 
						or I had failed to ask what the purpose of the code change was for. I will fully credit Solution Source for giving me this line of logic as it has 
						become one of my strongest assets like it is one of theirs. By digging deep into what the pain point of the client truly is you can cater a solution 
						directly to it. This also prevents code being written that is never actually needed because it doesn't solve the actual problem the client has and 
						ultimately leads to a more positive client experience.`,
          },
        ],
      },
      conclusion: {
        title: "Final Word",
        text: `These are my major tips for 2024 and I hope you can look at these recommendations and reflect on how you can 
                 incorporate them into how you develop. Every day I am thankful for the new opportinities I am given to both
								 write code that I am proud of, and improve upon legacy code that does not meet the current standards.
								 Please reach out to me on LinkedIn if you would like to discuss this further; I am always open to collaboration.`,
      },
    };
  },
};
</script>

<style scoped>
.blog-page {
  font-family: "Segoe UI", Arial, sans-serif;
  line-height: 1.6;
  color: #ffffff;
  background-color: #181825;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
}
h1,
h2 {
  color: #dfa8cd;
  margin-bottom: 15px;
}

.introduction,
.content,
.conclusion {
  background-color: #362e5f;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}
.issues {
    text-align: left;
}
ul {
  margin-left: 20px;
  list-style-type: disc;
}

.publication-date {
  font-size: 0.9em;
  color: #a8a8a8;
  margin-bottom: 20px;
}
.numbered-list {
  list-style-type: decimal; /* Use decimal numbers */
  padding-left: 20px; /* Adjust padding for proper alignment */
  margin: 0;
	text-align: left;
}

.numbered-list li {
  margin-bottom: 15px; /* Space between list items */
	text-align: left;
}

.numbered-list li p {
  margin: 5px 0 0 20px; /* Indent the paragraph under each list item */
	text-align: left;
}
.example {
	padding-left: 1cm;
	font-size: smaller;
	font-weight: bold;
}
</style>
