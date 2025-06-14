import { getRandomInt, secToClock } from "./utils.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
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
let clock;
let intervalId;
let time = {
    min: undefined,
    sec: undefined,
};

class Clock {
    clock = {
        min: undefined,
        sec: undefined,
    };

    constructor(x, y, fontSize, font, color, strokeColor, time) {
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.font = font;
        this.color = color;
        this.strokeColor = strokeColor;
        this.time = time;
    }

    createClock(clockTime) {
        ctx.font = `${this.fontSize}px ${this.font}`;
        ctx.fillStyle = this.color;
        ctx.fillText(clockTime, this.x, this.y);
        ctx.strokeStyle = this.strokeColor;
        ctx.strokeText(clockTime, this.x, this.y);
    }

    startTimer() {
        intervalId = setInterval(() => {
            this.time -= 1;
            this.clock.min = secToClock(this.time).minutes;
            this.clock.sec = secToClock(this.time).seconds;
            let formattedMinutes = String(this.clock.min).padStart(2, "0");
            let formattedSeconds = String(this.clock.sec).padStart(2, "0");
            time.min = formattedMinutes;
            time.sec = formattedSeconds;
        }, 1000);
        this.stopTimer();
    }

    stopTimer() {
        setTimeout(() => {
            clearInterval(intervalId);
        }, this.time * 1000);
    }
}

class Sprite {
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Check if position inside game area
const insideGameArea = (x, y) => {
    if ((x > gameArea.x || x < gameArea.x + gameAreaWidth) && (y > gameArea.y || y < gameArea.y + gameAreaHeight)) return true;
};

// Check if position outside game area
const outsidePlayerRange = (x, y) => {
    if ((x < player.x || x > player.x + playerWidth) && (y < player.y || y > player.y + playerHeight)) return true;
};

// Generate random food positions
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

// Pause Game
const pauseGame = () => {
    clearInterval(intervalId);
};
// Resume Game
const resumeGame = () => {
    clock.startTimer();
}

const init = () => {
    // Time reset
    clearInterval(intervalId);
    time = {
        min: "00",
        sec: "30",
    };

    // Initialize everything
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

    gameArea = new Sprite(gameAreaX, gameAreaY, gameAreaWidth, gameAreaHeight, 0, 0, gameAreaColor);
    player = new Sprite(playerX, playerY, playerWidth, playerHeight, (playerWidth + playerHeight) / 2, (playerWidth + playerHeight) / 2, playerColor);

    foodArray = [];
    for (let i = 0; i < 20; i++) {
        foodWidth = playerWidth / 4;
        foodHeight = playerWidth / 4;
        let randomPos = randomFoodPosition();
        let foodColor = "white";

        foodArray.push(new Sprite(randomPos.x, randomPos.y, foodWidth, foodHeight, 0, 0, foodColor));
    }

    // Create clock and start timer
    clock = new Clock(gameAreaX, gameAreaY - gameAreaWidth / 32, gameAreaWidth / 16, "Helvetica", "green", "green", 30);
    clock.startTimer();
};

// Call init()
init();

// Event listener for player movements
// On keydown simultaneously check if player is colliding with the wall or not
// if not then only add the speed to player's position
window.addEventListener("keydown", (e) => {
    if ((e.key == "d" || e.key == "ArrowRight") && !isCollidingWithWall(player, "right")) player.x += player.speedX;
    else if ((e.key == "s" || e.key == "ArrowDown") && !isCollidingWithWall(player, "bottom")) player.y += player.speedY;
    else if ((e.key == "a" || e.key == "ArrowLeft") && !isCollidingWithWall(player, "left")) player.x -= player.speedX;
    else if ((e.key == "w" || e.key == "ArrowUp") && !isCollidingWithWall(player, "top")) player.y -= player.speedY;
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
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    gameArea.createSprite();
    player.createSprite();
    foodArray.forEach((food) => {
        food.createSprite();
    });

    foodCollisionResolution();
    clock.createClock(`${time.min}:${time.sec}`);
};
// Call animate()
animate();
