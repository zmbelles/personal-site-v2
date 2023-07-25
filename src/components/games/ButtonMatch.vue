<template>
  <div class="button-match-container">
    <div class="button-match">
      <div v-for="row in 10" :key="row" class="grid-row">
        <button
          v-for="(buttonClass, index) in buttons"
          :key="index"
          :class="['button', buttonClass.class]"
          :style="{ backgroundColor: buttonClass.color }"
          @click="handleButtonClick(index)"
        ></button>
      </div>
    </div>
    <div class="submit-container">
      <button class="submit">submit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonMatch',
  data() {
    return {
      buttons: [
        { class: 'vari_one', color: 'orange' },
        { class: 'vari_two', color: 'orange' },
        { class: 'vari_three', color: 'orange' },
        { class: 'vari_four', color: 'orange' },
        { class: 'vari_five', color: 'orange' },
        { class: 'vari_six', color: 'orange' },
        { class: 'vari_seven', color: 'orange' },
        { class: 'vari_eight', color: 'orange' },
        { class: 'vari_nine', color: 'orange' },
        { class: 'vari_ten', color: 'orange' },
      ],
    };
  },
  methods: {
    handleButtonClick(index) {
      this.toggleColor(index);

      const neighbors = this.getNeighborIndices(index);
      for (const neighborIndex of neighbors) {
        this.toggleColor(neighborIndex);
      }
    },
    toggleColor(index) {
      if (index >= 0 && index < this.buttons.length) {
        this.buttons[index].color =
          this.buttons[index].color === 'orange' ? 'blue' : 'orange';
      }
    },
    getNeighborIndices(index) {
      const rowSize = 10; // Assuming 10 buttons in each row
      const neighbors = [];

      // Left neighbor
      if (index % rowSize !== 0) {
        neighbors.push(index - 1);
      }

      // Right neighbor
      if ((index + 1) % rowSize !== 0) {
        neighbors.push(index + 1);
      }

      // Top neighbor
      if (index - rowSize >= 0) {
        neighbors.push(index - rowSize);
      }

      // Bottom neighbor
      if (index + rowSize < this.buttons.length) {
        neighbors.push(index + rowSize);
      }

      return neighbors;
    },
  },
};
</script>

<style scoped>
.button-match-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.button-match {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.grid-row {
  display: flex;
  margin-bottom: 4px;
}

.grid {
  display: flex;
  justify-content: space-between;
}

.submit-container {
  margin-top: 20px;
}

.submit {
  padding: 10px 20px;
  background-color: #9510d8;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.button {
  width: 30px;
  height: 30px;
  border: none;
  margin-right: 4px;
}
</style>
