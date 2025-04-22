// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rocketImg = new Image();
rocketImg.src = "rocket.png"; // make sure this matches your uploaded image file name

let rocket = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 0.5,
  jumpPower: -12
};

let score = 0;
let gameOver = false;

function drawRocket() {
  ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
}

function drawScore() {
  document.getElementById("score").textContent = `Score: ${Math.floor(score)}`;
}

function updateRocket() {
  rocket.velocityY += rocket.gravity;
  rocket.y += rocket.velocityY;

  if (rocket.y < canvas.height / 2) {
    score += (canvas.height / 2 - rocket.y) * 0.01;
    rocket.y = canvas.height / 2;
  }

  if (rocket.y > canvas.height) {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  document.getElementById("gameOverScreen").style.display = "block";
}

function restartGame() {
  rocket.y = canvas.height - 100;
  rocket.velocityY = 0;
  score = 0;
  gameOver = false;
  document.getElementById("gameOverScreen").style.display = "none";
  animate();
}

function clear() {
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87ceeb");
  gradient.addColorStop(0.5, "#4682b4");
  gradient.addColorStop(1, "#1a1a2e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  if (gameOver) return;
  clear();
  updateRocket();
  drawRocket();
  drawScore();
  requestAnimationFrame(animate);
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    rocket.velocityY = rocket.jumpPower;
  }
});

rocketImg.onload = () => {
  animate();
};
