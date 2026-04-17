import { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Use refs to keep snake state accessible within the game loop without re-triggering hooks
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  
  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is interacting with a button or input
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) {
        return;
      }

      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }
      
      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (dir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (dir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (dir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (dir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Main game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let lastTime = 0;
    let accumTime = 0;
    const speed = 100; // milliseconds per grid move
    let animationFrameId: number;
    
    const drawCell = (x: number, y: number, color: string, glow: string) => {
      ctx.fillStyle = color;
      ctx.shadowColor = glow;
      ctx.shadowBlur = 10;
      ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      ctx.shadowBlur = 0; // Reset blur
    };
    
    const placeFood = () => {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
        // Ensure food doesn't spawn on the snake
        const collision = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        if (!collision) break;
      }
      foodRef.current = newFood;
    };
    
    const update = () => {
      directionRef.current = nextDirectionRef.current;
      const head = snakeRef.current[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y
      };
      
      // Wall collision checks
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }
      
      // Self collision checks
      if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
         setGameOver(true);
         return;
      }
      
      snakeRef.current = [newHead, ...snakeRef.current];
      
      // Check if food eaten
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        scoreRef.current += 10;
        onScoreChange(scoreRef.current);
        placeFood();
      } else {
        snakeRef.current.pop();
      }
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid pattern layout
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      for(let i = 0; i <= GRID_SIZE; i++) {
         ctx.beginPath();
         ctx.moveTo(i * CELL_SIZE, 0);
         ctx.lineTo(i * CELL_SIZE, canvas.height);
         ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(0, i * CELL_SIZE);
         ctx.lineTo(canvas.width, i * CELL_SIZE);
         ctx.stroke();
      }
      
      // Draw food
      drawCell(foodRef.current.x, foodRef.current.y, '#ff00ff', '#ff00ff');
      
      // Draw snake (head is white glow, body is cyan glow)
      snakeRef.current.forEach((segment, index) => {
        const color = index === 0 ? '#ffffff' : '#00ffff';
        const glow = index === 0 ? '#ffffff' : '#00ffff';
        drawCell(segment.x, segment.y, color, glow);
      });
    };
    
    const loop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      accumTime += deltaTime;
      if (accumTime >= speed) {
        update();
        accumTime = 0;
      }
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver, isPaused, onScoreChange]);
  
  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    foodRef.current = { x: 15, y: 10 };
    scoreRef.current = 0;
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
  };
  
  return (
    <div className="relative group">
      <canvas 
        ref={canvasRef}
        width={400}
        height={400}
        className="border-2 border-[#00ffff] bg-black shadow-[0_0_15px_#00ffff] rounded-md shadow-inner"
      />
      
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm rounded z-10">
          <h2 className="text-3xl font-black tracking-widest text-[#ff00ff] drop-shadow-[0_0_10px_#ff00ff] mb-6">GAME OVER</h2>
          <button 
            onClick={resetGame}
            className="px-6 py-2 border-2 border-[#39ff14] text-[#39ff14] drop-shadow-[0_0_5px_#39ff14] hover:bg-[#39ff14]/20 transition-all uppercase tracking-widest font-bold cursor-pointer"
          >
            Restart
          </button>
        </div>
      )}
      
      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded z-10 pointer-events-none">
          <h2 className="text-2xl text-white drop-shadow-[0_0_10px_#ffffff] tracking-[0.3em]">PAUSED</h2>
        </div>
      )}
      
      <div className="mt-4 text-center text-[10px] text-gray-500 uppercase tracking-widest">
         Use Arrow Keys to move • Space to Pause
      </div>
    </div>
  );
}
