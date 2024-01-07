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
    /**
     * @param { Array } board - an array of all positions in the board and their current state
     * @param { integer } index = the index of the cell being checked
     * @returns { Object } returns an Object containing the states of all adjacent cells (null if non-existant)
     */
    checkAdjacentCells(board, index) {
      let left = index % 3 !== 0;
      let right = index % 3 !== 2;
      let top = index > 2;
      let bottom = index < 6;

      let topLeft = top && left;
      let topRight = top && right;
      let bottomLeft = bottom && left;
      let bottomRight = bottom && right;

      return {
        left,
        right,
        top,
        bottom,
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
      };
    },

    /**
     * @returns { integer } Returns the index on the board the computers move will be made on
     */
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

    findBestMove(objects) {
      let highestViability = 0; // Initialize with a very low number
      let bestMove = null;
      // TODO: add all equally viable moves to return
      objects.forEach((obj) => {
        if (obj.viability > highestViability) {
          highestViability = obj.viability;
          bestMove = obj.move;
        }
      });

      return bestMove;
    },

    wouldBeWin(boardIndex) {
      for (let combo of this.winningCombinations) {
        const [a, b, c] = combo;
        if (a == boardIndex) {
          if (
            this.miniWinners[b] == "player-red" &&
            this.miniWinners[c] == "player-red"
          ) {
            return true;
          }
        } else if (b == boardIndex) {
          if (
            this.miniWinners[a] == "player-red" &&
            this.miniWinners[c] == "player-red"
          ) {
            return true;
          }
        } else if (c == boardIndex) {
          if (
            this.miniWinners[b] == "player-red" &&
            this.miniWinners[a] == "player-red"
          ) {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * @param {integer} proposedIndex - the index of the proposed move to make for the computer player
     * @returns {float} Returns a number between 0 (will lose the game) and 100(will win the game) for
     *                  the viability of making the move based on what the opponent is liable to do
     *                  (such as win a sub-game, or worse, win the game)
     */
    viabilityAnalysis(proposedIndex, thisBoardIndex) {
      const futureBoard = this.boards[proposedIndex];
      const thisBoard = this.boards[thisBoardIndex];
      let viability = 50;
      // Check if the move would result in the human player having to play on an empty board
      const isNextBoardEmpty = (index) => {
        const nextBoard = this.boards[index];
        return nextBoard.every((cell) => cell === null);
      };

      // Boost viability if the human player's next board is empty
      if (isNextBoardEmpty(proposedIndex)) {
        viability += 5;
      }

      // Function to adjust viability for setting up a win
      const adjustForSetup = (board, player) => {
        for (let combo of this.winningCombinations) {
          const [a, b, c] = combo;

          // Check if the AI has a chance to set up two in a row, excluding false diagonals
          if (combo.every((idx) => [0, 2, 4, 6, 8].includes(idx))) {
            // Diagonal setup
            if (
              (board[a] === player &&
                b == proposedIndex &&
                board[c] === null) ||
              (board[a] === null &&
                b == proposedIndex &&
                board[c] === player) ||
              (board[a] === null &&
                board[b] === player &&
                c == proposedIndex) ||
              (board[a] === player &&
                board[b] === null &&
                c == proposedIndex) ||
              (a == proposedIndex &&
                board[b] === null &&
                board[c] === player) ||
              (a == proposedIndex && board[b] === player && board[c] === null)
            ) {
              viability += 5; // Boost for setting up a win
              break; // Only need one setup to justify the boost
            }
          } else {
            // Horizontal or vertical setup

            let indexInCombo = combo.indexOf(proposedIndex);
            if (indexInCombo != -1) {
              combo.slice(proposedIndex, 1);
            }
            if (
              (board[a] === player &&
                b == proposedIndex &&
                board[c] === null) ||
              (board[a] === null &&
                b == proposedIndex &&
                board[c] === player) ||
              (board[a] === null &&
                board[b] === player &&
                c == proposedIndex) ||
              (board[a] === player &&
                board[b] === null &&
                c == proposedIndex) ||
              (a == proposedIndex &&
                board[b] === null &&
                board[c] === player) ||
              (a == proposedIndex && board[b] === player && board[c] === null)
            ) {
              console.log(`setting up a win for index ${proposedIndex}`);
              viability += 5; // Boost for setting up a win
              console.log(`viability for ${proposedIndex}: ${viability}`);
              break; // Only need one setup to justify the boost
            }
          }
        }
      };

      // Function to adjust viability based on a player's potential win or block
      const adjustViabilityForPlayer = (board, player, isFutureBoard) => {
        for (let combo of this.winningCombinations) {
          const [a, b, c] = combo;
          const aComboWin =
            board[a] === player && board[b] === player && board[c] === null;
          const bComboWin =
            board[a] === player && board[c] === player && board[b] === null;
          const cComboWin =
            board[b] === player && board[c] === player && board[a] === null;
          if (aComboWin == true) {
            console.log(
              `cell ${a} and ${b} are taken. cell ${c} is needed. proposed move is ${proposedIndex}`
            );
            if (isFutureBoard) {
              if (player == "player-red") {
                if (this.wouldBeWin(proposedIndex)) {
                  viability = 0;
                }
                viability -= 45;
              } else {
                viability -= 10;
              }
            } else {
              if (player == "player-red") {
                viability += 25;
              } else {
                if (c == proposedIndex) {
                  viability += 40;
                }
              }
            }
          }
          if (bComboWin == true) {
            console.log(
              `cell ${a} and ${c} are taken. cell ${b} is needed. proposed move is ${proposedIndex}`
            );
            if (isFutureBoard) {
              if (player == "player-red") {
                if (this.wouldBeWin(proposedIndex)) {
                  viability = 0;
                }
                viability -= 45;
              } else {
                viability -= 10;
              }
            } else {
              if (player == "player-red") {
                viability += 25;
              } else {
                if (b == proposedIndex) {
                  viability += 40;
                }
              }
            }
          }
          if (cComboWin == true) {
            console.log(
              `cell ${b} and ${c} are taken. cell ${a} is needed. proposed move is ${proposedIndex}`
            );
            if (isFutureBoard) {
              if (player == "player-red") {
                if (this.wouldBeWin(proposedIndex)) {
                  viability = 0;
                }
                viability -= 45;
              } else {
                viability -= 10;
              }
            } else {
              if (a == proposedIndex) {
                console.log(`true index for player ${player}`);
                if (player == "player-red") {
                  console.log(`increased viability for blocking opponent`);
                  viability += 25;
                } else {
                  console.log(`increased viability for potential win`);
                  viability += 40;
                }
              }
            }
          }
        }
      };

      // Adjust viability for setting up a win on the current board
      adjustForSetup(thisBoard, "player-blue");

      // Adjust viability for the current board
      adjustViabilityForPlayer(thisBoard, "player-blue", false);
      adjustViabilityForPlayer(thisBoard, "player-red", false);

      // Adjust viability for the future board
      adjustViabilityForPlayer(futureBoard, "player-blue", true);
      adjustViabilityForPlayer(futureBoard, "player-red", true);

      return Math.max(0, viability); // Ensure viability doesn't go below 0
    },

    /**
     * @param { Array } board - an array of all positions in the board and their current state
     * @param { integer } currentIndex = the index of the initial checked cell
     * @param { integer } proposedIndex = the index of the proposed move to make on the board
     * @returns { Object } returns an Object containing the states of all adjacent cells (null if non-existant)
     */
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

    /**
     * @param { integer } boardNumber - the index of the board to analyze
     * @returns { integer } returns the index on the board the computer player will be making
     */
    narrowBoardAnalysis(boardNumber) {
      const thisBoard = this.boards[boardNumber];
      let computerMoves = [];

      // Iterate over all cells in the board
      for (let i = 0; i < thisBoard.length; i++) {
        // Only consider empty cells
        if (thisBoard[i] === null) {
          // Evaluate the viability of this cell
          const viability = this.viabilityAnalysis(i, boardNumber);
          // If the cell is a potential move (i.e., not obstructed and viable), add it to the list
          computerMoves.push({ move: i, viability: viability });
        }
      }
      console.log(`valid Moves: ${computerMoves.length}`);
      console.log(`moves: ${JSON.stringify(computerMoves)}`);
      // If there are any viable moves, find the best one
      if (computerMoves.length > 0) {
        let bestMove = this.findBestMove(computerMoves);
        return bestMove;
      }

      // If no viable moves are found, return -1 or handle as needed
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

    /**
     * @param { integer } boardIndex = the index of the board the player made a move on
     * @param { integer } cellIndex = the index of the cell the player made a move on
     */
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

    /**
     * @param { integer } boardIndex = the index of the board the player made a move on
     * @returns { boolean } true if the player has made a move on a valid voard
     */
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
