<template>
  <title>Games</title>
  <div class="game-page">
    <div class="game-card">
      <h2><router-link to="/games/match">Button Match</router-link></h2>
      <p>
        A fun and challenging matching game where you need to find matching
        buttons.
      </p>
    </div>
    <br /><br />
    <div class="game-card">
      <!-- <h2><router-link to="/games/battleship">BattleShip</router-link></h2> -->
      <h2 class="coming-soon">BattleShip (coming soon)</h2>
      <p>
        Take turns to outsmart your opponent by guessing the location of the
        enemy's fleet, aiming to be the first to sink all opposing ships.
      </p>
    </div>
    <br /><br />
    <div class="game-card">
      <h2><router-link to="/games/tic-tac-toe">Tic Tac Toe</router-link></h2>
      <p>
        Take turns to outsmart your opponent by guessing the location of the
        enemy's fleet, aiming to be the first to sink all opposing ships.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GamePage",
};
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column; /* Aligns children vertically */
  justify-content: center; /* Centers children vertically */
  align-items: center; /* Centers children horizontally */
  background-color: #181825;
  height: 60vh;
  padding: 20px; /* Adds some space between the cards */
}

.game-card {
  background-color: #362e5f;
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
  color: #181825;
}
.coming-soon h2 {
  color: #2d2d41;
}
.game-card p {
  color: #bfa8cd;
  margin-bottom: 10px;
}
</style>
