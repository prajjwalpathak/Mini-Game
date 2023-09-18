const snake = document.getElementById('snake');
const food = document.getElementById('food');

snake.style.transform = `translate(19rem,19rem)`;
let snakePositionX = 19;
let snakePositionY = 19;

let foodPositionX = Math.floor(Math.random() * 40);
let foodPositionY = Math.floor(Math.random() * 40);

const foodGeneration = () => {
	food.style.transform = `translate(${foodPositionX}rem, ${foodPositionY}rem)`;
};

const foodGenerationOnCollision = () => {
	foodPositionX = Math.floor(Math.random() * 40);
	foodPositionY = Math.floor(Math.random() * 40);
	foodGeneration();
};

const checkCollision = () => {
	let snakeBCR = snake.getBoundingClientRect();
	let foodBCR = food.getBoundingClientRect();
	if (snakeBCR.left === foodBCR.left && snakeBCR.right === foodBCR.right && snakeBCR.top === foodBCR.top && snakeBCR.bottom === foodBCR.bottom) {
		foodGenerationOnCollision();
	}
};

document.addEventListener('load', foodGeneration());

document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowRight' || e.key === 'd') {
		// console.log('Move Right');
		snake.style.transform = `translate(${snakePositionX === 39 ? 0 : snakePositionX + 1}rem, ${snakePositionY}rem)`;
		snakePositionX = snakePositionX === 39 ? 0 : snakePositionX + 1;
	} else if (e.key === 'ArrowLeft' || e.key === 'a') {
		// console.log('Move Left');
		snake.style.transform = `translate(${snakePositionX === 0 ? 39 : snakePositionX - 1}rem, ${snakePositionY}rem)`;
		snakePositionX = snakePositionX === 0 ? 39 : snakePositionX - 1;
	} else if (e.key === 'ArrowUp' || e.key === 'w') {
		// console.log('Move Up');
		snake.style.transform = `translate(${snakePositionX}rem, ${snakePositionY === 0 ? 39 : snakePositionY - 1}rem)`;
		snakePositionY = snakePositionY === 0 ? 39 : snakePositionY - 1;
	} else if (e.key === 'ArrowDown' || e.key === 's') {
		// console.log('Move Down');
		snake.style.transform = `translate(${snakePositionX}rem, ${snakePositionY === 39 ? 0 : snakePositionY + 1}rem)`;
		snakePositionY = snakePositionY === 39 ? 0 : snakePositionY + 1;
	}
});

document.addEventListener('keydown', (e) => {
	checkCollision();
});
