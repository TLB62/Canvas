let canvas = document.querySelector("#canvas");
// Re affectation du ratio canvas => css
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

// optimisation dimensions briques
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: O, status: 1 };
  }
}

function drawBrick() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

let paddleHeight = 10;
let paddleWidth = 70;
let paddleX = (canvas.width - paddleWidth) / 2;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

let rightPressed = false;
let leftPressed = false;

let ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
}

function keyDownHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = true;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightPressed = false;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    leftPressed = false;
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  if (canvas.getContext) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBrick();
    collisionDetection();
    drawBall();
    drawPaddle(); //callback
    //rebond haut et bas
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        alert("GAME OVER!");
        document.location.reload();
        clearInterval(interval); //chrome
      }
    }
    //rebonds gauche et droite
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }
    if (rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    } else if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }
    x += dx; // x = x +dx
    y += dy;
  }
}

let interval = setInterval(draw, 10);
