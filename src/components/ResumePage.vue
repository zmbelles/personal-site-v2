<template>
  <title>Resume</title>
  <div class="resume">
    <h2 class="section-title">Zachary Belles</h2>
    <div class="contact-info">
      <p>Yorkville, IL</p>
      <p>(630) 803-4911 &nbsp; &nbsp;</p>
      <p>Personal Email: <a href="mailto:zmbelles97@gmail.com">zmbelles97@gmail.com</a></p>
      <p>Work Email: <a href="mailto:zacharyb@solution-source.net">zacharyb@solution-source.net</a></p>
    </div>

    <h3 class="section-title">Career Objectives</h3>
    <div class="career-objective">
      <ol>
          <li>To ensure an environment in which the cultivation of talent and the needs of the client outweigh any underlying factors of the organization.</li>
          <li>To enrich my skills as a developer and pass the standards and expertise down to the next generation</li>
          <li>To work with a team of solution oriented individuals whose first priority is client satisfaction, not profit potential</li>
      </ol>
    </div>

    <h3 class="section-title">Core Competencies</h3>
    <ul class="competencies">
      <li>NetSuite ERP (SuiteCloud, SuiteCommerce, SuiteScript, SuiteAnalytics, SuiteFlow, SuiteQL)</li>
      <li>Object Oriented Software Design</li>
      <li>MERN Stack Development</li>
      <li>API Creation and Management</li>
    </ul>

    <h3 class="section-title">Projects</h3>
    <ul class="projects">
      <li>
        <strong>“CONNECT” THE SOCIAL MEDIA HUB</strong>
        <span class="tech-stack">(MongoDB, React, Next.js, Node.js, JavaScript)</span>
        <ul class="project-details">
          <li>Worked in a <b>Full Stack Agile development</b> environment utilizing <b>Trello</b> and <b>Slack</b> to maximize efficiency and effectively visualize our burndown.</li>
          <li>Applied both <b>CRUD</b> and <b>REST API</b> operations to Meta, Twitter, and Tiktok API’s.</li>
          <li>Used <b>Postman</b> to test API calls to our database and social media API’s.</li>
          <li>Securely stored data to custom <b>MongoDB</b> database, using <b>Amazon S3</b> as a <b>CDN</b> for images and videos.</li>
        </ul>
      </li>
      <li>
        <strong>GROCERY STORE DATABASE</strong>
        <span class="tech-stack">(MySQL, Java)</span>
        <ul class="project-details">
          <li>Worked with a team of my peers to create a database for a fake grocery store which included tables and foreign keys for</li>
          <ul>
            <li>Employees</li>
            <li>Inventory</li>
            <li>Vendors</li>
            <li>Customers</li>
            <li>Shipments</li>
            <li>Purchase Orders</li>
            <li>Equipment</li>
          </ul>
          <li>Allowed for table creation, legacy data implementation, and addition of new data and tables.</li>
          <li>Written in <b>Java</b> implementing <b>Connector/J</b> to link with <b>MySQL</b>.</li>
          <li>Created a database normalized to <b>3NF</b>.</li>
        </ul>
      </li>
      <li>
        <strong>DICTIONARY</strong>
        <span class="tech-stack">(Kotlin)</span>
        <ul class="project-details">
          <li>Utilized <b>Android Visual Studio</b> to implement Webster's API in a dictionary mobile app through <b>Database Access Objects</b>.</li>
          <li>Applied <b>RESTful</b> architecture for reliability and performance.</li>
          <li>Implemented through multiple pages through <b>Kotlin Fragments</b> and <b>NavigationViews</b>.</li>
          <li>Heavily stressed creating <b>Unit Tests</b> throughout to ensure data was being properly processed.</li>
        </ul>
      </li>
    </ul>

    <h3 class="section-title">Professional Experience</h3>
    <div class="experience">
      <div class="job">
        <h4 class="job-title">CODE FOR CHICAGO, Chicago, IL - Volunteer Developer, June 2022-August 2022</h4>
        <ul class="job-details">
          <li>Worked in a professional scrum team to write Code for Chicago’s new website.</li>
          <li>Wrote unit tests for each weekly sprint.</li>
          <li>Learned new skills such as <b>Gatsby, React, and npm</b>, utilized in a professional development environment.</li>
        </ul>
      </div>
      <div class="job">
        <h4 class="job-title">SOLUTION SOURCE, Goshen, IN - Application Development Engineer, May 2023-Present</h4>
        <ul class="job-details">
          <li>Provided Oracle NetSuite Solutions using <b>SuiteScript API, SuiteQL, and Vue.js.</b></li>
          <li>Conducted thorough code reviews with colleagues to ensure only the best written and documented code is deployed to the client account.</li>
          <li>Ensured 30 hours a week dedicated towards client-facing tasks and improvements.</li>
          <li>Helped the team bring in <b><u>$10,000</u></b> of development revenue per week in our “pod” of eight developers.</li>
          <li>Implemented and improved existing <b>SuiteCommerce</b> sites, leveraging <b>jQuery</b> and <b>Vue.js</b> to seamlessly interact with the <b>SuiteCloud</b> database using the SuiteScript API.</li>
        </ul>
        <p class="clarification">*Any work history prior/unrelated to Software Development is available upon request.</p>
        <p class="clarification">*References also available by filling out the form on my Contact Me page.</p>
      </div>
    </div>

    <h3 class="section-title">Education</h3>
    <div class="education">
      <h4>Bachelor of Science in Computer Science</h4>
      <p>NORTH CENTRAL COLLEGE, Naperville, IL</p>
      <p>May 2023</p>
    </div>

    <h3 class="section-title">Additional Skills & Accolades</h3>
    <ul class="skills">
      <li>Languages known (in order of proficiency): JavaScript, TypeScript, MySQL, OracleSQL, Java, C++, Python</li>
      <li>Frameworks known (in order of proficiency): jQuery, Vue, Next, MongoDB, React, Knockout</li>
      <li>Other knowns: SuiteScript, Postman, GraphQL, Amazon S3, Server Side Rendering</li>
      <li>Liaison to first generation Computer Science students</li>
      <li>Volunteer developer for Code for Chicago Summer 2022</li>
    </ul>
  </div>
