
export enum AppPhase {
  ONBOARDING = 'ONBOARDING',
  SETUP = 'SETUP',
  FOCUS = 'FOCUS',
  SHAME = 'SHAME',
  SUCCESS = 'SUCCESS'
}

export interface ShameContent {
  text: string;
  audioBuffer?: AudioBuffer;
}

export interface TimerConfig {
  minutes: number;
  strictMode: boolean;
}

export interface UserStats {
  username: string;
  avatarUrl: string | null;
  totalMinutes: number;
  currentStreak: number;
  lastFocusDate: string | null; // ISO date string
  shameCount: number;
  isConnectedToX: boolean;
}
