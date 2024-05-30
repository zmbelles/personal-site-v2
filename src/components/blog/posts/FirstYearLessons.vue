<template>
  <div class="blog-page">
    <h1>{{ title }}</h1>
    <p class="publication-date">Published on: May 30, 2024 at 7:00am CST</p>
    <div class="introduction">
      <p>{{ intro }}</p>
    </div>
    <div class="content">
      <section v-for="(lesson, index) in lessons" :key="index">
        <h2>{{ lesson.title }}</h2>
        <p>{{ lesson.description }}</p>
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
      title: "What I’ve Learned in my First Year as a Professional Developer",
      intro: `It's officially been a year since I started my professional development journey. I graduated with my BS in
      Computer Science from North Central College in May of last year and after a quick trip to florida with my girlfriend,
      I was on my way to Goshen, Indiana for my training. Here are my main takeaways after this wonderful ride of a first year.`,
      lessons: [
        {
          title: "You’re Going to Make Mistakes",
          description: `Every aspiring programmer has felt the countless hours staring at a bug wondering why it 
          won’t do what you need it to do. Often times I lament at the fact that computers only do what you tell them to do, 
          not what you want them to do. First starting off in professional development, especially working with such a 
          robust Enterprise Resource Planning (ERP) software such as NetSuite, you’re going to make mistakes. 
          A lot of them, actually. Naturally, accidentally uploading untested code to a clients live production account is 
          never a situation anyone wants to deal with it is a thing that can happen, and did happen once or 
          twice to me. The key takeaway from when things go wrong is being able to consciously look back 
          to understand and learn from your mistake. Was a rollout note forgotten so a field wasn’t uploaded? 
          Was a coworker working in the same file as me? Did I not compare to the production account to make sure only my 
          changes were uploaded? Once you find the reason for the mistake you must make a concious effort to ensure that
           mistake will not happen again. Once is understandable, twice is a pattern.`
        },
        {
          title: "Work-Life Balance is a Give and Take",
          description: `At Solution Source, I sometimes am required to work after hours to upload code into a clients account. 
          This is understandable as our clients do not want to see changes to their process in the middle of the work day. 
          In the same vane, some days I may have to leave a little early due to an appointment which is also understandable 
          and allowed, understanding this give and take is important. If you want the company to invest in you, you have to 
          invest yourself in the company. There could also be work adjacent tasks, such as studying and training for 
          certificates that will stick with you throughout your professional career, that you may need to work on after your 
          average 9-5 work hours.`
        },
        {
          title: "It's Not All About the Money",
          description: `I’ve said long before I graduated with my B.S in Computer Science that I will never work for a FAANG 
          company because while I’d be making well over $100,000 a year before bonus and stock options, they will make you work 
          for every penny. As someone who experienced burnout my first time through college as an Instrumental Music Education 
          major, that is something I would like to distance myself from as much as humanly possible. I still make more than 
          enough to get by at Solution Source and it is a place where I feel happy to log onto work every day knowing that my 
          voice is heard when there is an issue, and I am surrounded by some very intelligent peers who I can go to if I ever 
          feel overwhelmed. While it may be everyones first choice to go with the offer that has the highest base pay there must 
          be ample consideration given to work-life balance, bonus potential, and of course programming languages used. If you 
          hate JavaScript, don’t put yourself into a position where you have to use it every day for the foreseeable future just 
          because it pays the most.`
        }
      ],
      finalThoughts: `After my first year the biggest takeaway that I have is that I still have so much to learn and I am thankful for all
      of the opportunities I have been given so far by Solution Source. From the projects I have been able to will to life, to the community 
      contributions Solution Source has given on my behalf to my favorite non-profits. I will continue to keep an open mind to anything
      and everything that comes my way in my next year of professional development. Next up for me is co-authoring a large project with
      one of my coworkers and studying for my SuiteFoundations certificate.`
    };
  }
}
</script>

<style scoped>
.blog-page {
  font-family: "Segoe UI", Arial, sans-serif;
  line-height: 1.6;
  color: #ffffff;
  /* Light-colored text for readability */
  background-color: #181825;
  /* Dark background */
  max-width: 800px;
  /* Constrain width */
  margin: 0 auto;
  /* Center the container */
  padding: 20px;
  border-radius: 8px;
}

h1 {
  color: #dfa8cd;
  /* Light color for headers */
  margin-bottom: 30px;
}

h2 {
  color: #dfa8cd;
  /* Light color for headers */
  margin-bottom: 15px;
}

.introduction,
.content,
.conclusion {
  background-color: #362e5f;
  /* Dark purple background for sections */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.publication-date {
  font-size: 0.9em;
  color: #a8a8a8;
  /* Choose a suitable color */
  margin-bottom: 20px;
}
</style>