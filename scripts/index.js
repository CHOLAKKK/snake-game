const app = document.getElementById("app");
const endGame = document.querySelector(".endGame");
const tryAgain = document.getElementById("tryAgain");
const scoreBoard = document.getElementById("scoreBoard");

let snakeSpeed = 200;

let scoreCounter = 0;
let gameRunning = false;
let snakeLength = 1;

let appleX, appleY;

const snake = [[1, 1]];

const WHERE_IS_APPLE = (japkoX, japkoY) => {
  console.log(`japko is at x: ${japkoX}, y: ${japkoY}`);
  console.table(game);
};

const generateTable = () => {
  const table = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  return table;
};

let game = generateTable();

const generateNewApple = () => {
  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[i].length; j++) {
      if (game[i][j] == 2) {
        game[i][j] = 0;
      }
    }
  }

  appleX = Math.floor(Math.random() * game.length);
  appleY = Math.floor(Math.random() * game[0].length);

  while (game[appleX][appleY] != 0) {
    appleX = Math.floor(Math.random() * game.length);
    appleY = Math.floor(Math.random() * game[0].length);
  }

  game[appleX][appleY] = 2;

  WHERE_IS_APPLE(appleY, appleX);
};

const drawGame = () => {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[i].length; j++) {
      if (game[i][j] == "0") {
        const gameBackground = document.createElement("div");
        gameBackground.classList.add("gameBackground");
        app.append(gameBackground);
      } else if (game[i][j] == "1") {
        const snake = document.createElement("div");
        snake.classList.add("snake");
        app.append(snake);
      } else if (game[i][j] == "2") {
        const apple = document.createElement("div");
        apple.classList.add("apple");
        app.append(apple);
      }
    }
  }
};

drawGame();

let snakeDirection = "right";

const moveSnake = (event) => {
  gameRunning = "true";
  if (gameRunning) {
    if (event.code == "ArrowUp" && snakeDirection != "down") {
      snakeDirection = "up";
    } else if (event.code == "ArrowDown" && snakeDirection != "up") {
      snakeDirection = "down";
    } else if (event.code == "ArrowRight" && snakeDirection != "left") {
      snakeDirection = "right";
    } else if (event.code == "ArrowLeft" && snakeDirection != "right") {
      snakeDirection = "left";
    }
  }
};

setInterval(() => {
  if (gameRunning) {
    let nextPos;
    if (snakeDirection == "up") {
      nextPos = [snake[0][0], snake[0][1] - 1];
    } else if (snakeDirection == "down") {
      nextPos = [snake[0][0], snake[0][1] + 1];
    } else if (snakeDirection == "right") {
      nextPos = [snake[0][0] + 1, snake[0][1]];
    } else if (snakeDirection == "left") {
      nextPos = [snake[0][0] - 1, snake[0][1]];
    }

    snake.unshift(nextPos);

    checkCollision();

    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length; j++) {
        if (i == snake[0][1] && j == snake[0][0]) {
          game[i][j] = 1;
        }
      }
    }

    drawGame();
  }
}, snakeSpeed);

document.addEventListener("keydown", moveSnake);

const checkCollision = () => {
  let [headX, headY] = snake[0];
  if (
    snake[0][0] < 0 ||
    snake[0][0] >= game[0].length ||
    snake[0][1] < 0 ||
    snake[0][1] >= game.length
  ) {
    gameEnds();
    return false;
  }

  for (let i = 1; i < snakeLength; i++) {
    if (headX === snake[i][0] && headY === snake[i][1]) {
      gameEnds();
    }
  }

  game[snake[snakeLength][1]][snake[snakeLength][0]] = 0;

  if (game[snake[0][1]][snake[0][0]] == 2) {
    generateNewApple();
    addScore(scoreCounter++);
    snakeLength++;
    snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1]]);
  }
};

const restartGame = () => {
  gameRunning = "true";
  snake.length = 1;
  snakeLength = 1;
  snake[0] = [1, 1];
  game = generateTable();
  scoreCounter = 0;
  addScore();
  snakeDirection = "right";
  drawGame();
};

const gameEnds = () => {
  endGame.style.visibility = "visible";
  endGame.style.opacity = 1;
  gameRunning = false;
};

const addScore = () => {
  scoreBoard.innerHTML = `SCORE <span class="scoreBoard">${scoreCounter}</span>`;
};

tryAgain.addEventListener("click", () => {
  gameRunning = "false";
  endGame.style.visibility = "hidden";
  endGame.style.opacity = 0;
  scoreCounter = 0;
  restartGame();
});

addScore();
