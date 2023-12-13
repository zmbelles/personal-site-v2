<template>
    <div class="battleship-container">
      <h1 class="title">BattleShip Game</h1>
      <div class="rules">
        <p>Place your ships anywhere on the battlefield.</p>
        <p>No two ships can overlap</p>
        <p>Use the <b>R Key</b> to rotate the ship 90 degrees</p>
        <p>Press <b>START</b> when all your ships have been placed</p>
      </div>
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
      hoveredCell: null, // To store the hovered cell info
    };
  },
  methods: {
    handleMouseOver(row, col) {
      console.log(`Row ${row}, Col ${col}`);
    },
    handleMouseLeave() {
      this.hoveredCell = null;
    },
    handleClick() {
      // Existing click handler logic
    }
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
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  .rules {
    font-size: 24px;
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
  