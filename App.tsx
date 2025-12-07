import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppPhase, TimerConfig, ShameContent, UserStats } from './types';
import SetupScreen from './components/SetupScreen';
import FocusScreen from './components/FocusScreen';
import ShameScreen from './components/ShameScreen';
import UserProfileScreen from './components/UserProfileScreen';
import AuthScreen from './components/AuthScreen';
import TabBar from './components/TabBar';
import { generateShame } from './services/geminiService';
import { startAlarm, stopAlarm, playBuffer, getAudioContext, playLoginSound } from './services/audioService';
import { getStats, updateStatsOnSuccess, updateStatsOnShame, setUserId, syncWithUser } from './services/storageService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { triggerConfetti } from './services/confettiService';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.ONBOARDING);

  // No longer need activeTab state, we use Router.

  const [timerConfig, setTimerConfig] = useState<TimerConfig | null>(null);
  const [shameContent, setShameContent] = useState<ShameContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(getStats());

  // Use refs for values needed inside event listeners
  const phaseRef = useRef(phase);
  const strictModeRef = useRef(false);
  const preloadedShameRef = useRef<ShameContent | null>(null);

  // Initialize Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setPhase(AppPhase.ONBOARDING);
      return;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (session?.user) {
        setUserId(session.user.id);

        // FIX REGRESSION: Always fetch fresh user, especially on SIGNED_IN
        const { data: { user: fullUser } } = await supabase.auth.getUser();

        if (fullUser) {
          const syncedStats = syncWithUser(fullUser);
          setUserStats(syncedStats);
        } else {
          const syncedStats = syncWithUser(session.user);
          setUserStats(syncedStats);
        }

        if (phaseRef.current === AppPhase.ONBOARDING) {
          setPhase(AppPhase.SETUP);
        }

        if (event === 'SIGNED_IN') {
          // If we are on /dashboard (default) but detecting a fresh login that might be a redirect callback targeting /user,
          // we can check the URL or just rely on Router. 
          // However, Supabase sometimes strips the path on redirect if not configured perfectly.
          // But if passing ?redirect_to=..., it usually works.
          // Let's force a check: if the stats say connected to X and we are not on /user, maybe nudge? 
          // No, let's keep it simple.
          // BUT user said: "redirige al inicio de sesión" (AuthScreen) -> session was null or phase was ONBOARDING.
          // fix: Ensure phase is set to SETUP immediately.

          if (!phaseRef.current || phaseRef.current === AppPhase.ONBOARDING) {
            setPhase(AppPhase.SETUP);
          }

          // Check if URL suggests we should be at /user (e.g. from hash or query)
          // or simply if we just connected (inferred from stats update)
          if (window.location.href.includes('/user')) {
            // The router should handle this, but let's ensure
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setPhase(AppPhase.ONBOARDING);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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
  };

  const handleConnectSocial = (platform: 'x') => {
    // Logic handled in component, this is just for optimistic UI updates if needed
  };

  const handleAuthComplete = () => {
    playLoginSound();
    triggerConfetti();
    setUserStats(getStats());
    setPhase(AppPhase.SETUP);
    // We don't need to manually route here, AuthScreen usually just shows when !session.
    // If AuthScreen has success logic that doesn't auto-redirect, we might want to navigate.
    // But phase change to SETUP will render the Routes.
  };

  const refreshStats = () => {
    setUserStats(getStats());
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans relative bg-neutral-900">

      {phase === AppPhase.ONBOARDING ? (
        <AuthScreen onComplete={handleAuthComplete} />
      ) : (
        /* Main App Content - Only visible if not in Onboarding */
        <>
          <div className="h-full w-full pb-20">
            <Routes>
              <Route path="/dashboard" element={
                <SetupScreen
                  onStart={handleStart}
                  isLoading={isLoading}
                />
              } />
              <Route path="/user" element={
                <UserProfileScreen
                  stats={userStats}
                  onConnectSocial={handleConnectSocial}
                  onRefresh={refreshStats}
                />
              } />
              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>

          {/* TabBar is always visible in SETUP/Dashboard/User views */}
          <TabBar />

          {/* Overlays for different phases */}
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
        </>
      )}
    </div>
  );
};

export default App;
