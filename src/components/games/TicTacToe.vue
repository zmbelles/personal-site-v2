<template>
  <h1 class="game-header">Tic-Tac-Toe 2: The Sequel</h1>

  <div class="tic-tac-toe">
    <button class="rules" @click="toggleRules">Rules</button>
    <!-- Rules div -->
    <div class="rules-container" v-if="showRules">
      <div class="rules-content">
        <button class="close-rules" @click="toggleRules">X</button>
        <p>The Basics:</p>
        <ol>
          <li>This game utilizes a 9x9 grid of Tic-Tac-Toe.</li>
          <li>The grid is split up into 9 3x3 sub-games.</li>
          <li>
            You may only make a move in a sub-game if it corresponds with the
            position of the last move. For example, if the last move was on the
            top left position, the next move must be made on the top left
            sub-game.
            <ol>
              <li>
                If the last position would force a player to make a move on an
                already completed sub-game, that player may make their move on
                any open space on the board.
              </li>
            </ol>
          </li>
        </ol>
        <p style="align-items: start">How to Play:</p>
        <ol>
          <li>
            When it's their turn, players select an empty space within one of
            the purple highlighted grids to make their move.
          </li>
          <li>
            If a player's move would cause there to be three in a row of that
            player's color, vertically, horizontally, or diagonally, in that
            sub-game, that player is deemed the winner of that sub-game and it
            will be colored in for their color.
          </li>
        </ol>
        <p>Winning the Game:</p>
        <ol>
          <li>
            If a player wins 3 sub-games of Tic-Tac-toe in a row, vertically,
            horizontally, or diagonally, that player is considered the winner.
          </li>
        </ol>
      </div>
    </div>
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

      // holds the state of the rules button being clicked to show rules
      showRules: false,

      // holds all possible winning combinations in tic-tac-toe
      // for reuse
      winningCombinations: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6], // Diagonals
      ],
      aiPowerSwitch: true,
      // delay for computer player to mimic thinking
      aiDelay: 1000,
    };
  },
  methods: {
    checkAdjacentCells(board, index) {
      let left, right, top, bottom;

      // Left check (not for left column)
      if (index % 3 !== 0) {
        left = board[index - 1];
      } else {
        left = -1;
      }

      // Right check (not for right column)
      if (index % 3 !== 2) {
        right = board[index + 1];
        console.log(board[index + 1]);
      } else {
        right = -1;
      }

      // Top check (not for top row)
      if (index > 2) {
        top = board[index - 3];
        console.log(board[index - 3]);
      } else {
        top = -1;
      }

      // Bottom check (not for bottom row)
      if (index < 6) {
        bottom = board[index + 3];
        console.log(board[index + 3]);
      } else {
        bottom = -1;
      }

      return { left, right, top, bottom };
    },
    fullBoardAnalysis() {
      let validBoards = [];
      for (let i = 0; i < 9; i++) {
        if (this.miniWinners[i] == null) {
          validBoards.push(i);
        }
      }
      const randomIndex =
        validBoards[Math.floor(Math.random() * validBoards.length)];
      this.thisBoard = randomIndex;
      return this.narrowBoardAnalysis(randomIndex);
    },
    obstructionAnalysis(board, currentIndex, proposedIndex) {
      // Determine the direction
      let direction;
      if (Math.floor(currentIndex / 3) === Math.floor(proposedIndex / 3)) {
        direction = "horizontal";
      } else if (currentIndex % 3 === proposedIndex % 3) {
        direction = "vertical";
      } else {
        if (currentIndex === 0 || currentIndex === 8) {
          direction = "left-diagonal";
        } else if (currentIndex === 2 || currentIndex === 6) {
          direction = "right-diagonal";
        } else if (currentIndex === 4) {
          // Index 4 can be part of either diagonal
          if (proposedIndex === 0 || proposedIndex === 8) {
            direction = "left-diagonal";
          } else if (proposedIndex === 2 || proposedIndex === 6) {
            direction = "right-diagonal";
          }
        }
      }

      // Check for obstructions based on direction
      switch (direction) {
        case "horizontal": {
          const rowStart = Math.floor(currentIndex / 3) * 3;
          for (let i = rowStart; i < rowStart + 3; i++) {
            if (board[i] === "player-red") return true; // Obstructed
          }
          break;
        }
        case "vertical": {
          const col = currentIndex % 3;
          for (let i = col; i <= col + 6; i += 3) {
            if (board[i] === "player-red") return true; // Obstructed
          }
          break;
        }
        case "left-diagonal": {
          if ([0, 4, 8].includes(currentIndex)) {
            if ([0, 4, 8].some((index) => board[index] === "player-red")) {
              return true; // Obstructed
            }
          }
          break;
        }
        case "right-diagonal": {
          if ([2, 4, 6].includes(currentIndex)) {
            if ([2, 4, 6].some((index) => board[index] === "player-red")) {
              return true; // Obstructed
            }
          }
          break;
        }
      }
    },

    narrowBoardAnalysis(boardNumber) {
      const thisBoard = this.boards[boardNumber];
      // Check if the human player has two in a row
      for (let combo of this.winningCombinations) {
        const [a, b, c] = combo;

        if (
          thisBoard[a] === "player-red" &&
          thisBoard[b] === "player-red" &&
          !thisBoard[c]
        ) {
          return c; // Block at position c
        }
        if (
          thisBoard[a] === "player-red" &&
          !thisBoard[b] &&
          thisBoard[c] === "player-red"
        ) {
          return b; // Block at position b
        }
        if (
          !thisBoard[a] &&
          thisBoard[b] === "player-red" &&
          thisBoard[c] === "player-red"
        ) {
          return a; // Block at position a
        }
      }
      // Check if the computer has two in a row
      for (let combo of this.winningCombinations) {
        const [a, b, c] = combo;

        if (
          thisBoard[a] === "player-blue" &&
          thisBoard[b] === "player-blue" &&
          !thisBoard[c]
        ) {
          return c; // win at position c
        }
        if (
          thisBoard[a] === "player-blue" &&
          !thisBoard[b] &&
          thisBoard[c] === "player-blue"
        ) {
          return b; // win at position b
        }
        if (
          !thisBoard[a] &&
          thisBoard[b] === "player-blue" &&
          thisBoard[c] === "player-blue"
        ) {
          return a; // win at position a
        }
      }
      for (let i = 0; i < thisBoard.length; i++) {
        if (thisBoard[i] == "player-blue") {
          const { left, right, top, bottom } = this.checkAdjacentCells(
            thisBoard,
            i
          );
          console.log(`for grid slot ${i}`);
          console.log(
            `left: ${left}, right: ${right}, top: ${top}, bottom: ${bottom}`
          );
          // Check if the adjacent cells are empty and the path is not blocked
          if (left === null && thisBoard[i - 1] !== "player-red") {
            let isObstructed = this.obstructionAnalysis(thisBoard, i, i - 1);
            if (!isObstructed) return i - 1;
          } else if (right === null && thisBoard[i + 1] !== "player-red") {
            let isObstructed = this.obstructionAnalysis(thisBoard, i, i + 1);
            if (!isObstructed) return i + 1;
          } else if (top === null && thisBoard[i - 3] !== "player-red") {
            let isObstructed = this.obstructionAnalysis(thisBoard, i, i - 3);
            if (!isObstructed) return i - 3;
          } else if (bottom === null && thisBoard[i + 3] !== "player-red") {
            let isObstructed = this.obstructionAnalysis(thisBoard, i, i + 3);
            if (!isObstructed) return i + 3;
          }
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
        const randomIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        return randomIndex;
      }
      return -1;
    },
    AIPlayerMove() {
      setTimeout(() => {
        let computerMove = -1;
        if (this.miniWinners[this.lastMove]) {
          computerMove = this.fullBoardAnalysis();
        } else {
          computerMove = this.narrowBoardAnalysis(this.lastMove);
          this.thisBoard = this.lastMove;
        }
        if (computerMove == -1) {
          alert(
            "Something went wrong parsing the AI Moveset. Please contact the administrator."
          );
          this.resetGame();
        }
        this.boards[this.thisBoard][computerMove] = "player-blue";
        this.checkMiniWinner(this.thisBoard);
        this.currentPlayer = "X";
        this.lastMove = computerMove; // Update lastMove based on the mini-board for the next move
        // Increase the delay for the next move
        this.aiDelay += 100;
      }, this.aiDelay);
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
        if (this.aiPowerSwitch) {
          this.computerIsThinking = true;
          this.AIPlayerMove(cellIndex);
          this.computerIsThinking = false;
        }
      }
    },
    checkMiniWinner(boardIndex) {
      for (let combo of this.winningCombinations) {
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
      for (let combo of this.winningCombinations) {
        const [a, b, c] = combo;
        if (
          this.miniWinners[a] &&
          this.miniWinners[a] === this.miniWinners[b] &&
          this.miniWinners[a] === this.miniWinners[c]
        ) {
          this.winner = this.miniWinners[a];
          this.aiPowerSwitch = false;
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
      this.aiDelay = 1000;
      this.lastMove = null;
      this.miniWinners = Array(9).fill(null);
      this.aiPowerSwitch = true;
    },
    isBoardValid(boardIndex) {
      // First move can be anywhere
      if (this.lastMove === null) return true;

      // If the mini-board where the last move was made is won, all boards are valid
      if (this.miniWinners[this.lastMove]) return true;

      // Otherwise, the valid board is the one that corresponds to the last move
      return boardIndex === this.lastMove;
    },
    toggleRules() {
      this.showRules = !this.showRules;
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
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Take up the full width */
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

.game-header {
  display: contents;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  color: #ffffff;
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

.rules {
  padding: 10px 15px;
  background-color: #9510d8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-left: auto; /* Push the button to the right */
}

.rules-container {
  position: inherit; /* or absolute, depending on your layout */
  width: 50vh; /* Adjust as needed */
  background: #362e5f;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: slide-in 0.3s ease-out;
}

.rules-content {
  position: relative;
  align-content: flex-start;
  text-align: left;
}

.close-rules {
  position: absolute;
  top: -1vh;
  right: 0.5vh;
  background: #f0f0f0; /* Light background for the button */
  color: #333; /* Darker text color for contrast */
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px; /* Padding around the X */
  border-radius: 50%; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
  width: 25px; /* Fixed width */
  height: 25px; /* Fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, box-shadow 0.3s; /* Smooth transition for hover effect */
}

.close-rules:hover {
  background-color: #858585; /* Slightly darker background on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* More pronounced shadow on hover */
}

@keyframes slide-in {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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
