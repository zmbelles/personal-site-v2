<template>
    <div class="blog-page">
      <h1>{{ title }}</h1>
      <p class="publication-date">
        Published on: March 19, 2025 at 12:00pm CST
      </p>
      <div class="introduction" v-html="intro"></div>
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
    name: "RemoteWork",
    data() {
      return {
        title: "Remote Work: The Good, the Bad, and the Ugly",
        intro: `From the moment I stepped foot in the Software Engineering industry, I knew I wanted to work remotely. This luxury, 
                often challenged by recent 'return to office' pushes, was something I believed would make my job easier. However, 
                the reality has been a mixed bag. Today we'll explore the good, the bad, and the ugly of working entirely remotely.`,
        lessons: [
          {
            title: "Dispelling Myths About Remote Work",
            description: `Remote work is frequently stereotyped as being paid too much to do nothing. Some days I do feel like I have 
            very little to do, but those are also the days where I am scrolling through our code base or NetSuite instance to try and 
            find something I can enhance. Since the new year, however, days like these have not occurred. Recently, the company I am 
            working for has had a push from our parent company to overhaul our billing scripts and workflows for posting transaction 
            records and as such I have been completely swamped with work. There might be some people who are able to work from home 
            and do nothing, but that instance is far from the case with me. With remote work, for me at least, I follow all of the steps I 
            would take as if I were in the office. Showing up to meetings, scheduling meetings with team members, writing code, 
            testing code, sitting at my desk from 8 until 5 with an hour for lunch (never more, often less), along with all the other 
            general duties of a NetSuite administrator on top of that.`,
          },
          {
            title: "The Importance of Face-to-Face Interactions",
            description: `This is not to say that remote work is identical to office work, however, there are multiple differences that 
            I feel could be a detriment if they are not taken care of by the company. Of course, it is a lot easier to talk to someone 
            if you are in front of them and in person; there have been multiple studies done to corroborate that. From the time I am hired
             as a remote employee to the time I am first asked to come into office, I do feel like I am at a disadvantage to those who are 
             in person or hybrid because I do not have those face-to-face interactions with my colleagues that allow us to build the 
             rapport necessary to work at the highest level of cohesiveness. I always feel that once I have been into the office once, I am more comfortable about 
             reaching out to my colleagues than I was before. Just last week I flew into Denver to do some quarterly Program Increment (PI) 
             planning, and I am already feeling like I am much more comfortable reaching out to our VP’s and product owners now that I have 
             met and collaborated with them all in person.`,
          },
          {
            title: "Corporate Motives Behind 'Return to Office'",
            description: `I feel as though the push for in office from corporations is a thinly veiled threat disguised as concerns about 
            profit, productivity, and collaboration when in reality the reasons are purely rooted in leasing costs of office space and the 
            justification of middle managements existence (it’s hard to micromanage when there aren’t people right in front of you to 
            micromanage). Let me be clear, though, that I am not concerned with a return to office push for someone living 10 miles from the 
            office, I feel as though if you live close enough to commute, a business is justified in denying remote work. This is mainly for 
            those who were hired from a different state who are now being forced to relocate to now come into office; primarily FAANG Companies
            from what I have seen. The ability to work remotely from several states away and not have to worry about different costs of living 
            and uprooting your entire family has enabled companies to hire so many more qualified individuals that otherwise would not be able 
            to take the opportunity. Not to mention the ability to work from home allows those who live in rural Illinois like me to have the 
            same opportunities as those in a densely packed city like Denver.`,
          },
        ],
        finalThoughts: `Overall, if remote work is here to stay, it is up to the business and the individual to understand the need for 
        face-to-face communication and to allow that kind of thing on a quarterly, but no less than yearly, basis (travel and dining costs 
        re-imbursed or through per diem). As much as I love coming into office and understand how necessary it is to stay aligned with my 
        colleagues, I would never do it on my own dime. If you work from home, and the office is even a state away, I would highly recommend 
        asking your superiors about coming into office for a week one of these days to build that rapport and make it that much easier to 
        communicate with them, and keep your production levels high enough to keep allowing us this luxury.`,
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
  
  h1 {
    color: #dfa8cd;
    margin-bottom: 30px;
  }
  
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
  
  .publication-date {
    font-size: 0.9em;
    color: #a8a8a8;
    margin-bottom: 20px;
  }
  </style>
  