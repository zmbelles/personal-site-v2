<template>
    <div class="blog-page">
      <h1>Bottom of the Ninth</h1>
      <p class="publication-date">Published on: April 17, 2025</p>
  
      <div class="introduction">
        <p>
          Sometimes you have to think on your toes in regards to stressful situations. Bottom of the ninth, two outs, full count, bases loaded, and you’re at bat. That’s how it felt like with the days winding down to graduation. I had barely heard a peep from any of the places I applied to. Like some others, I had used an automation tool to speed up the rate at which I could apply for jobs. It had not been going well, however. Over 500 applications in with an interview request here and there, but nothing that lead to something substantial. Finally, came my interview for a small NetSuite consultancy named Solution Source. I had aced their preliminary screening and initial interview but bombed the technical interview with just a 20% test score. I was devastated, worrying I would not end up finding a job by the time I graduated. Luckily, however, Solution Source was a company that gave everyone a chance for an in person/on-site to go over your answers.
        </p>
      </div>
  
      <div class="content">
        <p>
          While my code had tested at 20%, I was very close on both problems. I will not be sharing what problems they were outside of this: The first question related to bank transactions that were out of order and sorting them based on various methods. The second question was about traversing Binary Search Trees. When I had gotten to Goshen, Indiana for my on-site interview, every big name person at the company was there in the conference room with me. The head of delivery, Software, Managed Services, HR, and one of the two partners in the company. Of course, the first ten multiple choice questions I aced no problem, and since they saw how close I was on the first problem, we moved on to the binary search tree.
        </p>
        <p>
          The one thing they were looking for on the Binary search tree was time to execute. My Binary Search tree was near perfect outside of one small issue: how long it took to finish. They were looking for a max of around 350 milliseconds from start to finish. Mine took 3.5 seconds. When telling them that I could not figure out the issue in the time allotted the partner in the company, Ryan, asked me ‘When executing your code, it managed to make over one million copies of a single variable, do you know why that was?’ It was that very second I realized I declared a variable inside the scope of the recursive function, and to which I almost immediately replied ‘Oh! Because JavaScript is pass by reference, I should have made the variable outside the scope of the recursive function and reused it.’ ‘Bingo.’ He replied. After that the interview was just about wrapped up and I had my offer letter in hand not a week later.
        </p>
      </div>
  
      <div class="conclusion">
        <p>
          So why tell this story? ‘Surely,’ you think to yourself, ‘Zach couldn’t possibly post this just to brag.’ and you would be right. The point is to never give up. With a 20% on a technical interview, I thought there was no way I could ever get the position; yet I persisted. I studied the code I had built, learned the ins and outs of binary search trees and Object sorting, and when it came down to the one question on references in JavaScript, I knew exactly how to respond. It’s a hard market, but sometimes the most difficult path, ends with a simple answer.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BottomOfTheNinthPost",
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
  