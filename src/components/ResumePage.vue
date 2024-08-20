<template>
  <title>Resume</title>
  <div class="resume-container">
    <div class="resume">
      <h2 class="section-title">Zachary M. Belles</h2>
      <div class="contact-info">
        <p>Yorkville, IL</p>
        <p>Phone: <b>Available upon request</b> &nbsp; &nbsp;</p>
        <p>
          Personal Email:
          <a href="mailto:zmbelles97@gmail.com">zmbelles97@gmail.com</a>
        </p>
        <p>
          Work Email: <b>Available upon approved request through Procare Solutions</b>
        </p>
      </div>

      <h3 class="section-title">Education</h3>
      <div class="education">
        <h4>Bachelor of Science in Computer Science</h4>
        <p>NORTH CENTRAL COLLEGE, Naperville, IL</p>
        <p>September 2020 — May 2023</p>
      </div>

      <h3 class="section-title">Professional Experience</h3>
      <div class="experience">
        <div class="job">
          <h4 class="job-title">
            PROCARE SOLUTIONS - NetSuite Developer, August 2024 — Present
          </h4>
          <ul class="job-details">
            <li>
              Serve as the primary point of contact for NetSuite development,
              configuration, and user support.
            </li>
            <li>
              Develop and maintain NetSuite customizations using SuiteScript,
              SuiteAnalytics, SuiteTalk, and other SuiteCloud platforms.
            </li>
            <li>
              Manage configuration changes to fields, workflows,
              roles/permissions, page layouts, custom objects, and custom record
              types.
            </li>
            <li>
              Assist in the optimization of O2C and P2P to process over $1
              Billion in monthly sales.
            </li>
            <li>
              Actively seek out ways to improve the NetSuite environment by
              scrapping the existing codebase for suboptimal code.
            </li>
            <li>
              Perform NetSuite upgrades and deployments, and integrate
              third-party applications as needed.
            </li>
            <li>
              Provide ongoing support for break-fix and optimization issues
              during production.
            </li>
            <li>
              Assist with implementation and maintain integrations with 3rd
              party applications such as: Salesforce, Boomi, Avalara, and AWS.
            </li>
          </ul>
        </div>
        <div class="job">
          <h4 class="job-title">
            SOLUTION SOURCE - Application Development Engineer, May 2023 —
            August 2024
          </h4>
          <ul class="job-details">
            <li>
              Provided Oracle NetSuite Solutions using SuiteScript API, SQL,
              jQuery, and Vue.js.
            </li>
            <li>
              Conducted thorough code reviews with colleagues to ensure only the
              best written and documented code is deployed to the client
              production account.
            </li>
            <li>
              Ensured ≥30 hours a week dedicated towards billable client-facing
              tasks and improvements.
            </li>
            <li>
              Brought in $15,000 of development revenue per week in our “pod” of
              developers.
            </li>
            <li>
              Worked on projects ranging from 20 hours to 700 hours of developer
              work.
            </li>
            <li>
              Performed CRUD operations on NetSuite Database tables using
              records, queries, and HTTP protocols.
            </li>
            <li>
              Assisted in the creation of new products using SuiteScript to
              expand company IP.
            </li>
          </ul>
        </div>
        <p class="clarification">
          <i
            ><b
              >*Any work history prior/unrelated to Software Development is
              available upon request.</b
            ></i
          >
        </p>
        <p class="clarification">
          <i
            ><b
              >*References also available by filling out the form on my Contact
              Me page.</b
            ></i
          >
        </p>
      </div>

      <h3 class="section-title">Skills</h3>
      <ul class="skills">
        <li>
          Languages: JavaScript, HTML/CSS, TypeScript, SQL (SuiteQL, PostgreSQL,
          MySQL, OracleSQL), Java
        </li>
        <li>
          Libraries and Frameworks: Vue.js, Next.js, MongoDB, jQuery, Axios,
          Knockout.js
        </li>
        <li>
          Developer Tools and Platforms: SuiteScript, SuiteCommerce, SuiteTalk,
          Git, Postman, Shell, VSCode
        </li>
        <li>
          3rd Party Integrations: AWS, Boomi, TrackAbout, Magento, UPS
          Worldship, NextBillion, SalesForce
        </li>
      </ul>

      <h3 class="section-title">Projects</h3>
      <ul class="projects">
        <li>
          <strong>VENDOR FEEDBACK APP</strong>
          <span class="tech-stack"> (SuiteScript, jQuery, HTML/CSS, SQL)</span>
          <ul class="project-details">
            <li>
              Developed a mobile application to allow employees of milling
              companies to enter information about the quality of goods they are
              machining.
            </li>
          </ul>
        </li>
        <li>
          <strong>DDS SFTP INTEGRATION FOR PIM DATA</strong>
          <span class="tech-stack"> (SuiteScript, Axios, jQuery, SQL)</span>
          <ul class="project-details">
            <li>
              Designed and implemented GET/POST scripts for SFTP data transfer
              and a reusable SFTP connection class in NetSuite, along with
              scripts for processing and updating item data from a Data
              Distribution System (DDS) server, contributing to $40,000 in
              development revenue.
            </li>
            <li>
              Additionally assisted in SuiteCommerce website front-end design.
            </li>
          </ul>
        </li>
        <li>
          <strong>OPTIMIZED DELIVERY ROUTING SOLUTION</strong>
          <span class="tech-stack"> (SuiteScript, Vue.js, HTML/CSS, SQL)</span>
          <ul class="project-details">
            <li>
              Lead developer for a Vue.js-based NetSuite SuiteApp for Solution
              Source, enabling users to select and optimize delivery routes,
              manage custom records, and directly communicate with TrackAbout.
            </li>
            <li>
              Resulted in $30,000 in implementation costs to client and an
              additional $15,000 per year per client in recurring revenue.
            </li>
          </ul>
          <div class="image-container">
            <img
              src="../assets/pre-optimized.png"
              alt="Picture of NetSuite customization for finding optimal delivery route prior to opimizing and selecting tickets"
              class="example-image"
            />
          </div>
          <br /><br />
          <div class="image-container">
            <img
              src="../assets/optimized.png"
              alt="Picture of NetSuite customization for finding optimal delivery route after opimizing and selecting tickets"
              class="example-image"
            />
          </div>
        </li>
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

