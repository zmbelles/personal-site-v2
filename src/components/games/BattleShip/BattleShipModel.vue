<template>
    <div class="battleship-container">
      <h1 class="title">BattleShip Game</h1>
      <button class="rules-button" @click="toggleRules">Show Rules</button>
      <div class="rules-modal" v-if="showRules">
        <div class="rules-content">
          <h2>Game Rules</h2>
          <p>Place your ships anywhere on the battlefield.</p>
          <p>No two ships can overlap.</p>
          <p>Use the <b>R Key</b> to rotate the ship 90 degrees.</p>
          <p>Press <b>START</b> when all your ships have been placed.</p>
          <button class="close-button" @click="toggleRules">Close</button>
        </div>
      </div>
      <!-- <h3 class="current-step">{{ stepMessage }}</h3> -->
      <div class="grid-container">
      <div class="grid-header">
        <div class="grid-label corner"></div> <!-- Empty corner cell -->
        <div class="grid-label" v-for="colLabel in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']" :key="colLabel">{{ colLabel }}</div>
      </div>
      <div class="grid-body">
        <div class="grid-row" v-for="row in 10" :key="row">
          <div class="grid-label">{{ row }}</div> <!-- Row labels -->
            <div 
              v-for="col in 10" 
              :key="col" 
              class="grid-cell"
              @mouseover="handleMouseOver(row, col)"
              @mouseleave="handleMouseLeave">
            </div>
          </div>
        </div>
      </div>
      <br><br><br>
      <div v-if="hoveredCell">
        Hovered Cell: {{ hoveredCell }}
      </div>
      <button class="start-button" @click="handleClick">Start Game</button>
    </div>
  </template>
  
<script>
export default {
  name: 'BattleShip',
  data() {
    return {
      currentStep: 0,
      showRules: false, // Controls the visibility of the rules modal
      hoveredCell: null, // To store the hovered cell info 
      // stepMessageObject: {
      //   placecarrier: "Admiral, please place your Aircraft Carrier",
      //   placeSub: "Admiral, please place your Submarine",
      //   placeDestroyer: "Admiral, please place your Destroyer",
      //   placeBattleship: "Admiral, please place your Battleship",
      //   placeCruiser: "Admiral, please place your Cruiser",
      //   computerThink: "Our enemy is making their move!",
      //   humanTurn: "Missiles armed, Admiral. Awaiting your coordinates.",
      // },
      // stepMessage: stepMessageObject.placecarrier,
    };
  },
  methods: {
    toggleRules() {
      this.showRules = !this.showRules;
      console.log(`Show Rules: ${this.showRules}`);
    },
    handleMouseOver(row, col) {
      console.log(`Row ${row}, Col ${col}`);
    },
    handleMouseLeave() {
      this.hoveredCell = null;
    },
    handleClick() {
      // Existing click handler logic
    }
  },
  watch: {
    // currentStep(oldStep, newStep){

    // },
  }
};
</script>
  
  <style scoped>
  :root {
    --cell-size: 150px; /* Each cell is now 200x200 */
  }
.grid-container {
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/battleship/sea-water-waves-surface-wallpaper.jpg'); /* Adjust the path as necessary */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  width: 1088px; /* Adjusted for labels */
  height: 1088px; /* Adjusted for labels */
}

.grid-header, .grid-row {
  display: flex;
}

.grid-label {
  width: 100px; /* Match grid-cell width */
  height: 98px; /* Match grid-cell height */
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.5); /* Optional for label visibility */
}

.grid-body {
  display: flex;
  flex-direction: column;
}

.corner {
  width: 96px; /* Match grid-cell width */
  height: 6px; /* Match grid-cell height */
  /* Optional styling for the corner cell */
}

/* Rest of your CSS for grid-cell, etc. */


.corner {
  width: 98px; /* Match grid-cell width */
  height: 98px; /* Match grid-cell height */
  /* Optional styling for the corner cell */
}
.battleship-container {
  max-width: 80%;
  max-height: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  align-items: center;
  background-color: #181825;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rules-button {
  align-self: flex-end; /* Aligns the button to the right */
  margin: 20px;
  padding: 10px 20px;
  background-color: #007BFF; /* Bootstrap primary blue */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-weight: bold; /* Makes the text bold */
}

.rules-button:hover {
  background-color: #0056b3; /* A darker shade of blue for the hover state */
  transform: scale(1.05); /* Slightly enlarges the button */
}
.title {
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
}

.battlefield {
  width: 980px;
  height: 980px;
  display: grid;
  grid-template-columns: repeat(10, 98px);
  grid-template-rows: repeat(10, 98px);
  background-image: url('@/assets/battleship/sea-water-waves-surface-wallpaper.jpg'); /* Adjust the path as necessary */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  grid-gap: 0;
}

.grid-cell {
  width: 98px;
  height: 96.4px;
  background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent cells */
  border: 1px solid #000000;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.grid-cell:hover {
  transform: scale(1.1); /* Scales the cell up to 110% of its original size */
  border: 1px solid #000000;
  border-radius: 4px;
}
.rules-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  box-sizing: border-box;
}

.rules-content {
  padding: 20px; /* Provides padding inside the modal */
  text-align: left; /* Aligns text to the left for readability */
  max-height: 80vh; /* Limits height to prevent overflow */
  overflow-y: auto; /* Allows scrolling within the modal if content is too long */
}

.close-button {
  /* Styles for the close button */
  display: block;
  margin-top: 20px;
  cursor: pointer;
  background-color: #f44336; /* Red color for emphasis */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  text-align: center;
}

.close-button {
  /* Styles for the close button */
  display: block;
  margin-top: 20px;
}
  .buttons-container{
    border-bottom: 10px;
  }
  .start-button {
    width: 120px; /* Set a fixed width */
    height: 120px; /* Set a fixed height to match the width */
    padding: 0;
    line-height: 100px; /* Center the text vertically */
    text-align: center;
    font-size: 1.2em;
    font-family: 'Comic Sans MS', cursive, sans-serif; /* Cartoonish font */
    color: #fff;
    background-color: #ff0000; /* Nuke-button red */
    border: none;
    border-radius: 50%; /* Circular shape */
    cursor: pointer;
    margin-top: 20px;
    transition: transform 0.2s ease;
  }

  .start-button:hover {
    transform: scale(1.1); /* Slightly enlarge on hover for effect */
    background-color: #cc0000; /* Slightly darker shade on hover */
  }
  </style>
  