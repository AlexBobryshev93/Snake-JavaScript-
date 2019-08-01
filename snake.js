const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const fieldImg = new Image();
const foodImg = new Image();
const sectionImg = new Image();
const box = 32; // square size (pxl)
let score = 0;
let game = setInterval(drawGame, 100); // game speed
let snake = [];
let direction;
let food = {
    x: undefined,
    y: undefined
};

snake[0] = { // initial coordinates
    x: 9 * box,
    y: 10 * box,
};

fieldImg.src = "images/field.png";
foodImg.src = "images/food.png";
sectionImg.src = "images/section.png";
context.fillStyle = "blue";
context.font = "30px Segoe Script";

spawnFood();
document.addEventListener("keydown", changeDirection);

function drawGame() {
    context.drawImage(fieldImg, 0, 0);
    context.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        context.drawImage(sectionImg, snake[i].x, snake[i].y);
    }

    context.fillText("Score: " + score, box * 2, box * 2);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if ((snakeX == food.x) && (snakeY == food.y)) { // food was eaten
        score++;
        spawnFood();
    } else {
        snake.pop();
    }

    if ((snakeX < box) || (snakeX > box * 17) || (snakeY < box * 3) || (snakeY > box * 17)) gameOver();

    if (direction == "LEFT") snakeX -= box;
    else if (direction == "RIGHT") snakeX += box;
    else if (direction == "UP") snakeY -= box;
    else if (direction == "DOWN") snakeY += box;
    let newHead = {
        x: snakeX,
        y: snakeY
    };
    selfEating(newHead, snake);
    snake.unshift(newHead);
}

function changeDirection(event) {
    if ((event.keyCode == 37 || event.keyCode == 65) && direction != "RIGHT") direction = "LEFT";
    else if ((event.keyCode == 38 || event.keyCode == 87) && direction != "DOWN") direction = "UP";
    else if ((event.keyCode == 39 || event.keyCode == 68) && direction != "LEFT") direction = "RIGHT";
    else if ((event.keyCode == 40 || event.keyCode == 83) && direction != "UP") direction = "DOWN";
}

function selfEating(head, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) gameOver();
    }
}

function spawnFood() {
    let valid; // to avoid the spawn on the snake itself
    do {
        valid = true;
        food.x = Math.floor(1 + Math.random() * 17) * box; // +1 in order to avoid the spawn outside the field
        food.y = Math.floor(3 + Math.random() * 15) * box; // +3 in order to avoid the spawn outside the field

        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x == food.x && snake[i].y == food.y) {
                valid = false;
                break;
            }
        }
    } while (!valid);
}

function gameOver() {
    context.fillStyle = "red";
    context.fillText("Oooops...Game over...", box * 7, box * 2);
    clearInterval(game);
}
