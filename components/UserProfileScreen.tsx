
import React, { useRef, useState } from 'react';
import { UserStats } from '../types';
import { updateProfile } from '../services/storageService';
import { supabase } from '../services/supabaseClient';

interface UserProfileScreenProps {
    stats: UserStats;
    onConnectSocial: (platform: 'x') => void;
    onRefresh?: () => void;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ stats, onConnectSocial, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(stats.username);
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Calculate Achievements
    const achievements = [
        { id: 1, label: "First Step", icon: "🌱", earned: stats.totalMinutes > 0 },
        { id: 2, label: "Deep Focus", icon: "🧘", earned: stats.totalMinutes >= 120 },
        { id: 3, label: "On Fire", icon: "🔥", earned: stats.currentStreak >= 3 },
        { id: 4, label: "Shameless", icon: "🤡", earned: stats.shameCount > 0 },
        { id: 5, label: "Risk Taker", icon: "🔒", earned: stats.isConnectedToX },
    ];

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile(stats.username, reader.result as string);
                onRefresh?.();
            };
            reader.readAsDataURL(file);
        }
    };

    const saveName = () => {
        updateProfile(editName, stats.avatarUrl);
        setIsEditing(false);
        onRefresh?.();
    };

    const handleConnectX = async () => {
        setIsConnecting(true);
        setErrorMsg(null);

        try {
            // Construct the return URL to be /user so they see the connection success immediately
            const returnTo = `${window.location.origin}/user`;

            const { data, error } = await supabase.auth.linkIdentity({
                provider: 'twitter',
                options: {
                    redirectTo: returnTo
                }
            });

            if (error) throw error;

            // For linkIdentity, it might redirect immediately, so we might not reach here.
            // But if it returns data with a url (for manual redirect flow), we might need to handle it.
            // Usually SDK handles the redirect.

        } catch (err: any) {
            console.error("OAuth Error:", err);
            setErrorMsg("Connection failed. Check console.");
            setIsConnecting(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-neutral-900 text-white overflow-y-auto animate-fade-in pb-24">

            {/* Header Profile */}
            <div className="flex flex-col items-center justify-center pt-10 pb-6 border-b border-neutral-800 bg-neutral-900 relative">

                <div
                    onClick={handleAvatarClick}
                    className="w-24 h-24 bg-neutral-800 rounded-full border-2 border-neutral-700 flex items-center justify-center text-4xl mb-4 relative overflow-hidden cursor-pointer hover:border-white transition-colors group"
                >
                    {stats.avatarUrl ? (
                        <img src={stats.avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <span className="grayscale">👤</span>
                    )}

                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold uppercase">Edit</span>
                    </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                {isEditing ? (
                    <div className="flex items-center gap-2 mb-1">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-neutral-800 border-b border-white text-center font-black uppercase tracking-wider p-1 focus:outline-none"
                            autoFocus
                        />
                        <button onClick={saveName} className="text-green-500 font-bold">✓</button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 mb-1 group cursor-pointer" onClick={() => { setIsEditing(true); setEditName(stats.username); }}>
                        <h2 className="text-2xl font-black uppercase tracking-wider">{stats.username}</h2>
                        <span className="opacity-0 group-hover:opacity-50 text-xs">✏️</span>
                    </div>
                )}

                <p className="text-neutral-500 text-sm font-mono">Productivity Subject</p>
            </div>

            <div className="p-6 space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-neutral-800 p-4 rounded-xl flex flex-col items-center justify-center text-center border border-neutral-700">
                        <span className="text-3xl font-black text-white tabular-nums">{stats.totalMinutes}</span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mt-1">Focus Mins</span>
                    </div>
                    <div className="bg-neutral-800 p-4 rounded-xl flex flex-col items-center justify-center text-center border border-neutral-700">
                        <span className="text-3xl font-black text-yellow-400 tabular-nums">{stats.currentStreak}</span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mt-1">Day Streak</span>
                    </div>
                    <div className="bg-neutral-800 p-4 rounded-xl flex flex-col items-center justify-center text-center border border-neutral-700">
                        <span className="text-3xl font-black text-red-500 tabular-nums">{stats.shameCount}</span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mt-1">Shames</span>
                    </div>
                </div>

                {/* Social Connections */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase text-neutral-500 tracking-widest">Risk Integrations</h3>

                    {/* Twitter / X */}
                    <div className="flex items-center justify-between bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.isConnectedToX ? 'bg-white text-black' : 'bg-neutral-700 text-neutral-500'}`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </div>
                            <div>
                                <div className="font-bold text-sm text-white">X (Twitter)</div>
                                <div className="text-[10px] text-neutral-400">
                                    {stats.isConnectedToX ? 'Auto-Post Enabled' : 'Connect for Public Shame'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleConnectX}
                            disabled={stats.isConnectedToX || isConnecting}
                            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${stats.isConnectedToX
                                ? 'border-green-500/50 text-green-500 bg-green-500/10 cursor-not-allowed'
                                : 'bg-white text-black border-white hover:bg-neutral-200'
                                }`}
                        >
                            {isConnecting ? '...' : (stats.isConnectedToX ? 'Locked' : 'Connect')}
                        </button>
                    </div>
                    {errorMsg && <p className="text-xs text-red-500 text-right">{errorMsg}</p>}
                </div>

                {/* Achievements / Logros */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase text-neutral-500 tracking-widest">Achievements</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {achievements.map((ach) => (
                            <div key={ach.id} className={`flex items-center p-3 rounded-lg border ${ach.earned ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-900 border-neutral-800 opacity-50'}`}>
                                <div className="text-2xl mr-4 grayscale-0">{ach.icon}</div>
                                <div className="flex-1">
                                    <div className={`font-bold text-sm ${ach.earned ? 'text-white' : 'text-neutral-500'}`}>{ach.label}</div>
                                </div>
                                {ach.earned && <div className="text-green-500 font-bold text-xs uppercase tracking-wider">Unlocked</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileScreen;
