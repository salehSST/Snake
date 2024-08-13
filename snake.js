const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const resetButton = document.getElementById("resetButton");

const box = 20; // حجم الخلية الواحدة
let snake = [{ x: 7 * box, y: 7 * box }];
let direction = null;
let food = {
    x: Math.floor(Math.random() * 14 + 1) * box,
    y: Math.floor(Math.random() * 14 + 1) * box,
};
let score = 0;
let level = 1;
let speed = 200; // السرعة الابتدائية
let gameInterval;

// الأصوات
const eatSound = new Audio('sounds/eat.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');

// التحكم بحركة الأفعى باستخدام أزرار التحكم
document.getElementById("up").addEventListener("click", () => changeDirection("UP"));
document.getElementById("down").addEventListener("click", () => changeDirection("DOWN"));
document.getElementById("left").addEventListener("click", () => changeDirection("LEFT"));
document.getElementById("right").addEventListener("click", () => changeDirection("RIGHT"));

// التحكم بحركة الأفعى باستخدام لوحة المفاتيح
document.addEventListener("keydown", event => {
    if (event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
});

function changeDirection(newDirection) {
    if (newDirection === "LEFT" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (newDirection === "UP" && direction !== "DOWN") {
        direction = "UP";
    } else if (newDirection === "RIGHT" && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (newDirection === "DOWN" && direction !== "UP") {
        direction = "DOWN";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الأفعى
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "white";
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

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    // اختراق الجدران
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY >= canvas.height) snakeY = 0;
    if (snakeY < 0) snakeY = canvas.height - box;

    // إذا أكلت الأفعى الطعام
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eatSound.play();

        // زيادة المستوى كل 5 نقاط
        if (score % 5 == 0) {
            level++;
            speed = speed > 50 ? speed - 20 : speed; // تقليل الفاصل الزمني لتسريع اللعبة
            clearInterval(gameInterval);
            gameInterval = setInterval(draw, speed);
        }

        food = {
            x: Math.floor(Math.random() * 14 + 1) * box,
            y: Math.floor(Math.random() * 14 + 1) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // تحقق من الاصطدام
    if (collision(newHead, snake)) {
        clearInterval(gameInterval);
        gameOverSound.play();
        saveScore();
        alert(`انتهت اللعبة! نقاطك: ${score}`);
        resetButton.style.display = "block";
    } else {
        snake.unshift(newHead);
    }

    scoreElement.innerText = `Score: ${score} | Level: ${level}`;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function saveScore() {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

function displayHighScores() {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    let highScoresElement = document.getElementById('highScores');
    if (!highScoresElement) {
        highScoresElement = document.createElement('div');
        highScoresElement.id = 'highScores';
        highScoresElement.style.marginTop = '20px';
        document.getElementById('gameContainer').appendChild(highScoresElement);
    }

    highScoresElement.innerHTML = `<h3>أعلى الدرجات</h3><ul>${highScores.map(score => `<li>${score}</li>`).join('')}</ul>`;
}

function resetGame() {
    score = 0;
    level = 1;
    speed = 200;
    direction = null;
    snake = [{ x: 7 * box, y: 7 * box }];
    food = {
        x: Math.floor(Math.random() * 14 + 1) * box,
        y: Math.floor(Math.random() * 14 + 1) * box,
    };
    resetButton.style.display = "none";
    gameInterval = setInterval(draw, speed);
}

displayHighScores();
gameInterval = setInterval(draw, speed);

resetButton.addEventListener("click", resetGame);
