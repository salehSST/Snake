const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 25;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food;
let score = 0;
let level = 1;
let speed = 150;
let gameInterval;

// إعداد الأصوات
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

// توليد الطعام في مكان عشوائي
function generateFood() {
    food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    };
}

generateFood();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الأفعى
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // رسم الطعام
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // حركة الأفعى
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // اختراق الجدران
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY >= canvas.height) snakeY = 0;
    if (snakeY < 0) snakeY = canvas.height - box;

    let newHead = { x: snakeX, y: snakeY };

    // تحقق من الاصطدام بجسم الأفعى
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            clearInterval(gameInterval);
            gameOverSound.play();
            alert(`Game Over! Your score is ${score}`);
            return;
        }
    }

    snake.unshift(newHead);

    // إذا أكلت الأفعى الطعام
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        eatSound.play();
        if (score % 5 === 0) {
            level++;
            speed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(draw, speed);
        }
        generateFood();
    } else {
        snake.pop();
    }

    // تحديث النقاط
    document.getElementById("score").innerText = `Score: ${score} | Level: ${level}`;
}

document.addEventListener("keydown", directionHandler);

function directionHandler(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    level = 1;
    speed = 150;
    generateFood();
    gameInterval = setInterval(draw, speed);
}

document.getElementById("resetButton").addEventListener("click", resetGame);

resetGame();
