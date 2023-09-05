<template>
  <title>Games</title>
    <div class="game-page">
      <div class="game-card">
        <h2><router-link to="/match">Button Match</router-link></h2>
        <p>A fun and challenging matching game where you need to find matching buttons.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GamePage',
  }
  </script>
  
  <style scoped>
  .game-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .game-card {
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    text-align: center;
    max-width: 400px;
    width: 100%;
  }
  
  .game-card h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .game-card p {
    color: #888;
    margin-bottom: 10px;
  }
  </style>
  