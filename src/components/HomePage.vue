<template>
  <title>Home</title>
  <div class="container">
    <div class="home-content">
      <div class="headshot-container">
        <img src="../assets/logo.png" alt="Headshot" class="headshot" />
      </div>
      <div class="info-container">
        <div class="info-section">
          <p class="info-label">Company:</p>
          <p class="info-value"><a class='links' href="http://www.solution-source.net/">Solution Source</a></p>
        </div>
        <div class="info-section">
          <p class="info-label">Alma Mater:</p>
          <p class="info-value"><a class='links' href="https://www.northcentralcollege.edu/">North Central College</a></p>
        </div>
      </div>
      <div class="bio-container">
        <p class="bio">
          I graduated with a Bachelors of Science in Computer Science from North
          Central College in May of 2023. I currently work as a NetSuite Solution
          Provider and Application Development Engineer at Solution Source in
          Goshen, Indiana. Check out my github down below or send me an email from my Contact Me page.
        </p>
      </div>
      <div class="languages-frameworks-container">
        <div class="languages">
          <p class="section-title">Top 3 Languages used</p>
          <ul class="language-list">
            <li>JavaScript</li>
            <li>SQL</li>
            <li>C#</li>
          </ul>
        </div>
        <div class="frameworks">
          <p class="section-title">Top 3 Frameworks used</p>
          <ul class="framework-list">
            <li><a class='links' href="https://vuejs.org">Vue</a></li>
            <li><a class='links' href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4260857223.html#SuiteScript-API">SuiteScript</a></li>
            <li><a class='links' href="https://jquery.org">jQuery</a></li>
          </ul>
        </div>
      </div>
      <h2 class="didyouknow">Did you know...</h2>
      <br>
      <div class="funFacts">
        <FunFacts />
      </div>
      <br><br><br>
    </div>
  </div>
</template>

<script>
import FunFacts from "@/components/FunFacts.vue";

export default {
  components: {
    FunFacts,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #181825;
}

.didyouknow {
  color: #ffffff;
}
.home-content {
  max-width: 650px;
  padding: 20px;
  background-color: #362E5F;
}

.headshot-container {
  text-align: center;
}

.headshot {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.info-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.info-section {
  margin-right: 20px;
  text-align: center;
}
.links:visited {
  color: #181825; 
}
.info-label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #ffffff;
}

.info-value {
  margin: 0;
  color: #000000;
}

.bio-container {
  display: flex;
  justify-content: center;
}

.bio {
  max-width: 600px;
  color: #ffffff;
  text-align: center;
}

.languages-frameworks-container {
  display: flex;
}

.languages,
.frameworks {
  flex: 1;
  background-color: #181825;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #000000;
}

.language-list,
.framework-list {
  padding-left: 0;
  margin: 0;
  color:#ffffff;
  list-style-type: none;
}

.language-list li,
.framework-list li {
  margin-bottom: 10px;
  background-color: inherit;
  color: #ffffff;
}

.info-value a {
  color: #9510D8;
}

.section-title {
  color: #9510D8;
}
</style>
