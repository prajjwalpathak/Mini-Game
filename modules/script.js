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

class sprite {
	constructor(x, y, width, height, speed, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.color = color;
	}
	createSprite() {
		c.fillStyle = this.color;
		c.fillRect(this.x, this.y, this.width, this.height);
	}
}

let gameArea;
let player;

let gameAreaX;
let gameAreaY;
let gameAreaWidth;
let gameAreaHeight;
let gameAreaColor;

let playerWidth;
let playerHeight;
let playerX;
let playerY;
let playerColor;

const init = () => {
	gameAreaX = window.innerWidth / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2;
	gameAreaY = window.innerHeight / 2 - Math.min(window.innerHeight, window.innerWidth) * 0.8 / 2;
	gameAreaWidth = Math.min(window.innerHeight, window.innerWidth) * 0.8;
	gameAreaHeight = Math.min(window.innerHeight, window.innerWidth) * 0.8;
	gameAreaColor = '#111111';

	playerWidth = gameAreaWidth / 16;
	playerHeight = gameAreaHeight / 16;
	playerX = gameAreaX + gameAreaWidth / 2;
	playerY = gameAreaY + gameAreaHeight / 2;
	playerColor = '#FFFF00';

	gameArea = new sprite(gameAreaX, gameAreaY, gameAreaWidth, gameAreaHeight, 0, gameAreaColor);
	player = new sprite(playerX, playerY, playerWidth, playerHeight, (playerWidth + playerHeight) / 2, playerColor);
	gameArea.createSprite();
	player.createSprite();
};

// Call init()
init();

// Event listener for player movements
// On keydown simultaneously check if player is colliding with the wall or not
// if not then only add the speed to player's position
window.addEventListener("keydown", (e) => {
	if (e.key == "d" && !isCollidingWithWall(player, 'right')) {
		player.x += player.speed;
	}
	else if (e.key == "s" && !isCollidingWithWall(player, 'bottom')) {
		player.y += player.speed;
	}
	else if (e.key == "a" && !isCollidingWithWall(player, 'left')) {
		player.x -= player.speed;
	}
	else if (e.key == "w" && !isCollidingWithWall(player, 'top')) {
		player.y -= player.speed;
	}
});

// Collision Detection with walls
// Added 1px for correction - Not pixel perfect
const isCollidingWithWall = (sprite, wall) => {
	if (wall === 'right') {
		if (sprite.x + 1 >= gameArea.x + gameArea.width - sprite.width) return true;
	}
	else if (wall === 'bottom') {
		if (sprite.y + 1 >= gameArea.y + gameArea.height - sprite.height) return true;
	}
	else if (wall === 'left') {
		if (sprite.x <= gameArea.x + 1) return true; 
	}
	else if (wall === 'top') {
		if (sprite.y <= gameArea.y + 1) return true;
	}
	return false;
}


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