</template>
  
  <script>
  export default {
    // Component logic goes here
  };
  </script>
  
  <style scoped>
  .resume {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f7f7;
    text-align: left;
  }
.contact-info {
  color: #333333;
    font-size: 24px;
    margin-bottom: 10px;
    text-align: left;
}
  .section-title {
    color: #333333;
    font-size: 24px;
    margin-bottom: 10px;
    text-align: left;
  }
  
  .contact-info {
    font-size: 16px;
    margin-bottom: 20px;
    color: #666666;
    text-align: left;
  }
  
  .career-objective {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333333;
    text-align: left;
  }
  
  .competencies {
    margin-bottom: 20px;
    list-style-type: disc;
    padding-left: 20px;
    color: #333333;
    text-align: left;
  }
  
  .projects {
    margin-bottom: 20px;
    list-style-type: none;
    padding-left: 0;
    text-align: left;
  }
  
  .project-details {
    margin-top: 10px;
    margin-bottom: 10px;
    list-style-type: disc;
    padding-left: 20px;
    color: #333333;
    text-align: left;
  }
  
  .experience {
    margin-bottom: 20px;
    text-align: left;
  }
  .clarification {
    color:rgb(0, 4, 255);
    font-family: inherit;

  }
  .job-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333333;
    text-align: left;
  }
  
  .job-details {
    margin-top: 10px;
    margin-bottom: 10px;
    list-style-type: disc;
    padding-left: 20px;
    color: #333333;
    text-align: left;
  }
  
  .education {
    margin-bottom: 20px;
    color: #333333;
    text-align: left;
  }
  
  .skills {
    margin-bottom: 20px;
    list-style-type: disc;
    padding-left: 20px;
    color: #333333;
    text-align: left;
  }
  </style>
  