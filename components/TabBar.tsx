import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TabBarProps {
  // activeTab is now derived from location, but we can keep the prop interface or remove it. 
  // For simplicity, let's remove the props and rely on hooks, 
  // BUT App.tsx might still pass them. Let's keep it compatible or update App.tsx first?
  // Actually App.tsx is the consumer. Let's make TabBar self-contained for navigation awareness 
  // OR keep it dumb and let App control it. 
  // implementation_plan said "Update to use Link or useNavigate".
  // Let's make it smarter.
}

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/user') ? 'user' : 'timer';

  return (
    <div className="absolute bottom-0 left-0 w-full h-20 bg-black border-t border-neutral-800 flex items-center justify-around z-50">

      {/* Timer Tab */}
      <button
        onClick={() => navigate('/dashboard')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'timer' ? 'text-yellow-400' : 'text-neutral-600 hover:text-neutral-400'}`}
      >
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Timer</span>
      </button>

      {/* User Tab */}
      <button
        onClick={() => navigate('/user')}
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