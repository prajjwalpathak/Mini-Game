const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas everytime the window is resized
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init();
});

// Play area
let gameArea;

// Player dimensions
let player;
let playerDimensions = {
	width: 32,
	height: 32,
};

// Event listener for Player movements
window.addEventListener("keydown", (e) => {
	if (e.key == "d") player.x += playerDimensions.width;
	else if (e.key == "s") player.y += playerDimensions.height;
	else if (e.key == "a") player.x -= playerDimensions.width;
	else if (e.key == "w") player.y -= playerDimensions.height;
});

const drawGameArea = (area) => {
	c.fillStyle = area.color;
	c.fillRect(area.x, area.y, area.width, area.height);
}

const createSprite = (sprite) => {
	c.fillStyle = sprite.color;
	c.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
};

const init = () => {
	gameArea = {
		x: window.innerWidth / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2,
		y: window.innerHeight / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2,
		width: Math.min(window.innerHeight, window.innerWidth) * 0.8,
		height: Math.min(window.innerHeight, window.innerWidth) * 0.8,
		color: 'black',
	}
	player = {
		x: gameArea.width / 2 - playerDimensions.width / 2,
		y: gameArea.height / 2 - playerDimensions.height / 2,
		width: playerDimensions.width,
		height: playerDimensions.height,
		color: 'FFFF00'
	};
	drawGameArea(gameArea);
	createSprite(player)
};

// Call init()
init();

// Animate function
const animate = () => {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, window.innerWidth, window.innerHeight);
	drawGameArea(gameArea);
	createSprite(player);
};

// Call animate()
animate();

// Time
let clock = {
	min: 0,
	sec: 0,
};

// Convert seconds to minutes and seconds
const secToClock = (sec) => {
	const minutes = Math.floor((sec % 3600) / 60);
	const seconds = sec % 60;
	return { minutes, seconds };
};

// Interval Id for timer
let time = 60;
let intervalId;

// Clear the interval Id for timer
const stopTimer = () => {
	setTimeout(() => {
		clearInterval(intervalId);
	}, 60000);
};

// Countdown Timer
const startTimer = () => {
	intervalId = setInterval(() => {
		time -= 1;
		clock.min = secToClock(time).minutes;
		clock.sec = secToClock(time).seconds;
		let formattedMinutes = String(clock.min).padStart(2, "0");
		let formattedSeconds = String(clock.sec).padStart(2, "0");
		console.log(`${formattedMinutes}:${formattedSeconds}`);
	}, 1000);
	stopTimer();
};

const startGame = () => {
	startTimer();
};
