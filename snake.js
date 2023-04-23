const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const blockSize = 16;
const maxPosition = {
  x: canvas.width / blockSize - 1,
  y: canvas.height / blockSize - 1,
};

let snake = [
  { x: 10, y: 10 },
  { x: 11, y: 10 },
  { x: 12, y: 10 },
];

let direction = 'left';
let food = generateFood();

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 100);
}

function update() {
  let head = { ...snake[0] };

  if (direction === 'up') head.y--;
  if (direction === 'down') head.y++;
  if (direction === 'left') head.x--;
  if (direction === 'right') head.x++;

  head.x = (head.x + maxPosition.x + 1) % (maxPosition.x + 1);
  head.y = (head.y + maxPosition.y + 1) % (maxPosition.y + 1);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment) => {
    drawBlock(segment, 'green');
  });

  drawBlock(food, 'red');
}

function drawBlock(position, color) {
  ctx.fillStyle = color;
  ctx.fillRect(position.x * blockSize, position.y * blockSize, blockSize, blockSize);
}

function generateFood() {
  let position = {
    x: Math.floor(Math.random() * (maxPosition.x + 1)),
    y: Math.floor(Math.random() * (maxPosition.y + 1)),
  };

  if (snake.some((segment) => segment.x === position.x && segment.y === position.y)) {
    return generateFood();
  }

  return position;
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

document.addEventListener('touchstart', (event) => {
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;
  const canvasRect = canvas.getBoundingClientRect();
  const canvasX = touchX - canvasRect.left;
  const canvasY = touchY - canvasRect.top;
  const halfCanvasWidth = canvas.width / 2;
  const halfCanvasHeight = canvas.height / 2;

  if (Math.abs(canvasX - halfCanvasWidth) > Math.abs(canvasY - halfCanvasHeight)) {
    if (canvasX < halfCanvasWidth && direction !== 'right') direction = 'left';
    if (canvasX > halfCanvasWidth && direction !== 'left') direction = 'right';
  } else {
    if (canvasY < halfCanvasHeight && direction !== 'down') direction = 'up';
    if (canvasY > halfCanvasHeight && direction !== 'up') direction = 'down';
  }
});
var touchStartX = 0;
var touchStartY = 0;
var touchEndX = 0;
var touchEndY = 0;


document.addEventListener('touchend', function(event) {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;

  var deltaX = touchEndX - touchStartX;
  var deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      direction = 'right';
    } else {
      direction = 'left';
    }
  } else {
    if (deltaY > 0) {
      direction = 'down';
    } else {
      direction = 'up';
    }
  }
});
gameLoop();
