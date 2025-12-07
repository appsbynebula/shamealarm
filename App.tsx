
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppPhase, TimerConfig, ShameContent, UserStats } from './types';
import SetupScreen from './components/SetupScreen';
import FocusScreen from './components/FocusScreen';
import ShameScreen from './components/ShameScreen';
import UserProfileScreen from './components/UserProfileScreen';
import AuthScreen from './components/AuthScreen';
import TabBar from './components/TabBar';
import { generateShame } from './services/geminiService';
import { startAlarm, stopAlarm, playBuffer, getAudioContext, playLoginSound } from './services/audioService';
import { getStats, updateStatsOnSuccess, updateStatsOnShame, setUserId, setTwitterConnected } from './services/storageService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { triggerConfetti, triggerSmallBurst } from './services/confettiService';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.ONBOARDING);
  const [activeTab, setActiveTab] = useState<'timer' | 'user'>('timer');
  
  const [timerConfig, setTimerConfig] = useState<TimerConfig | null>(null);
  const [shameContent, setShameContent] = useState<ShameContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(getStats());

  // Use refs for values needed inside event listeners
  const phaseRef = useRef(phase);
  const strictModeRef = useRef(false);
  const preloadedShameRef = useRef<ShameContent | null>(null);

  // Check Supabase Session on Mount
  useEffect(() => {
    const checkSession = async () => {
        if (isSupabaseConfigured()) {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                const user = data.session.user;
                setUserId(user.id);
                
                // Check if connected to Twitter via identities
                const isTwitterConnected = user.identities?.some(id => id.provider === 'twitter') || false;
                if (isTwitterConnected) {
                    setTwitterConnected(true);
                }

                setUserStats(getStats());
                setPhase(AppPhase.SETUP);
                return;
            }
        }
        setPhase(AppPhase.ONBOARDING);
    };
    checkSession();
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      if (phaseRef.current === AppPhase.FOCUS && strictModeRef.current) {
        triggerShame();
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (phase === AppPhase.SETUP && !preloadedShameRef.current) {
       loadShameInBackground();
    }
  }, [phase]);

  const loadShameInBackground = async () => {
      const content = await generateShame();
      preloadedShameRef.current = content;
  };

  const handleStart = async (config: TimerConfig) => {
    setIsLoading(true);
    setTimerConfig(config);
    strictModeRef.current = config.strictMode;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (!preloadedShameRef.current) {
        preloadedShameRef.current = await generateShame();
    }
    
    setShameContent(preloadedShameRef.current);
    setIsLoading(false);
    setPhase(AppPhase.FOCUS);
  };

  const triggerShame = () => {
    if (phaseRef.current === AppPhase.SHAME) return;

    setPhase(AppPhase.SHAME);
    const newStats = updateStatsOnShame();
    setUserStats(newStats);
    
    startAlarm();

    if (shameContent?.audioBuffer) {
        playBuffer(shameContent.audioBuffer);
    }

    setTimeout(() => {
        stopAlarm();
    }, 3000);
  };

  const handleComplete = () => {
    setPhase(AppPhase.SUCCESS);
    stopAlarm();
    triggerConfetti(); // Celebration confetti
    if (timerConfig) {
        const newStats = updateStatsOnSuccess(timerConfig.minutes);
        setUserStats(newStats);
    }
  };

  const handleReset = () => {
    stopAlarm();
    preloadedShameRef.current = null;
    setPhase(AppPhase.SETUP);
    setActiveTab('timer');
  };

  const handleConnectSocial = (platform: 'x') => {
      // This is mainly a callback for UI updates if needed, 
      // but the real work happens in the component or via redirect
      if (platform === 'x') {
          const newStats = setTwitterConnected(true);
          setUserStats(newStats);
      }
  };

  const handleAuthComplete = () => {
      // Trigger dopamine sound
      playLoginSound();
      // Trigger visual celebration
      triggerConfetti();
      
      // Upon auth success, reload stats for the new user ID
      setUserStats(getStats());
      setPhase(AppPhase.SETUP);
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans relative bg-neutral-900">
      
      {phase === AppPhase.ONBOARDING && (
          <AuthScreen onComplete={handleAuthComplete} />
      )}

      {phase === AppPhase.SETUP && (
        <>
            <div className="h-full w-full pb-20">
                {activeTab === 'timer' && (
                    <SetupScreen 
                        onStart={handleStart} 
                        isLoading={isLoading} 
                    />
                )}
                {activeTab === 'user' && (
                    <UserProfileScreen 
                        stats={userStats}
                        onConnectSocial={handleConnectSocial}
                    />
                )}
            </div>
            
            <TabBar activeTab={activeTab} onChange={setActiveTab} />
        </>
      )}

      {phase === AppPhase.FOCUS && timerConfig && (
        <div className="absolute top-0 left-0 w-full h-full z-50">
            <FocusScreen 
            durationMinutes={timerConfig.minutes} 
            onComplete={handleComplete} 
            onFail={triggerShame}
            />
        </div>
      )}

      {phase === AppPhase.SHAME && shameContent && (
        <div className="absolute top-0 left-0 w-full h-full z-50">
            <ShameScreen content={shameContent} onReset={handleReset} />
        </div>
      )}

      {phase === AppPhase.SUCCESS && (
        <div className="absolute top-0 left-0 flex flex-col h-full w-full bg-green-500 text-black items-center justify-center p-8 animate-fade-in text-center z-50">
           <h1 className="text-6xl font-black uppercase mb-4 tracking-tighter">You Did It</h1>
           <p className="text-xl font-bold mb-12">Total Focus: {userStats.totalMinutes} mins</p>
           <button 
             onClick={handleReset}
             className="px-10 py-5 bg-black text-white font-bold uppercase tracking-widest hover:scale-105 transition-transform"
           >
             Again
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
