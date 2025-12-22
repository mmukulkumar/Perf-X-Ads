import React, { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
}

const SnowAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create snowflakes
    const createSnowflakes = () => {
      const count = Math.floor((canvas.width * canvas.height) / 15000); // Adjust density
      snowflakesRef.current = [];
      
      for (let i = 0; i < count; i++) {
        snowflakesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          drift: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.6 + 0.4,
        });
      }
    };
    createSnowflakes();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakesRef.current.forEach((flake) => {
        // Draw snowflake
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        // Update position
        flake.y += flake.speed;
        flake.x += flake.drift;

        // Reset snowflake when it goes off screen
        if (flake.y > canvas.height) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default SnowAnimation;
