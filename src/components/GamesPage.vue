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
      <h2>
        <router-link to="/games/tic-tac-toe">Hyper Tic-Tac-Toe</router-link>
      </h2>
      <p>
        Challenge the computer to a 9x9 game of Tic-Tac-Toe. More Strategy than
        it seems!
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
  </div>
</template>

<script>
export default {
  name: "GamePage",
  metaInfo: {
    title: "Exciting Online Games - Play Now",
    meta: [
      {
        name: "description",
        content:
          "Discover a variety of fun and challenging online games including Button Match, Hyper Tic-Tac-Toe, and Battleship. Play now and enjoy endless entertainment!",
      },
      { property: "og:title", content: "Exciting Online Games - Play Now" },
      {
        property: "og:description",
        content:
          "A collection of engaging and challenging online games including Button Match, Hyper Tic-Tac-Toe, and Battleship.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.yourwebsite.com/games" },
      {
        property: "og:image",
        content: "https://www.yourwebsite.com/images/games-thumbnail.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Exciting Online Games - Play Now" },
      {
        name: "twitter:description",
        content:
          "Discover and play a variety of online games on our website. Join the fun now!",
      },
      {
        name: "twitter:image",
        content: "https://www.yourwebsite.com/images/games-thumbnail.jpg",
      },
    ],
  },
};
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column; /* Aligns children vertically */
  justify-content: center; /* Centers children vertically */
  align-items: center; /* Centers children horizontally */
  background-color: #181825;
  height: 56vh;
  padding: 20px; /* Adds some space between the cards */
}

.game-card {
  background-color: #362e5f;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  text-align: center;
  max-width: 40vh;
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
