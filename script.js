const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rocketImg = new Image();
rocketImg.src = "rocket.png";

const cloudImg = new Image();
cloudImg.src = "cloud.png"; // Ensure this file is in the same folder

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
let stars = [];
let score = 0;
let gameOver = false;

// Load cloud image
cloudImg.onload = () => {
  console.log("Cloud image loaded!");
  // Initial cloud spawn
  for (let i = 0; i < 5; i++) {
    spawnCloud();
  }
};

cloudImg.onerror = () => {
  console.error("Cloud image failed to load!");
};

// Function to spawn clouds
function spawnCloud() {
  const size = 60 + Math.random() * 40;
  clouds.push({
    x: Math.random() * (canvas.width - size),
    y: Math.random() * canvas.height / 2, // Clouds start in the upper half
    width: size,
    height: size,
  });
}

// Function to create stars
function spawnStars() {
  const numStars = 3 + Math.floor(Math.random() * 5);
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height / 2),
      size: Math.random() * 3 + 1,
    });
  }
}

// Function to update clouds' positions
function updateClouds() {
  for (let cloud of clouds) {
    cloud.y += 1; // Move clouds down slowly
    ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);

    // Collision check
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
  clouds = clouds.filter(cloud => cloud.y < canvas.height);
}

// Function to update stars' positions
function updateStars() {
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

// Function to draw the rocket
function drawRocket() {
  ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Function to draw the score
function drawScore() {
  document.getElementById("score").textContent = `Score: ${Math.floor(score)}`;
}

// Function to update the rocket's position
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

// Function to clear and redraw the background
function clear() {
  // Create a gradient for the sky
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

  // As the rocket moves up, the sky gets darker
  let skyColorFactor = rocket.y / canvas.height;
  gradient.addColorStop(0, `rgb(135, 206, 235)`); // Light blue
  gradient.addColorStop(0.5, `rgb(160, 196, 255)`); // Lighter blue
  gradient.addColorStop(skyColorFactor, `rgb(${Math.max(0, 40)}, ${Math.max(0, 50)}, 75)`); // Darker as the rocket goes up

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars if the rocket is in space
  if (rocket.y < canvas.height / 2) {
    updateStars();
  }

  // Draw grass at bottom (fade away as rocket goes up)
  let grassOpacity = Math.max(0, 1 - skyColorFactor);
  ctx.fillStyle = `rgba(34, 139, 34, ${grassOpacity})`;
  ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
}

// Function to animate the game
function animate() {
  if (gameOver) return;
  clear();
  updateRocket();
  drawRocket();
  drawScore();
  updateClouds();
  requestAnimationFrame(animate);
}

// Function to end the game
function endGame() {
  gameOver = true;
  document.getElementById("gameOverScreen").style.display = "block";
}

// Function to restart the game
function restartGame() {
  rocket.y = canvas.height - 100;
  rocket.velocityY = 0;
  rocket.launched = false;
  score = 0;
  clouds = [];
  stars = [];
  document.getElementById("gameOverScreen").style.display = "none";
  spawnCloud();
  spawnStars();
  animate();
}

// Event listener for jump (space or up arrow)
window.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !gameOver) {
    if (!rocket.launched) rocket.launched = true;
    rocket.velocityY = rocket.jumpPower;
  }
});

// When the rocket image is loaded, start the animation
rocketImg.onload = () => {
  animate();
  spawnStars(); // Initialize some stars when the game starts
};
