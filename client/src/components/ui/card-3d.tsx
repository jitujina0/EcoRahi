import React from "react";
import { cn } from "@/lib/utils";

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "glass" | "neo" | "glow";
  intensity?: "low" | "medium" | "high";
}

export function Card3D({ 
  children, 
  className, 
  variant = "default", 
  intensity = "medium",
  ...props 
}: Card3DProps) {
  const baseClasses = "relative transition-all duration-500 transform-gpu perspective-1000";
  
  const variantClasses = {
    default: "bg-card border border-border shadow-lg hover:shadow-2xl",
    glass: "glass-morphism border-white/20",
    neo: "neo-morphism border-0",
    glow: "bg-card border border-border shadow-lg hover:shadow-2xl neon-blue"
  };
  
  const intensityClasses = {
    low: "hover:scale-105 hover:-translate-y-1",
    medium: "hover:scale-105 hover:-translate-y-2",
    high: "hover:scale-110 hover:-translate-y-4"
  };
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        intensityClasses[intensity],
        "group cursor-pointer",
        className
      )}
      {...props}
    >
      {/* 3D Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-inherit blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-inherit"></div>
    </div>
  );
}

export function FloatingCard({ children, className, ...props }: Card3DProps) {
  return (
    <Card3D 
      className={cn("animate-float-3d", className)} 
      variant="glass" 
      intensity="medium"
      {...props}
    >
      {children}
    </Card3D>
  );
}

export function MagneticCard({ children, className, ...props }: Card3DProps) {
  return (
    <Card3D 
      className={cn("magnetic", className)} 
      variant="neo" 
      intensity="high"
      {...props}
    >
      {children}
    </Card3D>
  );
}