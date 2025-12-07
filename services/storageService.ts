
import { UserStats } from '../types';

// We now append the USER ID (email or auth ID) to the storage key 
// to allow multiple users on same device (simulated)
const BASE_STORAGE_KEY = 'shame_alarm_stats_';

const DEFAULT_STATS: UserStats = {
  username: 'New User',
  avatarUrl: null,
  totalMinutes: 0,
  currentStreak: 0,
  lastFocusDate: null,
  shameCount: 0,
  isConnectedToX: false,
};

let currentUserId = 'guest';

export const setUserId = (id: string) => {
    currentUserId = id;
};

const getStorageKey = () => `${BASE_STORAGE_KEY}${currentUserId}`;

export const getStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(getStorageKey());
    if (!stored) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(stored) };
  } catch (e) {
    console.error("Failed to load stats", e);
    return DEFAULT_STATS;
  }
};

export const saveStats = (stats: UserStats) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save stats", e);
  }
};

export const updateProfile = (username: string, avatarUrl: string | null): UserStats => {
  const stats = getStats();
  const newStats = { ...stats, username, avatarUrl };
  saveStats(newStats);
  return newStats;
};

export const updateStatsOnSuccess = (minutes: number): UserStats => {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  
  let newStreak = stats.currentStreak;
  
  if (stats.lastFocusDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    if (stats.lastFocusDate === yesterdayString) {
      newStreak += 1;
    } else {
      newStreak = 1; 
    }
  }

  const newStats = {
    ...stats,
    totalMinutes: stats.totalMinutes + minutes,
    currentStreak: newStreak,
    lastFocusDate: today
  };
  
  saveStats(newStats);
  return newStats;
};

export const updateStatsOnShame = (): UserStats => {
  const stats = getStats();
  const newStats = {
    ...stats,
    currentStreak: 0, 
    shameCount: stats.shameCount + 1
  };
  saveStats(newStats);
  return newStats;
};

// This manually sets the state if we wanted to force it, 
// but mostly we rely on Supabase session checks now.
export const setTwitterConnected = (connected: boolean): UserStats => {
    const stats = getStats();
    const newStats = { ...stats, isConnectedToX: connected };
    saveStats(newStats);
    return newStats;
}
