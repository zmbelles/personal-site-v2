<template>
	<title>Games</title>
	<div class="game-page">
		<div class="game-card">
			<h2><router-link to="/games/match">Button Match</router-link></h2>
			<p>
				A fun and challenging matching game where you need to find
				matching buttons.
			</p>
		</div>
		<br /><br />
		<div class="game-card">
			<h2>
				<router-link to="/games/tic-tac-toe"
					>Hyper Tic-Tac-Toe</router-link
				>
			</h2>
			<p>
				Challenge the computer to a 9x9 game of Tic-Tac-Toe. More
				Strategy than it seems!
			</p>
		</div>
		<br /><br />
		<div class="game-card">
			<!-- <h2><router-link to="/games/battleship">BattleShip</router-link></h2> -->
			<h2 class="coming-soon">BattleShip (coming soon)</h2>
			<p>
				Take turns to outsmart your opponent by guessing the location of
				the enemy's fleet, aiming to be the first to sink all opposing
				ships.
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "GamePage",
};
</script>

<style scoped>
.game-page {
	display: flex;
	flex-direction: column;
	justify-content: center;
  max-height: 100vh;
	align-items: center;
	background-color: #181825;
	min-height: 56vh; /* Changed to min-height for flexibility */
	padding: 2%; /* Relative unit */
}

.game-card {
	background-color: #362e5f;
	padding: 1%; /* Relative unit */
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: box-shadow 0.3s ease;
	text-align: center;
	max-width: 50vh;
	width: 80%; /* Adjust width to be relative */
	margin-bottom: 2%; /* Added margin between cards */
}

.game-card h2 {
	font-size: 1.5rem; /* Relative unit */
	color: #181825;
}

.coming-soon h2 {
	color: #2d2d41;
}

.game-card p {
	color: #bfa8cd;
}

/* Media Queries for different screen sizes */
@media (max-width: 768px) {
	.game-card {
		width: 95%; /* Increase width for smaller screens */
	}
}

@media (max-width: 480px) {
	.game-card {
		padding: 5%; /* Increase padding for very small screens */
		max-width: none;
	}
	.game-card h2 {
		font-size: 1.2rem; /* Adjust font size for small screens */
	}
}
</style>
