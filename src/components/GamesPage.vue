<template>
  <div class="games">
    <header class="container page-hero">
      <p class="eyebrow">Games</p>
      <h1>Small games, built for fun</h1>
      <p>A couple of browser games written in Vue. No download, no sign-up.</p>
    </header>

    <div class="container grid">
      <router-link to="/games/tic-tac-toe" class="card card--link game">
        <div class="game-art art-ttt" aria-hidden="true">
          <span v-for="n in 9" :key="n" :class="['cell', { x: [1, 5, 9].includes(n), o: [3, 7].includes(n) }]"></span>
        </div>
        <h2>Hyper Tic-Tac-Toe</h2>
        <p>Challenge the computer to a 9x9 game of tic-tac-toe. More strategy than it seems.</p>
        <span class="arrow-link">Play</span>
      </router-link>

      <router-link to="/games/match" class="card card--link game">
        <div class="game-art art-match" aria-hidden="true">
          <span v-for="n in 8" :key="n" :class="['tile', { lit: n === 2 || n === 7 }]"></span>
        </div>
        <h2>Button Match</h2>
        <p>A fun, challenging matching game where you hunt down the matching buttons.</p>
        <span class="arrow-link">Play</span>
      </router-link>

      <div class="card game game--soon" aria-disabled="true">
        <div class="game-art art-ship" aria-hidden="true">
          <span v-for="n in 16" :key="n" :class="['sea', { hit: n === 6 || n === 7, miss: n === 12 }]"></span>
        </div>
        <h2>Battleship <span class="badge">Coming soon</span></h2>
        <p>Take turns guessing where the enemy fleet is hiding, and be the first to sink every ship.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GamePage",
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding-bottom: clamp(64px, 10vw, 112px);
}

.game {
  display: flex;
  flex-direction: column;
}

.game h2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0 8px;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text);
}

.game p {
  margin: 0 0 20px;
  color: var(--text-muted);
}

.game--soon {
  opacity: 0.7;
}

.game-art {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  border: 1px solid var(--border);
  aspect-ratio: 16 / 10;
  align-content: center;
  justify-content: center;
}

.art-ttt {
  grid-template-columns: repeat(3, 34px);
}

.cell {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  background: var(--surface-2);
}

.cell.x::before,
.cell.x::after {
  content: "";
  position: absolute;
  inset: 16px 7px;
  border-radius: 2px;
  background: var(--pink);
  transform: rotate(45deg);
}

.cell.x::after {
  transform: rotate(-45deg);
}

.cell.o::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  border: 2px solid var(--accent);
}

.art-match {
  grid-template-columns: repeat(4, 40px);
}

.tile {
  height: 40px;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
}

.tile.lit {
  background: var(--gradient);
  border-color: transparent;
}

.art-ship {
  grid-template-columns: repeat(4, 30px);
  gap: 4px;
}

.sea {
  height: 30px;
  border-radius: 4px;
  background: rgba(116, 103, 176, 0.25);
}

.sea.hit {
  background: var(--mauve);
}

.sea.miss {
  background: var(--border);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
