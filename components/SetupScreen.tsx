
import React, { useState, useEffect } from 'react';
import { TimerConfig } from '../types';

interface SetupScreenProps {
  onStart: (config: TimerConfig) => void;
  isLoading: boolean;
}

const HARD_TRUTHS = [
    "\"Discipline is choosing between what you want now and what you want most.\" — Abraham Lincoln",
    "\"Amateurs sit and wait for inspiration, the rest of us just get up and go to work.\" — Stephen King",
    "\"You can't build a reputation on what you are going to do.\" — Henry Ford",
    "\"Action is the foundational key to all success.\" — Pablo Picasso",
    "\"Success is stumbling from failure to failure with no loss of enthusiasm.\" — Winston Churchill",
    "\"Your future is created by what you do today, not tomorrow.\" — Robert Kiyosaki",
    "\"Don't watch the clock; do what it does. Keep going.\" — Sam Levenson",
    "\"The scariest moment is always just before you start.\" — Stephen King",
    "\"If you spend too much time thinking about a thing, you'll never get it done.\" — Bruce Lee",
    "\"He who has a why to live for can bear almost any how.\" — Friedrich Nietzsche"
];

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [minutes, setMinutes] = useState(25);
  const [quote, setQuote] = useState("");
  
  // Presets for quick selection
  const presets = [10, 25, 45, 60];

  useEffect(() => {
      // Pick a random quote on mount
      const randomQuote = HARD_TRUTHS[Math.floor(Math.random() * HARD_TRUTHS.length)];
      setQuote(randomQuote);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900 text-white animate-fade-in overflow-y-auto pb-20">
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full mt-4 mb-8 text-center">
            <h1 className="text-5xl font-black tracking-tighter mb-2 text-yellow-400 leading-none">
            SHAME<br/>ALARM
            </h1>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 mb-12 w-full">
            <div className="relative">
            <span className="text-9xl font-black tabular-nums tracking-tighter">
                {minutes}
            </span>
            <span className="absolute -right-4 top-4 text-xl font-bold text-neutral-500">min</span>
            </div>

            <div className="flex space-x-4">
            {presets.map(m => (
                <button
                key={m}
                onClick={() => setMinutes(m)}
                className={`w-14 h-14 rounded-full font-bold transition-all ${
                    minutes === m 
                    ? 'bg-yellow-400 text-black scale-110' 
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
                >
                {m}
                </button>
            ))}
            </div>
            
            {/* Quote of the Day (Moved here) */}
            <div className="w-full max-w-xs text-center border-t border-b border-neutral-800 py-4">
                <p className="text-[10px] font-bold uppercase text-neutral-600 mb-2 tracking-widest">
                    Daily Reality Check
                </p>
                <p className="text-sm font-medium text-neutral-400 italic font-serif">
                    {quote}
                </p>
            </div>
        </div>

        <button
            onClick={() => onStart({ minutes, strictMode: true })}
            disabled={isLoading}
            className="w-full py-6 bg-white text-black text-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm mb-12 shadow-xl"
        >
            {isLoading ? 'Loading Risk...' : 'Start Risk'}
        </button>

        {/* Strict Mode Warning (Moved here) */}
        <div className="w-full max-w-xs bg-neutral-800 p-4 rounded-xl border border-neutral-700 mb-6">
            <div className="flex items-start gap-3">
                <div className="text-2xl">☠️</div>
                <div>
                    <h3 className="font-bold text-white">Strict Mode Active</h3>
                    <p className="text-xs text-neutral-400 leading-tight mt-1">
                        Closing this app triggers immediate public shame.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;