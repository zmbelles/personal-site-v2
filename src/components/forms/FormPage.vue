<template>
    <div class="form-page">
      <div class="form-entry">
        <h2 class="form-entry-title" :disabled="true">
          <router-link to="/forms/sales-order" class="entry-link">
            Sales Order (coming soon)
          </router-link>
        </h2>
        <p class="form-entry-body">
          Completely open source template for your company's sales orders. Also Accepts JSON.
        </p>
      </div>
      <div class="form-entry">
        <h2 class="form-entry-title" :disabled="true">
          <router-link to="/forms/invoice" class="entry-link">
            Invoice (coming soon)
          </router-link>
        </h2>
        <p class="form-entry-body">
          Completely open source template for your company's invoices. Also Accepts JSON.
        </p>
      </div>
      <!-- Add more form entrys here -->
    </div>
  </template>
  
  <script>
  export default {
    name: "formPage",
    // Your script here
  };
  </script>
  
  <style scoped>
  .form-page {
    display: flex;
    flex-direction: column; /* Aligns children vertically */
    justify-content: center; /* Centers children vertically */
    align-items: center; /* Centers children horizontally */
    background-color: #181825;
    padding: 20px; /* Adds some space between the cards */
  }
  
  .form-entry {
    background-color: #362e5f;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    text-align: center;
    max-width: 400px;
    width: 100%;
    margin-bottom: 20px; /* Spacing between cards */
  }
  
  .form-entry-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #dfa8cd;
  }
  
  .form-entry-body {
    color: #bfa8cd;
    margin-bottom: 10px;
    line-height: 1.6;
  }
  
  .entry-link {
    text-decoration: none;
    color: #9510d8;
    cursor: pointer;
  }
  
  .entry-link:hover {
    text-decoration: underline;
  }
  </style>
  