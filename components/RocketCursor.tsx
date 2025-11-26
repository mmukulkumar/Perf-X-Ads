
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
  vx: number;
  vy: number;
}

const RocketCursor = () => {
  const requestRef = useRef<number | null>(null);
  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Start position roughly at "Social Specs" tab position (top left-ish area of header)
  const rocketRef = useRef({ x: 350, y: 40, angle: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosRef = useRef({ x: 350, y: 40 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    const update = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      // Clear with fade effect for trails if desired, but clearRect is cleaner for this style
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Physics
      const speed = 0.12; // Responsiveness
      
      const targetX = cursorRef.current.x;
      const targetY = cursorRef.current.y;
      
      const dx = targetX - rocketRef.current.x;
      const dy = targetY - rocketRef.current.y;
      
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist > 1) {
        rocketRef.current.x += dx * speed;
        rocketRef.current.y += dy * speed;
        
        // Angle pointing towards movement
        // Rocket emoji 🚀 points top-right (-45 deg offset needed usually)
        // If we want the nose to point to cursor:
        const targetAngle = Math.atan2(dy, dx);
        rocketRef.current.angle = targetAngle;
      }

      // Velocity for particles
      const vx = rocketRef.current.x - lastPosRef.current.x;
      const vy = rocketRef.current.y - lastPosRef.current.y;
      lastPosRef.current = { x: rocketRef.current.x, y: rocketRef.current.y };

      // Add particles if moving
      if (dist > 2) { 
        // Emit from back of rocket
        // Rocket nose is at (x,y). Back is opposite to angle.
        // Length of rocket approx 20px
        const backX = rocketRef.current.x - Math.cos(rocketRef.current.angle) * 15;
        const backY = rocketRef.current.y - Math.sin(rocketRef.current.angle) * 15;

        for (let i = 0; i < 2; i++) {
            particlesRef.current.push({
            x: backX + (Math.random() - 0.5) * 6,
            y: backY + (Math.random() - 0.5) * 6,
            size: Math.random() * 3 + 2,
            color: Math.random() > 0.5 ? '#FF5722' : '#FFC107', // Orange/Amber
            life: 1.0,
            vx: -vx * 0.2 + (Math.random() - 0.5),
            vy: -vy * 0.2 + (Math.random() - 0.5)
            });
        }
      }

      // Update and Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life -= 0.04;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.92; // Shrink
        
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw Rocket
      ctx.save();
      ctx.translate(rocketRef.current.x, rocketRef.current.y);
      ctx.rotate(rocketRef.current.angle);
      
      // Emoji rotation correction: 🚀 points North-East (bottom-left to top-right)
      // We calculated angle where 0 is East (standard atan2).
      // We need to rotate -45 degrees (-PI/4) to align 🚀
      ctx.rotate(Math.PI / 4); 
      
      ctx.font = "28px Serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🚀", 0, 0);
      
      ctx.restore();

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
};

export default RocketCursor;
