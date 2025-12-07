import React from 'react';
import { UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  onToggleConnection: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onToggleConnection }) => {
  return (
    <div className="w-full bg-neutral-900 border-t border-neutral-800 p-6 space-y-6">
      
      {/* Social Connection */}
      <div className="flex items-center justify-between bg-neutral-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.isConnectedToX ? 'bg-[#1DA1F2] text-white' : 'bg-neutral-700 text-neutral-500'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-sm text-white">X / Twitter</span>
             <span className="text-xs text-neutral-400">{stats.isConnectedToX ? 'Connected (Risk Active)' : 'Not Connected'}</span>
          </div>
        </div>
        <button 
            onClick={onToggleConnection}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-colors ${
                stats.isConnectedToX 
                ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
                : 'bg-white text-black border-white hover:bg-neutral-200'
            }`}
        >
            {stats.isConnectedToX ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-800 p-3 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-yellow-400">{stats.totalMinutes}</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Focus Mins</span>
          </div>
          <div className="bg-neutral-800 p-3 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-green-400">{stats.currentStreak}</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Day Streak</span>
          </div>
          <div className="bg-neutral-800 p-3 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-red-500">{stats.shameCount}</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Shames</span>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;