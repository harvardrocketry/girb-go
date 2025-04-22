const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let rocket = {
  x: 180,
  y: 500,
  width: 40,
  height: 60,
  vy: 0,
  gravity: 0.4,
  jumpStrength: -10
};

let platforms = [];
const numPlatforms = 8;
for (let i = 0; i < numPlatforms; i++) {
  platforms.push({
    x: Math.random() * 360,
    y: i * 75,
    width: 60,
    height: 10
  });
}

function drawRocket() {
  ctx.fillStyle = '#ff4d4d';
  ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
}

function drawPlatforms() {
  ctx.fillStyle = '#fff';
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function update() {
  rocket.vy += rocket.gravity;
  rocket.y += rocket.vy;

  if (rocket.y > canvas.height) {
    rocket.y = 500;
    rocket.vy = 0;
    alert('Game Over!');
  }

  platforms.forEach(p => {
    if (
      rocket.x < p.x + p.width &&
      rocket.x + rocket.width > p.x &&
      rocket.y + rocket.height < p.y + p.height &&
      rocket.y + rocket.height > p.y &&
      rocket.vy > 0
    ) {
      rocket.vy = rocket.jumpStrength;
    }
  });

  if (rocket.y < 300) {
    rocket.y = 300;
    platforms.forEach(p => {
      p.y -= rocket.vy;
      if (p.y > canvas.height) {
        p.y = 0;
        p.x = Math.random() * 340;
      }
    });
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRocket();
  drawPlatforms();
  update();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') rocket.x -= 20;
  if (e.key === 'ArrowRight') rocket.x += 20;
});

loop();
