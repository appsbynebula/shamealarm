import React, { useEffect, useState } from 'react';
import { ShameContent } from '../types';

interface ShameScreenProps {
  content: ShameContent;
  onReset: () => void;
}

type ShamePhase = 'ALARM' | 'POSTING' | 'POSTED';

const ShameScreen: React.FC<ShameScreenProps> = ({ content, onReset }) => {
  const [phase, setPhase] = useState<ShamePhase>('ALARM');
  
  // Logic for the phases
  useEffect(() => {
    // Phase 1: Alarm runs for 3 seconds (controlled by parent Audio, but visual here)
    const timer1 = setTimeout(() => {
      setPhase('POSTING');
    }, 3000);

    // Phase 2: "Posting" takes 2 seconds
    const timer2 = setTimeout(() => {
      setPhase('POSTED');
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={`flex flex-col h-full w-full items-center justify-center p-6 text-center transition-colors duration-500 
      ${phase === 'ALARM' ? 'bg-red-600 shake-hard text-white' : 'bg-black text-white'}`}
    >
      
      {/* PHASE 1: ALARM / CHAOS */}
      {phase === 'ALARM' && (
        <>
            <div className="mb-8">
                <h1 className="text-8xl font-black uppercase tracking-tighter mb-4 animate-pulse">
                SHAME!
                </h1>
                <p className="text-3xl font-bold">
                YOU FAILED.
                </p>
            </div>
            <div className="text-9xl">🚨</div>
        </>
      )}

      {/* PHASE 2: POSTING SIMULATION */}
      {phase === 'POSTING' && (
        <div className="w-full max-w-md space-y-8 animate-fade-in">
             <div className="text-6xl mb-4">⏳</div>
             <h2 className="text-2xl font-bold uppercase tracking-widest">
                 Auto-Publishing...
             </h2>
             <div className="w-full bg-neutral-800 h-4 rounded-full overflow-hidden">
                 <div className="h-full bg-[#1DA1F2] animate-[loading_2s_ease-in-out_forwards]" style={{ width: '0%' }}></div>
             </div>
             <p className="text-neutral-500 font-mono text-sm">
                 Authenticating with X API...<br/>
                 Uploading Failure Log...
             </p>
             
             <style>{`
                @keyframes loading {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
             `}</style>
        </div>
      )}

      {/* PHASE 3: POSTED RESULT */}
      {phase === 'POSTED' && (
        <div className="animate-fade-in w-full max-w-md">
            <div className="text-green-500 text-6xl mb-6">✓</div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-white">
                Shame Published
            </h2>

            <div className="bg-white text-black p-6 rounded-xl text-left border border-neutral-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1DA1F2]"></div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                    <div>
                        <div className="font-bold text-sm">Me (The Failure)</div>
                        <div className="text-neutral-500 text-xs">@weak_mindset • Just now</div>
                    </div>
                </div>
                <p className="text-xl font-bold font-sans leading-tight mb-4">
                "{content.text}"
                </p>
                <div className="text-[#1DA1F2] text-sm font-bold">#ShameAlarm #Failed</div>
            </div>

            <div className="mt-12 space-y-4">
                <button 
                    onClick={onReset}
                    className="w-full py-4 bg-neutral-800 text-white font-bold uppercase tracking-widest hover:bg-neutral-700 transition-colors rounded"
                >
                    Accept & Restart
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ShameScreen;