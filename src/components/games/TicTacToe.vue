<template>
  <div class="tic-tac-toe">
    <div class="main-board">
      <div
        v-for="(miniBoard, boardIndex) in boards"
        :key="boardIndex"
        :class="[
          'board-container',
          {
            'valid-board': isBoardValid(boardIndex) && !miniWinners[boardIndex],
          },
          miniWinners[boardIndex] ? miniWinners[boardIndex] : '',
        ]"
        :style="{
          backgroundColor: miniWinners[boardIndex]
            ? miniWinners[boardIndex] === 'player-red'
              ? 'red'
              : 'blue'
            : '',
        }"
      >
        <div class="board">
          <div
            v-for="(cell, cellIndex) in miniBoard"
            :key="cellIndex"
            :class="['cell', cell]"
            @click="makeMove(boardIndex, cellIndex)"
            :style="{
              visibility: miniWinners[boardIndex] ? 'hidden' : 'visible',
            }"
          >
            <div class="cell-container"></div>
          </div>
        </div>
      </div>
    </div>
    <br /><br />
    <button class="reset-button" v-if="winner" @click="resetGame">
      Restart Game
    </button>
    <p class="game-result" v-if="winner">
      Winner: {{ winner === "player-red" ? "Red" : "Blue" }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boards: Array(9)
        .fill()
        .map(() => Array(9).fill(null)),
      currentPlayer: "X",
      winner: null,
      miniWinners: Array(9).fill(null),
      lastMove: null,
    };
  },
  methods: {
    makeMove(boardIndex, cellIndex) {
      if (!this.isBoardValid(boardIndex)) {
        // Show an alert if the player tries to play on an invalid board
        alert("Please make your move on one of the highlighted boards.");
        return;
      }

      if (
        !this.boards[boardIndex][cellIndex] &&
        !this.miniWinners[boardIndex] &&
        !this.winner
      ) {
        this.boards[boardIndex][cellIndex] =
          this.currentPlayer === "X" ? "player-red" : "player-blue";
        this.checkMiniWinner(boardIndex);
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        this.lastMove = cellIndex; // Update lastMove based on the mini-board for the next move
      }
    },
    checkMiniWinner(boardIndex) {
      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // columns
        [0, 4, 8],
        [2, 4, 6], // diagonals
      ];

      for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (
          this.boards[boardIndex][a] &&
          this.boards[boardIndex][a] === this.boards[boardIndex][b] &&
          this.boards[boardIndex][a] === this.boards[boardIndex][c]
        ) {
          this.miniWinners[boardIndex] =
            this.currentPlayer === "X" ? "player-red" : "player-blue";
          break;
        }
      }
      this.checkWinner();
    },
    checkWinner() {
      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // columns
        [0, 4, 8],
        [2, 4, 6], // diagonals
      ];

      for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (
          this.miniWinners[a] &&
          this.miniWinners[a] === this.miniWinners[b] &&
          this.miniWinners[a] === this.miniWinners[c]
        ) {
          this.winner = this.miniWinners[a];
          return; // Winner found, exit the loop
        }
      }

      // No winner found, continue the game
      this.winner = null;
    },
    resetGame() {
      this.boards = Array(9)
        .fill()
        .map(() => Array(9).fill(null));
      this.currentPlayer = "X";
      this.winner = null;
      this.miniWinners = Array(9).fill(null);
    },
    isBoardValid(boardIndex) {
      // First move can be anywhere
      if (this.lastMove === null) return true;

      // If the mini-board where the last move was made is won, all boards are valid
      if (this.miniWinners[this.lastMove]) return true;

      // Otherwise, the valid board is the one that corresponds to the last move
      return boardIndex === this.lastMove;
    },
  },
};
</script>

<style>
.tic-tac-toe {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.main-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px; /* Rounded edges for the board */
  overflow: hidden; /* Ensures the rounded corners clip the child elements */
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
}

.cell {
  background: #f0f0f0;
  padding: 10px;
  text-align: center;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px; /* Fixed width to ensure consistent size */
  height: 30px; /* Fixed height to ensure consistent size */
}

.cell.player-red {
  background-color: red;
}

.cell.player-blue {
  background-color: blue;
}

.valid-board {
  background-color: #9510d8; /* Highlight color for valid boards */
}

.mini-board-result {
  font-size: 16px;
  text-align: center;
}

.reset-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #0056b3;
}

.game-result {
  font-size: 20px;
  color: #333;
  margin-top: 10px;
}
</style>