a {
  color: #B39DDB; /* Gold color, adjust as needed */
  text-decoration: none; /* Remove underline */
}

a:hover {
  color: #B39DDB; /* Change color on hover, adjust as needed */
  text-decoration: underline; /* Optionally add underline on hover */
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
.resume-container {
  background-color: #181825;
  padding: 0;
}
.resume {
  font-family: Arial, sans-serif;
  max-width: 50%;
  margin: 0 auto;
  padding: 20px;
  color: #E0E0E0;
  background-color: #362e5f;
  text-align: left;
}
.contact-info {
  color: #E0E0E0;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: left;
}
.section-title {
  color: #E0E0E0;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: left;
}
.contact-info {
  font-size: 16px;
  margin-bottom: 20px;
  color: #E0E0E0;
  text-align: left;
}
.education {
  margin-bottom: 20px;
  color: #E0E0E0;
  text-align: left;
}
.experience {
  margin-bottom: 20px;
  text-align: left;
}
.clarification {
  color: #ffffff;
}
.job-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #E0E0E0;
  text-align: left;
}
.job-details {
  margin-top: 10px;
  margin-bottom: 10px;
  list-style-type: disc;
  padding-left: 20px;
  color: #E0E0E0;
  text-align: left;
}
.skills {
  margin-bottom: 20px;
  list-style-type: disc;
  padding-left: 20px;
  color: #E0E0E0;
  text-align: left;
}
.projects {
  margin-bottom: 20px;
  list-style-type: none;
  color: #E0E0E0;
  padding-left: 0;
  text-align: left;
}
.project-details {
  margin-top: 10px;
  margin-bottom: 10px;
  list-style-type: disc;
  padding-left: 20px;
  color: #E0E0E0;
  text-align: left;
}
</style>
