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
          backgroundColor: getBoardBackgroundColor(boardIndex),
        }"
      >
        <div class="board">
          <div
            v-for="(cell, cellIndex) in miniBoard"
            :key="cellIndex"
            :class="['cell', cell]"
            @click="!isComputerThinking && makeMove(boardIndex, cellIndex)"
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
    <div class="results-messages">
      <p class="game-result" v-if="winner">
        Winner: {{ winner === "player-red" ? "Red" : "Blue" }}
      </p>
      <p class="game-result" v-if="isDraw">
        {{ drawMessage }}
      </p>
    </div>
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

      // if true, the AI is processing a best move between all boards
      isFullBoardProcessing: false,

      isDraw: false,
      drawMessage: "No Players Win! Please try again.",
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
        if (!this.miniWinners[i]) {
          // Checks for null, undefined, empty string, etc.
          validBoards.push(i);
        }
      }
      console.log(`valid boards: ${validBoards.length}`);
      let potentialMoves = [];
      this.isFullBoardProcessing = true;
      console.log(`valid boards: ${validBoards}`);
      for (let i = 0; i < validBoards.length; i++) {
        let thisMove = this.narrowBoardAnalysis(validBoards[i]);

        // Check if thisMove is valid before adding it to potentialMoves
        if (thisMove !== -1 && thisMove !== null && thisMove !== undefined) {
          let thisPossibleMove = {
            move: thisMove.move,
            board: validBoards[i],
            viability: thisMove.viability,
          };
          potentialMoves.push(thisPossibleMove);
        }
      }

      this.isFullBoardProcessing = false;
      console.log(JSON.stringify(potentialMoves));

      let highestViability = 0;
      let bestMove = null;
      potentialMoves.forEach((obj) => {
        if (obj.viability > highestViability) {
          highestViability = obj.viability;
          bestMove = obj;
        }
      });
      console.log(`best move: ${JSON.stringify(bestMove)}`);
      if (bestMove) {
        this.thisBoard = bestMove.board;
        return bestMove;
      } else {
        // Handle case where no valid move is found
        // This might need further handling based on your game logic
        return { move: -1, board: -1 };
      }
    },

    findBestMove(objects) {
      let highestViability = 0;
      let bestMoves = [];

      // First, find the highest viability score
      objects.forEach((obj) => {
        if (obj.viability > highestViability) {
          highestViability = obj.viability;
        }
      });

      // Next, collect all moves that have this highest viability score
      bestMoves = objects.filter((obj) => obj.viability === highestViability);

      // Finally, if there are multiple best moves, pick one randomly
      if (bestMoves.length > 1) {
        const randomIndex = Math.floor(Math.random() * bestMoves.length);
        return bestMoves[randomIndex];
      } else {
        // If there's only one best move, return it
        return bestMoves[0];
      }
    },

    wouldBeWin(boardIndex, player) {
      for (let combo of this.winningCombinations) {
        const [a, b, c] = combo;
        if (a == boardIndex) {
          if (
            this.miniWinners[b] == player &&
            this.miniWinners[c] == player
          ) {
            return true;
          }
        } else if (b == boardIndex) {
          if (
            this.miniWinners[a] == player &&
            this.miniWinners[c] == player
          ) {
            return true;
          }
        } else if (c == boardIndex) {
          if (
            this.miniWinners[b] == player &&
            this.miniWinners[a] == player
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
<<<<<<< Updated upstream
=======
      if (
        typeof this.boards[proposedIndex] === "undefined" ||
        typeof this.boards[thisBoardIndex] === "undefined"
      ) {
        console.error(
          `This board index: ${thisBoardIndex} with the proposed move ${JSON.stringify(
            proposedIndex
          )} are invalid.`
        );
        throw new Error("Invalid board indices");
      }

>>>>>>> Stashed changes
      const futureBoard = this.boards[proposedIndex];
      const thisBoard = this.boards[thisBoardIndex];
      let viability = 50;

<<<<<<< Updated upstream
      // Check if the move would result in the human player having to play on an empty board
      const isBoardEmpty = (board) => board.every((cell) => cell === null);
      if (this.miniWinners[proposedIndex]) {
        viability -= 70;
      }
      if (thisBoard && isBoardEmpty(thisBoard)) {
=======
      // Check for already won board or empty future board
      if (
        this.miniWinners[proposedIndex] == "player-red" ||
        this.miniWinners[proposedIndex] == "player-blue"
      ) {
        // console.log(`board: ${proposedIndex} has already been won. -70 points Griffindoor.`);
        viability -= 40;
      }
      if (
        thisBoard &&
        this.isBoardEmpty(futureBoard) &&
        proposedIndex != thisBoardIndex
      ) {
>>>>>>> Stashed changes
        viability += 5;
      }

      // Function to adjust viability for setting up a win
      const adjustViabilityForSetup = (board, player) => {
        if (!board) return;

        this.winningCombinations.forEach((combo) => {
          const playerCells = combo.filter(
            (idx) => board[idx] === player
          ).length;
          const emptyCells = combo.filter((idx) => board[idx] === null).length;

          // Boost for setting up a win
          if (
            playerCells === 1 &&
            emptyCells === 2 &&
            combo.includes(proposedIndex)
          ) {
            viability += 10;
          }
        });
      };

      // Function to adjust viability based on a player's potential win or block
      const adjustViabilityForWinOrBlock = (board, player, isFutureBoard) => {
        if (!board) return;

        this.winningCombinations.forEach((combo) => {
          const playerCells = combo.filter(
            (idx) => board[idx] === player
          ).length;
          const emptyCells = combo.filter((idx) => board[idx] === null).length;

          if (playerCells === 2 && emptyCells === 1) {
            const winningCell = combo.find((idx) => board[idx] === null);
<<<<<<< Updated upstream
            if (winningCell === proposedIndex) {
              if (player === "player-red") {
                viability += isFutureBoard ? -45 : 60;
                if (isFutureBoard && this.wouldBeWin(proposedIndex, 'player-red'))
                  viability = 0;
              } else {
                if (!isFutureBoard && this.wouldBeWin(proposedIndex, 'player-blue'))
                  viability += 30;
                viability += isFutureBoard ? -10 : 50;
              }
            }
          }
        });
=======

            ///////////////////////////////////
            ///// logic for current board /////
            ///////////////////////////////////
            if (winningCell === proposedIndex && !isFutureBoard) {
              console.log(`${player} wins with ${winningCell}`);
              // if the move blocks a player on the current board
              if (player === "player-red") {
                newViability += 25;
              } else if (player == "player-blue") {
                newViability += 30;
              }
              ///////////////////////////////////
              //// logic for future board ///////
              ///////////////////////////////////

              // see if this move would allow human to block a computer win on next board
              // or if the human player can win on next board
            } else if (isFutureBoard) {
              if (player == "player-red") {
                console.log(
                  `potential win on board ${thisBoardIndex} for human player`
                );
                newViability -= 40;
              } else {
                console.log(
                  `potential block on board ${thisBoardIndex} for human player`
                );
                newViability -= 15;
              }
            }
          }

          // Check if the proposed move could enable player-red to win immediately
          if (this.wouldBeWin(proposedIndex, "player-red")) {
            newViability -= 100; // Significantly reduce viability for such moves
          }
          // check if move would allow human to block a computer game win on next board
          if (this.wouldBeWin(proposedIndex, "player-blue")) {
            newViability -= 50;
          }
        }
        return newViability;
>>>>>>> Stashed changes
      };

      // Adjust viability for the current and future board
      adjustViabilityForSetup(thisBoard, "player-blue");
      adjustViabilityForWinOrBlock(thisBoard, "player-blue", false);
      adjustViabilityForWinOrBlock(thisBoard, "player-red", false);
      adjustViabilityForWinOrBlock(futureBoard, "player-blue", true);
      adjustViabilityForWinOrBlock(futureBoard, "player-red", true);
      return Math.max(0, viability);
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
      if (this.isFullBoardProcessing) {
        console.log(
          `for full board analysis, the board number is ${boardNumber}`
        );
      }
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
        if (this.isFullBoardProcessing) {
          console.log(`best Move: ${JSON.stringify(bestMove)}`);
          return bestMove;
        }
        return bestMove.move;
      }

      // If no viable moves are found, return -1 or handle as needed
      return -1;
    },

    async AIPlayerMove() {
      setTimeout(() => {
        let computerMove = {};
        if (this.miniWinners[this.lastMove]) {
          computerMove = this.fullBoardAnalysis();
          if (computerMove.move == -1 || !computerMove.move) {
            alert(
              "Something went wrong parsing the AI Moveset. Please contact the administrator."
            );
            this.resetGame();
          }
          this.boards[computerMove.board][computerMove.move] = "player-blue";
          this.checkMiniWinner(this.thisBoard);
          this.currentPlayer = "X";
          this.lastMove = computerMove.move; // Update lastMove based on the mini-board for the next move
          // Increase the delay for the next move
          this.aiDelay += 100;
        } else {
          computerMove = this.narrowBoardAnalysis(this.lastMove);
          this.thisBoard = this.lastMove;
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
        }
      }, this.aiDelay);
    },

    /**
     * @param { integer } boardIndex = the index of the board the player made a move on
     * @param { integer } cellIndex = the index of the cell the player made a move on
     */
    async makeMove(boardIndex, cellIndex) {
      if (this.currentPlayer != "X") {
        return;
      }
      this.computerIsThinking = true;
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
          await this.AIPlayerMove(cellIndex);
        }
      }
      this.computerIsThinking = false;
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
    isMiniBoardDraw(miniBoard) {
      return (
        miniBoard.every((cell) => cell !== null) &&
        !this.checkMiniWinner(miniBoard)
      );
    },
    isGameDraw() {
      // Check if any winning combination is still possible
      for (let combo of this.winningCombinations) {
        const [a, b, c] = combo;
        // Check if any combination can still be won
        if (
          !this.miniWinners[a] ||
          !this.miniWinners[b] ||
          !this.miniWinners[c]
        ) {
          // At least one mini-board in the combination is still active or drawn
          // Check if this combination is winnable
          if (
            !(
              this.miniWinners[a] &&
              this.miniWinners[b] &&
              this.miniWinners[c] &&
              this.miniWinners[a] !== this.miniWinners[b] &&
              this.miniWinners[b] !== this.miniWinners[c]
            )
          ) {
            return false; // This combination is still winnable, so the game is not a draw
          }
        }
      }
      // No winning combinations are possible, the game is a draw
      this.isDraw = true;
      return true;
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
      if (this.isGameDraw()) {
        this.winner = "player-draw";
        this.aiPowerSwitch = false;
        return; // Winner found, exit the loop
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
    getBoardBackgroundColor(boardIndex) {
      if (this.miniWinners[boardIndex] === "player-red") {
        return "red";
      } else if (this.miniWinners[boardIndex] === "player-blue") {
        return "blue";
      } else if (this.miniWinners[boardIndex] === "player-draw") {
        return "grey"; // Grey color for draw
      } else {
        return ""; // Default background color for active boards
      }
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
