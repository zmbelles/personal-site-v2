<template>
  <div class="blog-page">
    <h1>{{ title }}</h1>
    <p class="publication-date">
      Published on: December 06, 2024 at 9:00am CST
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
  name: "BlogPost",
  data() {
    return {
      title: "Find a Niche and Fill It",
      intro: `As many of us know, the job market for Computer Science graduates has all but collapsed. There has always been the running joke of 
      seeing job ads titled 'entry level' yet the requirements are several years of professional development experience, but this joke is no 
      longer funny for those struggling to find a job in this post-tech boom world. According to 
      <a href="https://layoffs.fyi" target="_blank">layoffs.fyi</a>, 160,000 tech workers were laid off in 2022, 264,000 in 2023, and another
      149,000 this year so far. This is causing the job market to be flooded with many mid to senior level developers who are willing to work the 
      entry level jobs for the same pay, leaving recent graduates high and dry. When I was applying for jobs for my 2023 graduation, I put out no 
      fewer than 200 applications. Of these, I received 31 first round interviews, 6 second round interviews, and a total of two offers; and this 
      was almost two years ago. The job I ended up taking was for far less than I was expecting and told I could make even with the ink on my B.S 
      still drying. I did not see this as an issue, however, and I wouldn’t trade my first professional software development experience for anything. 
      If I could describe in one word the thing that helped my career the most at my first job it would be ‘niche’.`,
      lessons: [
        {
          title: "Understanding the Current Job Market",
          description: `The influx of layoffs and market oversaturation has led to a challenging environment for recent graduates. Many are competing 
          with experienced developers for the same entry-level roles. The joke about 'entry-level' jobs asking for years of experience has stopped 
          being funny—it's the new normal. This is because of all of the senior developers who have been laid off that are now vying for the same jobs
          as you. They have those 5 years of experience you are missing and are willing to take the entry level pay so they can keep their foot in the door.
          Because of this, navigating the saturated computer science landscape requires a different approach.`,
        },
        {
          title: "Niche Specialization",
          description: `By finding a niche, you set yourself apart from the flood of generalists. I discovered my niche in the world of Enterprise 
          Resource Planning (ERP) systems, specifically NetSuite, after already realizing I wanted to work on backend development. Before then, I 
          was just another candidate who had done hundreds of hours of leet code questions. After focusing on a niche, I became one of 
          only a thousand or so experienced NetSuite developers in the country. This kind of specialization helps you stand out from the crowd and 
          become invaluable in a specific domain.`,
        },
        {
          title: "Choosing the Right Path",
          description: `A good friend of mine who will be graduating in May 2025 has managed to secure a job specializing in Machine Learning, the most 
          popular niche as of late, but that too has been starting to become oversaturated. Would I say that he and I got lucky? No, of course not. Luck 
          may have been a portion of it, but luck will only get you as far as an interview. You need to be able to prove your worth in technical interviews as well. 
          Instead of jumping on the bandwagon of every popular tool, do research on what is actually in demand. You may find that MySQL or PostgreSQL 
          expertise is more valued than learning yet another Javascript Framework in MongoDB. Likewise, focus on what you enjoy—if frontend design or 
          UI/UX isn't your thing, don't force it. Align your niche with your interests and market needs.`,
        },
      ],
      finalThoughts: `Of all the things I have mentioned, the most crucial piece of advice is to start early. Explore job boards, send out countless applications, 
      and pay attention to where the demand truly is. Don't be afraid to reach out to hiring managers and recruiters on linkedin for jobs you apply for.
      Find your niche before the ink on your degree dries, or pivot to one as soon as you can. By doing so, you won't just land a job—you’ll carve out a meaningful,
      sustainable path in the industry.`,
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
