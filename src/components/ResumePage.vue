<template>
  <title>Resume</title>
  <div class="resume-container">
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
        <li>Database Management (SQL and NoSQL)</li>
        <li>MERN Stack Development</li>
        <li>API Creation and Management</li>
      </ul>

      <h3 class="section-title">Projects</h3>
      <ul class="projects">
        <li>
          <strong>DDS SFTP INTEGRATION FOR PIM DATA</strong>
          <span class="tech-stack"> (JavaScript)</span>
          <ul class="project-details">
            <li>Created GET and POST scripts to handle SFTP requests for PIM Data to a Data Distribution Service (DDS) Server.</li>
            <ul>
              <li>Developed a reusable class for <b>SFTP</b> connection in <b>NetSuite</b>, one of the leading ERP providers in the world.</li>
              <li>Conceived a script to send POST request to DDS server with Item Data CSV parsed from a <b>NetSuite Saved Search</b>.</li>
              <li>Designed a script which downloads files from SFTP site and updates item fields in NetSuite.</li>
              <li>Assisted with design of front end for <b>SuiteCommerce</b> website when needed.</li>
              <li>Successfully worked in a duo to provide <b>$40,000</b> in development revenue for the company.</li>
            </ul>
          </ul>
        </li>
        <li>
          <strong>OPTIMIZED DELIVERY ROUTE SOLUTION</strong>
          <span class="tech-stack"> (Vue.js, JavaScript, OracleSQL, NextBillionAPI)</span>
          <ul class="project-details">
            <li>Developed an application to extend <i>Solution Source's</i> IP utilizing <b>Vue.js</b> and <b>JavaScript</b> inside a <b>NetSuite SuiteApp </b>that allows users to select sales orders that need to be delivered (called delivery Tickets), and recieve the most optimized route to take to deliver them.</li>
            <ul>
              <li>Allowed end user to select multiple delivery tickets from NetSuite, select all, and filter by route, truck, or location.</li>
              <li>Uses <b>JavaScript Promises</b> with the problem object to wait for the solution from <b>NextBillion.</b></li>
              <li>Created custom records for the Optimization solution, the trip, and each stop in NetSuite.</li>
              <li>Allows users to select tickets to not include in the optimization and be forcefully delivered first</li>
              <li>Added a feature to highlight all deliveries on the optimized route and gives a list of delivery locations, and the time to get there.</li>
              <li>Allows users to save the route they created to custom trip and stop records in NetSuite</li>
              <li>Added a custom plugin type which allows each client to implement their own logic for what happens when the trip and stops are saved to NetSuite</li>
              <li>Highlights map markers pre-optimization if those tickets already exist on a trip record.</li>
              <li>Allows users to manually add their own delivery tickets to the list by entering its ID</li>
              <li>Provides <b>$6,500</b> per year per client in recurring revenue for the company.</li>
              <li>Examples of application before and after optimization can be found below.</li>
            </ul>
          </ul>
          <div class="image-container">
            <img src="../assets/pre-optimized.png" alt="Picture of NetSuite customization for finding optimal delivery route prior to opimizing and selecting tickets" class="example-image">
          </div>
          <br><br>
          <div class="image-container">
            <img src="../assets/optimized.png" alt="Picture of NetSuite customization for finding optimal delivery route after opimizing and selecting tickets" class="example-image">
          </div>  
        </li>
        <li>
          <strong>DICTIONARY</strong>
          <span class="tech-stack"> (Kotlin)</span>
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
            <li>In collaboration with our exceptional team of eight developers, I played a pivotal role in orchestrating the generation of a substantial <b><u>$12,000</u></b> in development revenue per week within our pod.</li>
            <li>Implemented and improved existing <b>SuiteCommerce</b> sites, leveraging <b>jQuery</b> and <b>Vue.js</b> to seamlessly interact with the <b>SuiteCloud</b> database using the SuiteScript API.</li>
          </ul>
          <p class="clarification"><b>*Any work history prior/unrelated to Software Development is available upon request.</b></p>
          <p class="clarification"><b>*References also available by filling out the form on my Contact Me page.</b></p>
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
  </div>
</template>
  
  <script>
  export default {
    // Component logic goes here
  };
  </script>
  
  <style scoped>

.resume-container {
  background-color: #181825;
  padding: 0;
}
.resume {
  font-family: Arial, sans-serif;
  max-width: 50%;
  margin: 0 auto;
  padding: 20px;
  background-color: #362E5F;
  text-align: left;
}
.contact-info {
  color: white;
    font-size: 24px;
    margin-bottom: 10px;
    text-align: left;
}
  .section-title {
    color: white;
    font-size: 24px;
    margin-bottom: 10px;
    text-align: left;
  }
  
  .contact-info {
    font-size: 16px;
    margin-bottom: 20px;
    color: white;
    text-align: left;
  }
  
  .career-objective {
    font-size: 18px;
    margin-bottom: 20px;
    color: white;
    text-align: left;
  }
  
  .competencies {
    margin-bottom: 20px;
    list-style-type: disc;
    padding-left: 20px;
    color: white;
    text-align: left;
  }
  
  .projects {
    margin-bottom: 20px;
    list-style-type: none;
    color: white;
    padding-left: 0;
    text-align: left;
  }
  
  .project-details {
    margin-top: 10px;
    margin-bottom: 10px;
    list-style-type: disc;
    padding-left: 20px;
    color: white;
    text-align: left;
  }
  
  .experience {
    margin-bottom: 20px;
    text-align: left;
  }
  .clarification {
    color:#9510d8;

  }
  .job-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: white;
    text-align: left;
  }
  
  .job-details {
    margin-top: 10px;
    margin-bottom: 10px;
    list-style-type: disc;
    padding-left: 20px;
    color: white;
    text-align: left;
  }
  
  .education {
    margin-bottom: 20px;
    color: white;
    text-align: left;
  }
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .example-image {
    max-width: 100%;   /* Adjust as per your requirements */
    margin: 0 2.5%; 
      /* Spacing between the images */
    height: auto;     /* Keep aspect ratio */
    border: 1px solid #ddd;   /* Optional border */
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);   /* Optional shadow for aesthetics */
  }
  
  .skills {
    margin-bottom: 20px;
    list-style-type: disc;
    padding-left: 20px;
    color: white;
    text-align: left;
  }
  </style>
  