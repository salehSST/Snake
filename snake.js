const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
let direction = "RIGHT";
let food;
let score = 0;
let speed = 150;
let gameInterval;

document.getElementById("startButton").addEventListener("click", function() {
    const playerName = document.getElementById("nameInput").value;
    if (playerName.trim() === "") {
        alert("يرجى إدخال اسمك لبدء اللعبة.");
        return;
    }
    document.getElementById("startButton").style.display = "none";
    document.getElementById("nameInput").style.display = "none";
    document.getElementById("score").style.display = "block";
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("controls").style.display = "grid";
    document.getElementById("resetButton").style.display = "block";
    resetGame();
});

function resetGame() {
    snake = [];
    for (let i = 0; i < 9; i++) {
        snake.push({ x: 9 * box - i * box, y: 10 * box });
    }
    direction = "RIGHT";
    score = 0;
    speed = 150;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY >= canvas.height) snakeY = 0;
    if (snakeY < 0) snakeY = canvas.height - box;

    let newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake)) {
        clearInterval(gameInterval);
        alert(`Game Over! Score: ${score}`);
        saveHighScore(score);
        return;
    }

    snake.unshift(newHead);

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    document.getElementById("score").innerText = `Score: ${score}`;
}

function collision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

document.addEventListener("keydown", directionHandler);

function directionHandler(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

document.getElementById("up").addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});

document.getElementById("left").addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});

document.getElementById("down").addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});

document.getElementById("right").addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});

function saveHighScore(score) {
    const playerName = document.getElementById("nameInput").value || "Anonymous";
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name: playerName, score: score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

function displayHighScores() {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    let highScoresElement = document.getElementById('highScores');
    highScoresElement.innerHTML = `<h3>أعلى الدرجات</h3><ul>${highScores.map(entry => `<li>${entry.name}: ${entry.score}</li>`).join('')}</ul>`;
}

document.getElementById("resetButton").addEventListener("click", resetGame);

displayHighScores();
