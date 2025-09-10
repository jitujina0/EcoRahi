import { Compass } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="mb-8">
          <Compass className="h-16 w-16 mx-auto animate-spin" />
        </div>
        <h2 className="text-2xl font-bold mb-4">TravelSmart</h2>
        <p className="text-white/80 mb-6">Preparing your travel experience...</p>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}