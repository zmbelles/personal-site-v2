<template>
	<title>Button Match</title>
	<div class="button-match-container">
		<h1 class="button-match-header">Button Match</h1>
		<h3 class="button-match-header">
			Match all of the buttons to be the same color in the fastest
			possible time
		</h3>
		<div class="timer">
			{{ minutes }}<span class="blinking">:</span>{{ seconds }}
		</div>

		<div class="button-match">
			<div
				v-for="(rowButtons, row) in buttons"
				:key="row"
				class="grid-row1"
			>
				<button
					v-for="(buttonClass, index) in rowButtons"
					:id="processButtonId(row, index)"
					:key="index"
					:class="['button', buttonClass.class]"
					:style="{ backgroundColor: buttonClass.color }"
					@click="handleButtonClick(row, index)"
				></button>
			</div>
			<div v-if="showPopup" class="popup-overlay">
				<div class="popup">
					{{ successMessage }}
					<button @click="handleRefreshAfterPopup">OK</button>
				</div>
			</div>
		</div>
		<div class="submit-container">
			<button class="submit" @click="checkColors">submit</button>
		</div>
	</div>
</template>

<script>
export default {
	name: "ButtonMatch",
	data() {
		return {
			buttons: Array.from({ length: 10 }, () =>
				Array.from({ length: 10 }, () => ({
					class: `vari_${Math.floor(Math.random() * 10) + 1}`,
					color: Math.random() < 0.5 ? "blue" : "orange",
				}))
			),
			timerStarted: false,
			startTime: null,
			elapsedTime: 0,
			timerInterval: null,
			showPopup: false,
			successMessage: "",
		};
	},
	methods: {
		processButtonId(row, index) {
			return `button_${row}_${index}`;
		},
		handleButtonClick(row, index) {
			//if the timer has not started, start it.
			if (!this.timerStarted) {
				this.startTimer();
			}
			const buttonId = this.processButtonId(row, index);
			console.log(`this is button ${buttonId}`);

			this.toggleColor(row, index);

			const rowSize = 10; // Assuming 10 buttons in each row
			const col = index;

			// Left neighbor
			if (col > 0) {
				this.toggleColor(row, col - 1);
			}

			// Right neighbor
			if (col < rowSize - 1) {
				this.toggleColor(row, col + 1);
			}
		},
		toggleColor(row, index) {
			if (
				row >= 0 &&
				row < this.buttons.length &&
				index >= 0 &&
				index < this.buttons[row].length
			) {
				this.buttons[row][index].color =
					this.buttons[row][index].color === "orange"
						? "blue"
						: "orange";
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
		checkColors() {
			// Flatten the 2D array
			const flattenedButtons = this.buttons.flat();

			if (
				flattenedButtons.every((button) => button.color === "blue") ||
				flattenedButtons.every((button) => button.color === "orange")
			) {
				if (this.minutes == 0 && this.seconds <= 48) {
					this.successMessage = `Congrats! You matched all buttons in ${this.minutes}:${this.seconds} and beat the author time of 0:48!`;
				} else {
					this.successMessage = `Congrats! You matched all buttons in ${this.minutes}:${this.seconds}! Author time is 0:48`;
				}
				this.showPopup = true;
				this.stopTimer();
				return true;
			} else {
				alert(
					"The buttons are of mixed colors. Every one must be the same color"
				);
				return false;
			}
		},
		startTimer() {
			this.timerStarted = true;
			this.startTime = Date.now();
			this.timerInterval = setInterval(() => {
				this.elapsedTime = Math.floor(
					(Date.now() - this.startTime) / 1000
				);
			}, 1000);
		},
		stopTimer() {
			this.timerStarted = false;
			clearInterval(this.timerInterval);
			this.elapsedTime = 0;
		},
		handleRefreshAfterPopup() {
			window.location.reload();
		},
	},
	computed: {
		minutes() {
			return Math.floor(this.elapsedTime / 60)
				.toString()
				.padStart(2, "0");
		},
		seconds() {
			return (this.elapsedTime % 60).toString().padStart(2, "0");
		},
	},
};
</script>

<style scoped>
.content-box {
    background-color: #362e5f;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 800px;
    margin: auto;
}

.button-match-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh; /* Changed to min-height */
    padding: 10px; /* Added padding */
}

.button-match-header {
    color: #9510d8;
    text-align: center; /* Center the headers */
    margin: 10px 0; /* Added margin */
}

.button-match {
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 90%; /* Adjusted width for responsiveness */
    margin: 10px; /* Added margin */
}

.grid-row {
    display: flex;
    justify-content: center; /* Center buttons in row */
    flex-wrap: wrap; /* Wrap buttons for smaller screens */
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
    margin: 2px; /* Reduced margin */
    box-shadow: 1px 2px 4px rgba(1, 1, 0, 0.6);
}

.button:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(2px);
}

.timer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2b00ff;
    color: rgb(255, 255, 20);
    font-family: "Courier New", Courier, monospace;
    font-size: 24px;
    letter-spacing: 3px;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    width: 100px;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.1);
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
    max-width: 90%;
    text-align: center;
}

.popup button {
    margin-top: 10px;
    padding: 5px 15px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #9510d8;
    color: white;
}

@keyframes blink {
    0%, 49% {
        opacity: 1;
    }
    50%, 100% {
        opacity: 0;
    }
}

.blinking {
    animation: blink 1s infinite;
}

/* Media Queries for different screen sizes */
@media (max-width: 768px) {
    .button-match {
        width: 95%; /* Increase width for smaller screens */
    }

    .button {
        width: 25px; /* Adjust button size */
        height: 25px;
    }

    .timer, .popup button {
        font-size: 20px; /* Adjust font size for readability */
    }
}

@media (max-width: 480px) {
    .grid-row {
        flex-direction: column; /* Stack buttons vertically on very small screens */
    }
}
</style>

