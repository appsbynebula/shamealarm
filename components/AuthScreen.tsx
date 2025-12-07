import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { setUserId, updateProfile } from '../services/storageService';

interface AuthScreenProps {
  onComplete: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured()) {
        // MOCK MODE if no keys provided
        setTimeout(() => {
            setUserId(email); // Use email as mock ID
            updateProfile(email.split('@')[0], null);
            setLoading(false);
            onComplete();
        }, 1000);
        return;
    }

    try {
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            if (data.user) {
                setUserId(data.user.id);
                updateProfile(email.split('@')[0], null);
                onComplete();
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            if (data.user) {
                setUserId(data.user.id);
                // We don't overwrite profile on login, just load stats via ID
                onComplete();
            }
        }
    } catch (err: any) {
        setError(err.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white p-8 items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm">
        <h1 className="text-5xl font-black text-yellow-400 mb-2 tracking-tighter leading-none">
          SHAME<br/>ALARM
        </h1>
        <p className="text-neutral-400 mb-8">
            {isSignUp ? 'Create an account to track your failures.' : 'Login to continue your suffering.'}
        </p>

        {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm font-bold">
                {error}
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email (Gmail recommended)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              required
              className="w-full bg-neutral-900 border-b-2 border-neutral-700 p-4 text-lg font-bold focus:outline-none focus:border-yellow-400 placeholder-neutral-700 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-neutral-900 border-b-2 border-neutral-700 p-4 text-lg font-bold focus:outline-none focus:border-yellow-400 placeholder-neutral-700 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors mt-8 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-neutral-500 text-sm font-bold hover:text-white underline decoration-neutral-700"
            >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;