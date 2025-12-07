import React, { useEffect, useState } from 'react';

interface FocusScreenProps {
  durationMinutes: number;
  onComplete: () => void;
  onFail: () => void;
}

const FocusScreen: React.FC<FocusScreenProps> = ({ durationMinutes, onComplete, onFail }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  
  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Calculate progress for a visual bar or ring (simplified here to just text/bg)
  const progress = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="relative flex flex-col h-full w-full bg-yellow-400 text-black items-center justify-center overflow-hidden">
      
      {/* Background Progress Filler */}
      <div 
        className="absolute bottom-0 left-0 w-full bg-black/10 transition-all duration-1000 ease-linear"
        style={{ height: `${progress}%` }}
      />

      <div className="z-10 text-center space-y-8">
        <h2 className="text-xl font-black uppercase tracking-widest opacity-60">
          Do Not Leave
        </h2>
        
        <div className="text-[20vw] font-black leading-none tracking-tighter tabular-nums">
          {formatTime(timeLeft)}
        </div>

        <div className="px-8">
            <button 
                onClick={onFail}
                className="group relative px-8 py-4 bg-transparent border-4 border-black text-black font-black uppercase tracking-widest hover:bg-black hover:text-yellow-400 transition-colors"
            >
                <span className="group-hover:hidden">I Give Up</span>
                <span className="hidden group-hover:inline">Accept Shame</span>
            </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center text-xs font-bold uppercase tracking-widest opacity-40 z-10 w-full px-8">
          Leaving this app triggers the alarm
      </div>
    </div>
  );
};

export default FocusScreen;