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

      // an array of arrays which stores the current game state
      boards: Array(9)
        .fill()
        .map(() => Array(9).fill(null)),
      // since the classic game of Tic-Tac-Toe uses X's and O's, the same is true for each player
      currentPlayer: "X",

      // stores a string of which player has won (null if game persists)
      winner: null,

      // an Array of strings for each mini-board that has been won by each player.
      miniWinners: Array(9).fill(null),

      // stores the index of the last move made. mostly used to check if the player has played a move 
      // on a valid board according to the rules.
      lastMove: null,

      // tracks the last board that was played on so the computer player can check
      // if the player won on that board
      thisBoard: -1,

      //bool to track whether or not it is the computers turn. if so, do not allow button presses.
      computerIsThinking: false,
    };
  },
  methods: {
    fullBoardAnalysis(){

      let validBoards = [];
      for(let i=0; i<9; i++){
        if(this.miniWinners[i] == null){
          validBoards.push(i);
        }
      }
      const randomIndex = validBoards[Math.floor(Math.random() * validBoards.length)];
      this.thisBoard = randomIndex;
      return this.narrowBoardAnalysis(randomIndex);
    },
    narrowBoardAnalysis(boardNumber){
      const thisBoard = this.boards[boardNumber];

      const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];
      // Check if the human player has two in a row 
      for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        
        if (thisBoard[a] === 'player-red' && thisBoard[b] === 'player-red' && !thisBoard[c]) {
          return c; // Block at position c
        }
        if (thisBoard[a] === 'player-red' && !thisBoard[b] && thisBoard[c] === 'player-red') {
          return b; // Block at position b
        }
        if (!thisBoard[a] && thisBoard[b] === 'player-red' && thisBoard[c] === 'player-red') {
          return a; // Block at position a
        }
      }
      // Check if the computer has two in a row
      for (let combo of winningCombinations) {
        const [a, b, c] = combo;

        if (thisBoard[a] === 'player-blue' && thisBoard[b] === 'player-blue' && !thisBoard[c]) {
          return c; // win at position c
        }
        if (thisBoard[a] === 'player-blue' && !thisBoard[b] && thisBoard[c] === 'player-blue') {
          return b; // win at position b
        }
        if (!thisBoard[a] && thisBoard[b] === 'player-blue' && thisBoard[c] === 'player-blue') {
          return a; // win at position a
        }
      }
      // Collect all empty indices
      const emptyIndices = [];
      thisBoard.forEach((cell, index) => {
        if (cell === null) {
          emptyIndices.push(index);
        }
      });
      // Select a random index from the empty cells
      if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        return randomIndex;
      }
      return -1;
    },
    AIPlayerMove(){
      let computerMove = -1;
      if(this.miniWinners[this.lastMove]){
        computerMove = this.fullBoardAnalysis();
      }
      else{
        computerMove = this.narrowBoardAnalysis(this.lastMove);
        this.thisBoard = this.lastMove;
      }
      if(computerMove == -1){
        alert("Something went wrong parsing the AI Moveset. Please contact the administrator.");
        this.resetGame();
      }
      this.boards[this.thisBoard][computerMove] = "player-blue";
      this.checkMiniWinner(this.thisBoard);
      this.currentPlayer = "X";
      this.lastMove = computerMove; // Update lastMove based on the mini-board for the next move
    },
    makeMove(boardIndex, cellIndex) {
      if (!this.isBoardValid(boardIndex)) {
        // Show an alert if the player tries to play on an invalid board
        alert("Please make your move on one of the highlighted boards.");
        return;
      }

      if (!this.boards[boardIndex][cellIndex]) {
        this.boards[boardIndex][cellIndex] = "player-red";
        this.checkMiniWinner(boardIndex);
        this.currentPlayer = "O";
        this.lastMove = cellIndex; // Update lastMove based on the mini-board for the next move

        this.computerIsThinking = true;
        this.AIPlayerMove(cellIndex);
        this.computerIsThinking = false;
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
      this.lastMove = null;
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
  color: #9510d8;
  margin-top: 10px;
}
</style>
