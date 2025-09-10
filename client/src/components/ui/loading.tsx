import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ className, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12", 
    lg: "w-20 h-20"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        {/* Outer Ring */}
        <div className={cn("animate-spin rounded-full border-4 border-muted border-t-primary", sizeClasses[size])}></div>
        
        {/* Inner Ring */}
        <div className={cn("absolute inset-2 animate-spin rounded-full border-2 border-muted border-b-accent", "animate-reverse-spin")}></div>
        
        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse font-medium">{text}</p>
      )}
    </div>
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl", className)}></div>
  );
}

export function Loading3D({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 animate-spin">
          <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingOrb({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-2 w-12 h-12 bg-gradient-to-r from-accent via-purple-500 to-primary rounded-full animate-spin"></div>
        <div className="absolute inset-4 w-8 h-8 bg-white rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}