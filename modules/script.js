const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas everytime the window is resized
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

let gameArea = {
	x: 100,
	y: 100,
	width: Math.min(window.innerHeight, window.innerWidth) * 0.8,
	height: Math.min(window.innerHeight, window.innerWidth) * 0.8,
}
c.beginPath();
c.fillRect(gameArea.x, gameArea.y, gameArea.length, gameArea.length);
c.fillStyle = 'black';
c.stroke();



// Player dimensions
let side = 32;
let player = {
	length: side,
	x: gameArea.width / 2 - side / 2,
	y: gameArea.height / 2 - side / 2,
};

// Event listener for Player movements
window.addEventListener("keydown", (e) => {
	if (e.key == "d") player.x += side;
	else if (e.key == "s") player.y += side;
	else if (e.key == "a") player.x -= side;
	else if (e.key == "w") player.y -= side;
});

const createSprite = (sprite) => {
	c.beginPath();
	c.fillRect(sprite.x, sprite.y, sprite.length, sprite.length);
	c.fill();
	c.stroke();
};

// const init = () => {
// 	initGameArea();
// };

// Call init()
// init();

// Animate function
const animate = () => {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, window.innerWidth, window.innerHeight);
	// initGameArea();
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
