<template>
  <div class="fun-facts">
    <div class="fun-fact-card" @click="showFront = !showFront">
      <div class="fun-fact-content" v-if="showFront">
        <h3 class="fun-fact-title">{{ currentFact.front }}</h3>
      </div>
      <div class="fun-fact-content" v-else>
        <h3 class="fun-fact-title">{{ currentFact.back }}</h3>
      </div>
      <button v-if="showFront" class="flip-button">Flip</button>
      <button v-else class="next-button" @click="nextCard">Next</button>
    </div>
  </div>
</template>
<script>
import { funFactsData } from "@/data/funFactsData.js";

export default {
  data() {
    return {
      funFacts: funFactsData,
      currentFactIndex: 0,
      showFront: true,
    };
  },
  computed: {
    currentFact() {
      return this.funFacts[this.currentFactIndex];
    },
  },
  methods: {
    nextCard() {
      this.currentFactIndex =
        (this.currentFactIndex + 1) % this.funFacts.length;
      this.currentFact.front;
    },
  },
};
</script>
<style scoped>
.fun-facts {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.fun-fact-card {
  width: 640px;
  height: 360px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.3s ease;
}

.fun-fact-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  text-align: center;
}

.fun-fact-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.flip-button,
.next-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: 12px;
  text-align: center;
  background-color: #7f7f7f;
  border: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.flip-button:hover,
.next-button:hover {
  background-color: #e0e0e0;
}

.flip-button:focus,
.next-button:focus {
  outline: none;
}

.flip-button:active,
.next-button:active {
  background-color: #d0d0d0;
  transform: translateY(1px);
}
</style>
