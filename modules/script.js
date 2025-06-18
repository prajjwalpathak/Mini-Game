import { getRandomInt, secToClock, insideArea } from "./utils.js";

const foodAudio = document.getElementById("food-audio");
const gameStartAudio = document.getElementById("game-start-audio");
const gameOverAudio = document.getElementById("game-over-audio");

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
let gameOver = false;
let gameArea;
let gameAreaX;
let gameAreaY;
let gameAreaWidth;
let gameAreaHeight;
let gameAreaColor;

// Player
let playerMove = false;
let player;
let playerWidth;
let playerHeight;
let playerRandomGridX;
let playerRandomGridY;
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
let timeOutId;
let time = {
    min: undefined,
    sec: undefined,
};
let startFlag = false;
let pauseFlag = false;
let playGameOverAudio = true;
let audioTimeOut;

// Score
let score;

// Buttons
const slotX = () => window.innerWidth / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2;
const slotY = () => window.innerHeight / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2 + Math.min(window.innerHeight, window.innerWidth) * 0.8 + canvas.height / 64;
const buttonHeight = () => (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 16;
const buttonWidth = () => buttonHeight() * 4;
let startButton;
let pauseButton;
let resumeButton;
let restartButton;
let slot1 = {
    x: undefined,
    y: undefined,
};
let slot2 = {
    x: undefined,
    y: undefined,
};
let slot3 = {
    x: undefined,
    y: undefined,
};
let slot4 = {
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined,
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
        timeOutId = setTimeout(() => {
            gameOver = true;
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

class Button {
    width = buttonWidth();
    height = buttonHeight();
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    }
    createButton() {
        ctx.fillStyle = "White";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.font = `bold ${this.height / 2}px Helvetica`;
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.x + this.height / 2, this.y + this.height / 1.5);
    }
}

// // Check if position inside game area
// const insideGameArea = (x, y) => {
//     if ((x > gameArea.x || x < gameArea.x + gameAreaWidth) && (y > gameArea.y || y < gameArea.y + gameAreaHeight)) return true;
// };

// // Check if position outside game area
// const outsidePlayerRange = (x, y) => {
//     if (x < player.x || x > player.x + playerWidth || y < player.y || y > player.y + playerHeight) return true;
// };

// Generate random food positions
const randomFoodPosition = (posX, posY) => {
    let pos = { x: undefined, y: undefined };
    let foodRandomGridX = getRandomInt(0, 16);
    let foodRandomGridY = getRandomInt(0, 16);
    pos.x = gameAreaX + playerWidth * foodRandomGridX + playerWidth / 2 - foodWidth / 2;
    pos.y = gameAreaY + playerHeight * foodRandomGridY + playerHeight / 2 - foodHeight / 2;

    if (foodRandomGridX !== posX || foodRandomGridY !== posY) return pos;
    else {
        while (foodRandomGridX === posX && foodRandomGridY === posY) {
            foodRandomGridX = getRandomInt(0, 16);
            foodRandomGridY = getRandomInt(0, 16);
            pos.x = gameAreaX + playerWidth * getRandomInt(0, 16) + playerWidth / 2 - foodWidth / 2;
            pos.y = gameAreaY + playerHeight * getRandomInt(0, 16) + playerHeight / 2 - foodHeight / 2;
        }
    }
    return pos;
};

// Start Game
const startGame = () => {
    if (!startFlag) {
        gameStartAudio.play();
        clock.startTimer();
        startFlag = true;
        playerMove = true;
        playGameOverAudio = true;
    }
};

// Pause Game
const pauseGame = () => {
    if (startFlag) {
        clearInterval(intervalId);
        clearTimeout(timeOutId);
        player.speedX = 0;
        player.speedY = 0;
        pauseFlag = true;
        playerMove = false;
    }
};
// Resume Game
const resumeGame = () => {
    if (pauseFlag) {
        clock.startTimer();
        player.speedX = (playerWidth + playerHeight) / 2;
        player.speedY = (playerWidth + playerHeight) / 2;
        pauseFlag = false;
        playerMove = true;
    }
};

const init = () => {
    // Reset Game
    startFlag = false;
    gameOver = false;
    playerMove = false;
    pauseFlag = false;
    playGameOverAudio = true;

    // Time reset
    clearInterval(intervalId);
    time = {
        min: "00",
        sec: "30",
    };
    clearTimeout(audioTimeOut);

    // Score reset
    score = 0;

    // Initialize everything
    gameAreaX = window.innerWidth / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2;
    gameAreaY = window.innerHeight / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2;
    gameAreaWidth = Math.min(window.innerHeight, window.innerWidth) * 0.8;
    gameAreaHeight = Math.min(window.innerHeight, window.innerWidth) * 0.8;
    gameAreaColor = "#111111";

    playerRandomGridX = getRandomInt(0, 16);
    playerRandomGridY = getRandomInt(0, 16);
    playerWidth = gameAreaWidth / 16;
    playerHeight = gameAreaHeight / 16;
    playerX = gameAreaX + playerWidth * playerRandomGridX;
    playerY = gameAreaY + playerHeight * playerRandomGridY;
    playerColor = "#FFFF00";

    gameArea = new Sprite(gameAreaX, gameAreaY, gameAreaWidth, gameAreaHeight, 0, 0, gameAreaColor);
    player = new Sprite(playerX, playerY, playerWidth, playerHeight, (playerWidth + playerHeight) / 2, (playerWidth + playerHeight) / 2, playerColor);

    foodArray = [];
    for (let i = 0; i < 20; i++) {
        foodWidth = playerWidth / 4;
        foodHeight = playerWidth / 4;
        let randomPos = randomFoodPosition(playerRandomGridX, playerRandomGridY);
        let foodColor = "white";

        foodArray.push(new Sprite(randomPos.x, randomPos.y, foodWidth, foodHeight, 0, 0, foodColor));
    }

    slot1 = {
        x: slotX(),
        y: slotY(),
    };
    slot2 = {
        x: slotX() + buttonWidth() + buttonHeight(),
        y: slotY(),
    };
    slot3 = {
        x: slotX() + buttonWidth() * 2 + buttonHeight() * 2,
        y: slotY(),
    };

    // Create clock and start timer
    clock = new Clock(gameAreaX, gameAreaY - gameAreaWidth / 32, gameAreaWidth / 16, "Helvetica", "green", "green", 30);

    // Start Game Button
    startButton = new Button(slot1.x, slot1.y, "Start");

    // Pause Game Button
    pauseButton = new Button(slot2.x, slot2.y, "Pause");

    // Resume Game Button
    resumeButton = new Button(slot3.x, slot3.y, "Resume");
};

// Call init()
init();

// Event listener for player movements
// On keydown simultaneously check if player is colliding with the wall or not
// if not then only add the speed to player's position
window.addEventListener("keydown", (e) => {
    if ((e.key == "d" || e.key == "ArrowRight") && !isCollidingWithWall(player, "right") && playerMove) player.x += player.speedX;
    else if ((e.key == "s" || e.key == "ArrowDown") && !isCollidingWithWall(player, "bottom") && playerMove) player.y += player.speedY;
    else if ((e.key == "a" || e.key == "ArrowLeft") && !isCollidingWithWall(player, "left") && playerMove) player.x -= player.speedX;
    else if ((e.key == "w" || e.key == "ArrowUp") && !isCollidingWithWall(player, "top") && playerMove) player.y -= player.speedY;
});

window.addEventListener("click", (e) => {
    if (insideArea(e.x, e.y, slot1.x, slot1.x + buttonWidth(), slot1.y, slot1.y + buttonHeight())) startGame();
    else if (insideArea(e.x, e.y, slot2.x, slot2.x + buttonWidth(), slot2.y, slot2.y + buttonHeight())) pauseGame();
    else if (insideArea(e.x, e.y, slot3.x, slot3.x + buttonWidth(), slot3.y, slot3.y + buttonHeight())) resumeGame();
    else if (insideArea(e.x, e.y, slot4.x, slot4.x + slot4.width, slot4.y, slot4.y + slot4.height)) init();
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
    if (sprite.x <= food.x && sprite.x + playerWidth >= food.x && sprite.y <= food.y && sprite.y + playerHeight >= food.y) {
        let foodSoundClone = foodAudio.cloneNode();
        foodSoundClone.currentTime = 0;
        foodSoundClone.play();
        score += 10;
        return true;
    }
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

// Display score
const displayScore = () => {
    ctx.font = `${gameAreaWidth / 16}px Helvetica`;
    ctx.fillStyle = "black";
    ctx.fillText(String(score).padStart(3, "0"), gameAreaX + gameAreaWidth / 5, gameAreaY - gameAreaWidth / 32);
    ctx.strokeStyle = "black";
    ctx.strokeText(String(score).padStart(3, "0"), gameAreaX + gameAreaWidth / 5, gameAreaY - gameAreaWidth / 32);
};

// Final score board
const showFinalScore = () => {
    if (playGameOverAudio) gameOverAudio.play();

    audioTimeOut = setTimeout(() => {
        playGameOverAudio = false;
    }, 900);

    // Stop everthing
    pauseGame();

    let dialogX = gameAreaX + gameAreaWidth / 4;
    let dialogY = gameAreaY + gameAreaHeight / 4;
    let dialogWidth = gameAreaWidth / 2;
    let dialogHeight = gameAreaHeight / 3;
    slot4 = {
        x: dialogX + dialogWidth / 4,
        y: dialogY + dialogHeight / 1.5,
        width: playerHeight * 4,
        height: playerHeight,
    };

    ctx.fillStyle = "gray";
    ctx.fillRect(dialogX, dialogY, dialogWidth, dialogHeight);

    ctx.font = `${dialogWidth / 6}px Helvetica`;
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, dialogX + dialogWidth / 8, dialogY + dialogHeight / 3);
    ctx.strokeStyle = "black";
    ctx.strokeText(`Score: ${score}`, dialogX + dialogWidth / 8, dialogY + dialogHeight / 3);

    ctx.fillStyle = "White";
    ctx.fillRect(slot4.x, slot4.y, slot4.width, slot4.height);

    ctx.font = `bold ${playerHeight / 1.5}px Helvetica`;
    ctx.fillStyle = "black";
    ctx.fillText("Restart", slot4.x + playerHeight / 4, slot4.y + playerHeight / 1.5);
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
    pauseButton.createButton();
    resumeButton.createButton();
    startButton.createButton();
    displayScore();
    if (gameOver || score === 200) showFinalScore();
};
// Call animate()
animate();
