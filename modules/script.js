import { getRandomInt, secToClock } from "./utils.js";

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

// Game Area
let gameArea;
let gameAreaX;
let gameAreaY;
let gameAreaWidth;
let gameAreaHeight;
let gameAreaColor;

// Player
let player;
let playerWidth;
let playerHeight;
let playerX;
let playerY;
let playerColor;

// Food
let foodArray = [];
let foodWidth;
let foodHeight;

// Time
let clock = {
    min: 0,
    sec: 0,
};

// Interval Id for timer
let time = 60;
let intervalId;

class sprite {
    constructor(x, y, width, height, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }
    createSprite() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
}

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

// Check if position inside game area
const insideGameArea = (x, y) => {
    if ((x > gameArea.x || x < gameArea.x + gameAreaWidth) && (y > gameArea.y || y < gameArea.y + gameAreaHeight)) return true;
};

// Check if position outside game area
const outsidePlayerRange = (x, y) => {
    if ((x < player.x || x > player.x + playerWidth) && (y < player.y || y > player.y + playerHeight)) return true;
};

const randomFoodPosition = () => {
    let pos = { x: undefined, y: undefined };
    pos.x = gameAreaX + playerWidth * (getRandomInt(1, 16) - 1) + playerWidth / 2 - foodWidth / 2;
    pos.y = gameAreaY + playerHeight * (getRandomInt(1, 16) - 1) + playerHeight / 2 - foodHeight / 2;
    while (!insideGameArea(pos.x, pos.y) && !outsidePlayerRange(pos.x, pos.y)) {
        pos.x = gameAreaX + playerWidth * (getRandomInt(1, 16) - 1) + playerWidth / 2 - foodWidth / 2;
        pos.y = gameAreaY + playerHeight * (getRandomInt(1, 16) - 1) + playerHeight / 2 - foodHeight / 2;
    }
    return pos;
};

const init = () => {
    gameAreaX = window.innerWidth / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2;
    gameAreaY = window.innerHeight / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2;
    gameAreaWidth = Math.min(window.innerHeight, window.innerWidth) * 0.8;
    gameAreaHeight = Math.min(window.innerHeight, window.innerWidth) * 0.8;
    gameAreaColor = "#111111";

    playerWidth = gameAreaWidth / 16;
    playerHeight = gameAreaHeight / 16;
    playerX = gameAreaX + gameAreaWidth / 2;
    playerY = gameAreaY + gameAreaHeight / 2;
    playerColor = "#FFFF00";

    gameArea = new sprite(gameAreaX, gameAreaY, gameAreaWidth, gameAreaHeight, 0, 0, gameAreaColor);
    player = new sprite(playerX, playerY, playerWidth, playerHeight, (playerWidth + playerHeight) / 2, (playerWidth + playerHeight) / 2, playerColor);

    foodArray = [];
    for (let i = 0; i < 20; i++) {
        foodWidth = playerWidth / 4;
        foodHeight = playerWidth / 4;
        let randomPos = randomFoodPosition();
        let foodColor = "white";

        foodArray.push(new sprite(randomPos.x, randomPos.y, foodWidth, foodHeight, 0, 0, foodColor));
    }
};

// Call init()
init();

// Event listener for player movements
// On keydown simultaneously check if player is colliding with the wall or not
// if not then only add the speed to player's position
window.addEventListener("keydown", (e) => {
    if (e.key == "d" && !isCollidingWithWall(player, "right")) {
        player.x += player.speedX;
    } else if (e.key == "s" && !isCollidingWithWall(player, "bottom")) {
        player.y += player.speedY;
    } else if (e.key == "a" && !isCollidingWithWall(player, "left")) {
        player.x -= player.speedX;
    } else if (e.key == "w" && !isCollidingWithWall(player, "top")) {
        player.y -= player.speedY;
    }
});

// Collision Detection with walls
// Added 1px for correction - Not pixel perfect
const isCollidingWithWall = (sprite, wall) => {
    if (wall === "right") {
        if (sprite.x + 1 >= gameArea.x + gameArea.width - sprite.width) return true;
    } else if (wall === "bottom") {
        if (sprite.y + 1 >= gameArea.y + gameArea.height - sprite.height) return true;
    } else if (wall === "left") {
        if (sprite.x <= gameArea.x + 1) return true;
    } else if (wall === "top") {
        if (sprite.y <= gameArea.y + 1) return true;
    }
    return false;
};

// Collision detection with food
const isCollidingWithFood = (sprite, food) => {
    if (sprite.x <= food.x && sprite.x + playerWidth >= food.x && sprite.y <= food.y && sprite.y + playerHeight >= food.y) return true;
    return false;
};

// Remove food after collision
const foodCollisionResolution = () => {
    // Loop to remove food eaten
    foodArray.forEach((food) => {
        let index = foodArray.indexOf(food); // index of the food in foodArray
        isCollidingWithFood(player, food) ? foodArray.splice(index, 1) : true; // remove food from foodArray
    });
};

// Animate function
const animate = () => {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    gameArea.createSprite();
    player.createSprite();
    foodArray.forEach((food) => {
        food.createSprite();
    });

    foodCollisionResolution();
};
// Call animate()
animate();
