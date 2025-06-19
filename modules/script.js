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
const buttonWidth = () => buttonHeight() * 3.2;
let startButton;
let pauseButton;
let resumeButton;

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
        let fontSize = this.height / 1.6;
        let fontX = this.x;
        let fontY = this.y + this.height / 1.2;

        ctx.font = `${fontSize}px "Press Start 2P"`;
        ctx.fillStyle = "#F2F2F2";
        ctx.fillText(this.text, fontX, fontY);
        // ctx.strokeStyle = "#F2F2F2";
        // ctx.strokeText(this.text, fontX, fontY);

        // ctx.fillStyle = "blue";
        // ctx.fillRect(this.x, this.y, this.width, this.height);
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
        gameStartAudio.currentTime = 0;
        gameStartAudio.play();
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
        gameStartAudio.currentTime = 0;
        gameStartAudio.play();
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
    clearTimeout(timeOutId);
    clearTimeout(audioTimeOut);
    time = {
        min: "00",
        sec: "30",
    };

    // Score reset
    score = 0;

    // Initialize everything
    gameAreaX = window.innerWidth / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2;
    gameAreaY = window.innerHeight / 2 - (Math.min(window.innerHeight, window.innerWidth) * 0.8) / 2;
    gameAreaWidth = Math.min(window.innerHeight, window.innerWidth) * 0.8;
    gameAreaHeight = Math.min(window.innerHeight, window.innerWidth) * 0.8;
    gameAreaColor = "#011140";

    playerRandomGridX = getRandomInt(0, 16);
    playerRandomGridY = getRandomInt(0, 16);
    playerWidth = gameAreaWidth / 16;
    playerHeight = gameAreaHeight / 16;
    playerX = gameAreaX + playerWidth * playerRandomGridX;
    playerY = gameAreaY + playerHeight * playerRandomGridY;
    playerColor = "#DBF227";

    gameArea = new Sprite(gameAreaX, gameAreaY, gameAreaWidth, gameAreaHeight, 0, 0, gameAreaColor);
    player = new Sprite(playerX, playerY, playerWidth, playerHeight, (playerWidth + playerHeight) / 2, (playerWidth + playerHeight) / 2, playerColor);

    foodArray = [];
    for (let i = 0; i < 20; i++) {
        foodWidth = playerWidth / 4;
        foodHeight = playerWidth / 4;
        let randomPos = randomFoodPosition(playerRandomGridX, playerRandomGridY);
        let foodColor = "#F2F2F2";

        foodArray.push(new Sprite(randomPos.x, randomPos.y, foodWidth, foodHeight, 0, 0, foodColor));
    }

    slot1 = {
        x: slotX(),
        y: slotY(),
    };
    slot2 = {
        x: slotX() + buttonWidth() * 1.5 + buttonHeight() * 1.5,
        y: slotY(),
    };
    slot3 = {
        x: slotX() + buttonWidth() * 3 + buttonHeight() * 2.7,
        y: slotY(),
    };

    // Create clock and start timer
    clock = new Clock(gameAreaX, gameAreaY - gameAreaWidth / 32, gameAreaWidth / 16, `"Press Start 2P"`, "#F2F2F2", "#F2F2F2", 30);

    // Start Game Button
    startButton = new Button(slot1.x, slot1.y, "START");

    // Pause Game Button
    pauseButton = new Button(slot2.x, slot2.y, "PAUSE");

    // Resume Game Button
    resumeButton = new Button(slot3.x, slot3.y, "RESUME");
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
    let fontSize = gameAreaWidth / 16;
    let fontX = gameAreaX + gameAreaWidth - 3 * fontSize;
    let fontY = gameAreaY - gameAreaWidth / 32;
    ctx.font = `${fontSize}px "Press Start 2P"`;
    ctx.fillStyle = "#F2F2F2";
    ctx.fillText(String(score).padStart(3, "0"), fontX, fontY);
    ctx.strokeStyle = "#F2F2F2";
    ctx.strokeText(String(score).padStart(3, "0"), fontX, fontY);
};

// Final score board
const showFinalScore = () => {
    if (playGameOverAudio) gameOverAudio.play();

    audioTimeOut = setTimeout(() => {
        playGameOverAudio = false;
    }, 900);

    // Stop everything
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

    let fontSize = dialogWidth / 12;
    let fontX = dialogX + dialogHeight / 16;
    let fontY = dialogY + dialogHeight / 3;

    ctx.fillStyle = "#00010D";
    ctx.fillRect(dialogX, dialogY, dialogWidth, dialogHeight);

    ctx.font = `${fontSize}px "Press Start 2P"`;
    ctx.fillStyle = "#F2F2F2";
    ctx.fillText(`SCORE - ${score}`, fontX, fontY);
    // ctx.strokeStyle = "#F2F2F2";
    // ctx.strokeText(`SCORE: ${score}`, fontX, fontY);

    // Restart Button
    let buttonFontSize = playerHeight / 1.5;
    let buttonFontX = slot4.x - playerHeight / 6;
    let buttonFontY = slot4.y + playerHeight / 1.2;

    ctx.font = `${buttonFontSize}px "Press Start 2P"`;
    ctx.fillStyle = "#F2F2F2";
    ctx.fillText("RESTART", buttonFontX, buttonFontY);
    // ctx.strokeStyle = "#F2F2F2";
    // ctx.strokeText("RESTART", buttonFontX, buttonFontY);

    // ctx.fillStyle = "blue";
    // ctx.fillRect(slot4.x, slot4.y, slot4.width, slot4.height);

    // ctx.font = `bold ${playerHeight / 1.5}px Helvetica`;
    // ctx.fillStyle = "black";
    // ctx.fillText("Restart", slot4.x + playerHeight / 4, slot4.y + playerHeight / 1.5);
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
