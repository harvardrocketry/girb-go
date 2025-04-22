// Main game logic for Flight of Girb
import { useEffect, useRef, useState } from "react";
import girbSprite from "./assets/girb.png";

const GRAVITY = 0.4;
const FLAP_STRENGTH = -8;
const OBSTACLE_GAP = 180;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_INTERVAL = 1800; // ms
const SPEED = 3;

export default function App() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("loading");
  const [score, setScore] = useState(0);

  const girb = useRef({ x: 80, y: 200, vy: 0 });
  const obstacles = useRef([]);
  const imgRef = useRef(null);
  const animationId = useRef(null);

  // Load Girb sprite
  useEffect(() => {
    imgRef.current = new Image();
    imgRef.current.src = girbSprite;
    imgRef.current.onload = () => {
      setGameState("start");
    };
  }, []);

  // Set up event listeners
  useEffect(() => {
    function flap() {
      if (gameState === "start") {
        setGameState("playing");
        girb.current.vy = FLAP_STRENGTH;
      } else if (gameState === "playing") {
        girb.current.vy = FLAP_STRENGTH;
      } else if (gameState === "gameover") {
        resetGame();
      }
    }

    function handleKeyDown(e) {
      if (e.code === "Space") {
        flap();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", flap);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", flap);
    };
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState === "loading") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let lastObstacleTime = 0;

    function loop(timestamp) {
      if (!lastObstacleTime) lastObstacleTime = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sky background
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === "playing") {
        // Girb physics
        girb.current.vy += GRAVITY;
        girb.current.y += girb.current.vy;

        // Add obstacles
        if (timestamp - lastObstacleTime > OBSTACLE_INTERVAL) {
          const gapTop = Math.random() * (canvas.height - OBSTACLE_GAP - 100) + 50;
          obstacles.current.push({ x: canvas.width, top: gapTop, passed: false });
          lastObstacleTime = timestamp;
        }

        // Update and draw obstacles
        obstacles.current = obstacles.current.filter((ob) => ob.x + OBSTACLE_WIDTH > 0);
        for (let ob of obstacles.current) {
          ob.x -= SPEED;
          ctx.fillStyle = "#444";
          ctx.fillRect(ob.x, 0, OBSTACLE_WIDTH, ob.top);
          ctx.fillRect(ob.x, ob.top + OBSTACLE_GAP, OBSTACLE_WIDTH, canvas.height);

          // Scoring
          if (!ob.passed && ob.x + OBSTACLE_WIDTH < girb.current.x) {
            ob.passed = true;
            setScore((s) => s + 1);
          }

          // Collision detection
          if (
            girb.current.x < ob.x + OBSTACLE_WIDTH &&
            girb.current.x + 40 > ob.x &&
            (girb.current.y < ob.top || girb.current.y + 40 > ob.top + OBSTACLE_GAP)
          ) {
            setGameState("gameover");
          }
        }

        // Check bounds
        if (girb.current.y < 0 || girb.current.y + 40 > canvas.height) {
          setGameState("gameover");
        }
      }

      // Draw Girb
      ctx.drawImage(imgRef.current, girb.current.x, girb.current.y, 40, 40);

      // Draw rocket flames
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.moveTo(girb.current.x, girb.current.y + 20);
      ctx.lineTo(girb.current.x - 10, girb.current.y + 10);
      ctx.lineTo(girb.current.x - 10, girb.current.y + 30);
      ctx.fill();

      // Draw score
      ctx.fillStyle = "#000";
      ctx.font = "24px sans-serif";
      ctx.fillText(`Score: ${score}`, 10, 30);

      // Draw UI text
      if (gameState === "start") {
        ctx.fillText("Click or press space to start", 60, canvas.height / 2);
      }
      if (gameState === "gameover") {
        ctx.fillText("Game Over - Click or press space to restart", 20, canvas.height / 2);
      }

      animationId.current = requestAnimationFrame(loop);
    }

    animationId.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId.current);
  }, [gameState]);

  // Reset game
  function resetGame() {
    setScore(0);
    girb.current = { x: 80, y: 200, vy: 0 };
    obstacles.current = [];
    setGameState("start");
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={480}
        height={640}
        className="border-4 border-white rounded-xl shadow-xl"
      />
    </div>
  );
}
