const man = document.getElementById('man');
const food = document.getElementById('food');
// const obstacle1 = document.getElementById('obstacle1');
// const obstacle2 = document.getElementById('obstacle2');
// const obstacle3 = document.getElementById('obstacle3');
const timeBar = document.getElementById('time-bar');
const score = document.getElementById('score');

man.style.transform = `translate(19rem,19rem)`;
let manPositionX = 19;
let manPositionY = 19;

let foodPositionX = Math.floor(Math.random() * 40);
let foodPositionY = Math.floor(Math.random() * 40);

let currentScore = 0;
let finalScore = 0;

const foodGeneration = () => {
	food.style.transform = `translate(${foodPositionX}rem, ${foodPositionY}rem)`;
};

const foodGenerationOnCollision = () => {
	foodPositionX = Math.floor(Math.random() * 40);
	foodPositionY = Math.floor(Math.random() * 40);
	foodGeneration();
};

const changeScore = () => {
	if (currentScore < 9) {
		score.innerText = `0${currentScore}`;
	} else {
		score.innerText = `${currentScore}`;
	}
};

const declareScore = () => {
	setTimeout(() => {
		document.getElementById('end-screen').style.display = 'flex';
		document.getElementById('final-score').innerText = finalScore < 9 ? `0${finalScore}` : `${finalScore}`;
	}, 10);
};

//Start Timer
const resetTimeout = setTimeout(() => {
	quitGame();
}, 60000);

const startGame = () => {
	document.getElementById('main-screen').style.display = 'none';
	document.getElementById('end-screen').style.display = 'none';
	//Start Game

	timeBar.classList.add('start-time');

	changeScore();

	const checkCollision = () => {
		let manBCR = man.getBoundingClientRect();
		let foodBCR = food.getBoundingClientRect();
		if (manBCR.left === foodBCR.left && manBCR.right === foodBCR.right && manBCR.top === foodBCR.top && manBCR.bottom === foodBCR.bottom) {
			currentScore = currentScore + 1;
			changeScore();
			foodGenerationOnCollision();
		}
	};

	document.addEventListener('load', foodGeneration());

	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowRight' || e.key === 'd') {
			// console.log('Move Right');
			man.style.transform = `translate(${manPositionX === 39 ? 0 : manPositionX + 1}rem, ${manPositionY}rem)`;
			manPositionX = manPositionX === 39 ? 0 : manPositionX + 1;
		} else if (e.key === 'ArrowLeft' || e.key === 'a') {
			// console.log('Move Left');
			man.style.transform = `translate(${manPositionX === 0 ? 39 : manPositionX - 1}rem, ${manPositionY}rem)`;
			manPositionX = manPositionX === 0 ? 39 : manPositionX - 1;
		} else if (e.key === 'ArrowUp' || e.key === 'w') {
			// console.log('Move Up');
			man.style.transform = `translate(${manPositionX}rem, ${manPositionY === 0 ? 39 : manPositionY - 1}rem)`;
			manPositionY = manPositionY === 0 ? 39 : manPositionY - 1;
		} else if (e.key === 'ArrowDown' || e.key === 's') {
			// console.log('Move Down');
			man.style.transform = `translate(${manPositionX}rem, ${manPositionY === 39 ? 0 : manPositionY + 1}rem)`;
			manPositionY = manPositionY === 39 ? 0 : manPositionY + 1;
		}
	});

	document.addEventListener('keydown', (e) => {
		checkCollision();
	});
};

const quitGame = () => {
	clearTimeout(resetTimeout);
	finalScore = currentScore;
	currentScore = 0;
	changeScore();
	timeBar.classList.remove('start-time');
	man.style.transform = `translate(19rem,19rem)`;
	manPositionX = 19;
	manPositionY = 19;
	declareScore();
};
