let positionX = 0;
let positionY = 0;

let foodPositionX = Math.floor(Math.random() * 40);
let foodPositionY = Math.floor(Math.random() * 40);

const snake = document.getElementById('snake');
const food = document.getElementById('food');

food.style.transform = `translate(${foodPositionX}rem, ${foodPositionY}rem)`;

document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowRight' || e.key === 'd') {
		// console.log('Move Right');
		snake.style.transform = `translate(${positionX === 39 ? 0 : positionX + 1}rem, ${positionY}rem)`;
		positionX = positionX === 39 ? 0 : positionX + 1;
	} else if (e.key === 'ArrowLeft' || e.key === 'a') {
		// console.log('Move Left');
		snake.style.transform = `translate(${positionX === 0 ? 39 : positionX - 1}rem, ${positionY}rem)`;
		positionX = positionX === 0 ? 39 : positionX - 1;
	} else if (e.key === 'ArrowUp' || e.key === 'w') {
		// console.log('Move Up');
		snake.style.transform = `translate(${positionX}rem, ${positionY === 0 ? 39 : positionY - 1}rem)`;
		positionY = positionY === 0 ? 39 : positionY - 1;
	} else if (e.key === 'ArrowDown' || e.key === 's') {
		// console.log('Move Down');
		snake.style.transform = `translate(${positionX}rem, ${positionY === 39 ? 0 : positionY + 1}rem)`;
		positionY = positionY === 39 ? 0 : positionY + 1;
	}
});
