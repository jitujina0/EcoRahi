import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-primary via-purple-600 to-accent text-white rounded-2xl w-14 h-14 shadow-2xl hover:scale-125 transition-all duration-500 animate-float-3d group relative overflow-hidden border-2 border-white/20"
      size="icon"
      data-testid="scroll-to-top"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {/* Icon */}
      <ChevronUp className="h-6 w-6 relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
      
      {/* Pulse Ring */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping"></div>
    </Button>
  );
}