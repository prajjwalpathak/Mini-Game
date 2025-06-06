const man = document.getElementById("man");
const food = document.getElementById("food");
const timeBar = document.getElementById("time-bar");
const score = document.getElementById("score");

let manPositionX = 19;
let manPositionY = 19;

const randomNumber = (num) => {
	return Math.floor(Math.random() * num);
};

let foodPositionX = randomNumber(40);
let foodPositionY = randomNumber(40);

let currentScore = 0;
let resetTimeout;
let movement;
let checkCollision;

const foodGeneration = () => {
	food.style.transform = `translate(${foodPositionX}rem, ${foodPositionY}rem)`;
};

const foodGenerationOnCollision = () => {
	foodPositionX = randomNumber(40);
	foodPositionY = randomNumber(40);
	foodGeneration();
};

const changeScore = () => {
	if (currentScore < 10) {
		score.innerText = `0${currentScore}`;
	} else {
		score.innerText = `${currentScore}`;
	}
};

const declareScore = () => {
	setTimeout(() => {
		document.getElementById("end-screen").style.display = "flex";
		document.getElementById("final-score").innerText =
			currentScore < 10 ? `0${currentScore}` : `${currentScore}`;
	}, 10);
};

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
	// document.getElementById("main-screen").style.display = "none";
	document.getElementById("end-screen").style.display = "none";
	foodPositionX = randomNumber(40);
	foodPositionY = randomNumber(40);
	foodGeneration();
	man.style.transform = `translate(19rem,19rem)`;
	manPositionX = 19;
	manPositionY = 19;
	currentScore = 0;
	changeScore();
	timeBar.classList.add("start-time");

	resetTimeout = setTimeout(() => {
		timeBar.classList.remove("start-time");
		declareScore();
		clearTimeout(resetTimeout);
		document.removeEventListener("keydown", movement);
		document.removeEventListener("keydown", checkCollision);
	}, 60000);

	checkCollision = () => {
		let manBCR = man.getBoundingClientRect();
		let foodBCR = food.getBoundingClientRect();
		if (
			manBCR.left === foodBCR.left &&
			manBCR.right === foodBCR.right &&
			manBCR.top === foodBCR.top &&
			manBCR.bottom === foodBCR.bottom
		) {
			currentScore = currentScore + 1;
			changeScore();
			foodGenerationOnCollision();
		}
	};

	movement = (event) => {
		if (event.key === "ArrowRight" || event.key === "d") {
			man.style.transform = `translate(${manPositionX === 39 ? 0 : manPositionX + 1
				}rem, ${manPositionY}rem)`;
			manPositionX = manPositionX === 39 ? 0 : manPositionX + 1;
		} else if (event.key === "ArrowLeft" || event.key === "a") {
			man.style.transform = `translate(${manPositionX === 0 ? 39 : manPositionX - 1
				}rem, ${manPositionY}rem)`;
			manPositionX = manPositionX === 0 ? 39 : manPositionX - 1;
		} else if (event.key === "ArrowUp" || event.key === "w") {
			man.style.transform = `translate(${manPositionX}rem, ${manPositionY === 0 ? 39 : manPositionY - 1
				}rem)`;
			manPositionY = manPositionY === 0 ? 39 : manPositionY - 1;
		} else if (event.key === "ArrowDown" || event.key === "s") {
			man.style.transform = `translate(${manPositionX}rem, ${manPositionY === 39 ? 0 : manPositionY + 1
				}rem)`;
			manPositionY = manPositionY === 39 ? 0 : manPositionY + 1;
		}
	};

	document.addEventListener("keydown", movement);
	document.addEventListener("keydown", checkCollision);
};

// const pauseGame = () => {
// 	timeBar.classList.remove('start-time');
// };

const quitGame = () => {
	timeBar.classList.remove("start-time");
	declareScore();
	clearTimeout(resetTimeout);
	document.removeEventListener("keydown", movement);
	document.removeEventListener("keydown", checkCollision);
};

/* To do:
-> Add timer
-> Pause Game
-> CSS changes */
