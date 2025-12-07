import React, { useState, useRef } from 'react';
import { updateProfile } from '../services/storageService';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default name if empty
    const finalName = username.trim() || 'Anonymous Failure';
    updateProfile(finalName, avatar);
    onComplete();
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white p-8 items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm">
        <h1 className="text-5xl font-black text-yellow-400 mb-2 tracking-tighter leading-none">
          SHAME<br/>ALARM
        </h1>
        <p className="text-neutral-400 mb-12">Login to manage your public reputation.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full bg-neutral-800 border-2 border-dashed border-neutral-600 flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors overflow-hidden group"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl group-hover:scale-110 transition-transform">📸</div>
              )}
              
              {!avatar && (
                 <span className="absolute bottom-4 text-[10px] uppercase font-bold text-neutral-500">Upload</span>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name..."
              className="w-full bg-neutral-900 border-b-2 border-neutral-700 p-4 text-xl font-bold focus:outline-none focus:border-yellow-400 placeholder-neutral-700 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors mt-8"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingScreen;