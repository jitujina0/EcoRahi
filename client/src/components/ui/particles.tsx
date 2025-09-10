import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  count?: number;
  speed?: number;
  color?: string;
  size?: number;
}

export function Particles({ 
  className, 
  count = 50, 
  speed = 1, 
  color = "#3b82f6", 
  size = 2 
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * size + 1,
      opacity: Math.random() * 0.5 + 0.1,
    });

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [count, speed, color, size]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
    />
  );
}

export function FloatingElements({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Floating Geometric Shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-float-3d blur-sm"></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rotate-45 animate-float-3d" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 animate-morphing blur-sm"></div>
      <div className="absolute bottom-20 right-1/3 w-18 h-18 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-float-3d" style={{ animationDelay: '4s' }}></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-radial from-primary/10 to-transparent rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-radial from-accent/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}

export function ParticleField({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <Particles count={30} speed={0.5} color="#3b82f6" size={3} />
      <FloatingElements />
    </div>
  );
}