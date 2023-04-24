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

let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;

function handleTouchMove(event) {
touchEndX = event.targetTouches[0].pageX;
touchEndY = event.targetTouches[0].pageY;

let xDist = touchEndX - touchStartX;
let yDist = touchEndY - touchStartY;

if (Math.abs(xDist) > Math.abs(yDist)) {
if (xDist > 0) direction = 'right';
else direction = 'left';
} else {
if (yDist > 0) direction = 'down';
else direction = 'up';
}

touchStartX = touchEndX;
touchStartY = touchEndY;
}

canvas.addEventListener('touchmove', handleTouchMove);

gameLoop();
