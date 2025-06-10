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

// const createSprite = (x, y, width, height, color) => {
// 	c.fillStyle = color;
// 	c.fillRect(x, y, width, height);
// }

class sprite {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}
	createSprite() {
		c.fillStyle = this.color;
		c.fillRect(this.x, this.y, this.width, this.height);
	}
	moveSprite() {

	}
}

let gameArea;
let player;

let gameAreaX = window.innerWidth / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2;
let gameAreaY = window.innerHeight / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2;
let gameAreaWidth = Math.min(window.innerHeight, window.innerWidth) * 0.8;
let gameAreaHeight = Math.min(window.innerHeight, window.innerWidth) * 0.8;
let gameAreaColor = '#111111';

let playerWidth = gameAreaWidth / 10;
let playerHeight = gameAreaHeight / 10;
let playerX = gameAreaWidth / 2 - playerWidth / 2;
let playerY = gameAreaHeight / 2 - playerHeight / 2;
let playerColor = '#FFFF00';

const init = () => {
	gameAreaX = window.innerWidth / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2;
	gameAreaY = window.innerHeight / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2;
	gameAreaWidth = Math.min(window.innerHeight, window.innerWidth) * 0.8;
	gameAreaHeight = Math.min(window.innerHeight, window.innerWidth) * 0.8;
	gameAreaColor = '#111111';

	playerWidth = gameAreaWidth / 16;
	playerHeight = gameAreaHeight / 16;
	playerX = gameAreaX;
	playerY = gameAreaY;
	playerColor = '#FFFF00';

	gameArea = new sprite(gameAreaX, gameAreaY, gameAreaWidth, gameAreaHeight, gameAreaColor);
	player = new sprite(playerX, playerY, playerWidth, playerHeight, playerColor);
	gameArea.createSprite();
	player.createSprite();
};

// Call init()
init();

// Event listener for Player movements
window.addEventListener("keydown", (e) => {
	if (e.key == "d") player.x += player.width;
	else if (e.key == "s") player.y += player.height;
	else if (e.key == "a") player.x -= player.width;
	else if (e.key == "w") player.y -= player.height;
});

// Animate function
const animate = () => {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, window.innerWidth, window.innerHeight);
	gameArea.createSprite();
	player.createSprite();
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
