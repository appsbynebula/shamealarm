import React from 'react';

interface TabBarProps {
  activeTab: 'timer' | 'user';
  onChange: (tab: 'timer' | 'user') => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onChange }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-20 bg-black border-t border-neutral-800 flex items-center justify-around z-50">
      
      {/* Timer Tab */}
      <button 
        onClick={() => onChange('timer')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'timer' ? 'text-yellow-400' : 'text-neutral-600 hover:text-neutral-400'}`}
      >
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Timer</span>
      </button>

      {/* User Tab */}
      <button 
        onClick={() => onChange('user')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'user' ? 'text-yellow-400' : 'text-neutral-600 hover:text-neutral-400'}`}
      >
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
      </button>

    </div>
  );
};

export default TabBar;