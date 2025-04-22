const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rocketImg = new Image();
rocketImg.src = "rocket.png";

let rocket = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 100,
  width: 100,
  height: 100,
  velocityY: 0,
  gravity: 0.5,
  jumpPower: -12,
  launched: false
};

let clouds = [];
let cloudImg = new Image();
cloudImg.src = "https://i.imgur.com/yf4Z3NU.png"; // you can upload your own too!

let score = 0;
let gameOver = false;

function spawnCloud() {
  const size = 60 + Math.random() * 40;
  clouds.push({
    x: Math.random() * (canvas.width - size),
    y: rocket.y - canvas.height - Math.random() * 500,
    width: size,
    height: size,
  });
}

function updateClouds() {
  for (let cloud of clouds) {
    cloud.y += rocket.gravity * rocket.velocityY * -0.05;
    ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);

    // Collision
    if (
      rocket.x < cloud.x + cloud.width &&
      rocket.x + rocket.width > cloud.x &&
      rocket.y < cloud.y + cloud.height &&
      rocket.y + rocket.height > cloud.y
    ) {
      endGame();
    }
  }

  // Remove off-screen clouds
  clouds = clouds.filter(cloud => cloud.y < rocket.y + canvas.height);
}

function drawRocket() {
  ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
}

function drawScore() {
  document.getElementById("score").textContent = `Score: ${Math.floor(score)}`;
}

function updateRocket() {
  if (!rocket.launched) return;

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

function clear() {
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87ceeb");
  gradient.addColorStop(0.5, "#a0c4ff");
  gradient.addColorStop(1, "#1a1a2e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grass at bottom
  ctx.fillStyle = "#228B22";
  ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
}

function animate() {
  if (gameOver) return;
  clear();
  updateRocket();
  drawRocket();
  drawScore();
  updateClouds();
  requestAnimationFrame(animate);
}

function endGame() {
  gameOver = true;
  document.getElementById("gameOverScreen").style.display = "block";
}

function restartGame() {
  rocket.y = canvas.height - 100;
  rocket.velocityY = 0;
  rocket.launched = false;
  score = 0;
  clouds = [];
  document.getElementById("gameOverScreen").style.display = "none";
  for (let i = 0; i < 10; i++) spawnCloud();
  animate();
}

window.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !gameOver) {
    if (!rocket.launched) rocket.launched = true;
    rocket.velocityY = rocket.jumpPower;
  }
});

rocketImg.onload = () => {
  for (let i = 0; i < 10; i++) spawnCloud();
  animate();
};
