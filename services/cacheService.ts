
import { UserCache, GameResult, GameId } from '../types';

const STORAGE_KEY = 'mindflex_v1_cache';

const DEFAULT_CACHE: UserCache = {
  dailyStreak: 0,
  lastVisitDate: '',
  gameStats: {
    nback: { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    sequence: { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    memory: { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    stroop: { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    snapshot: { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    'audio-nback': { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    'echo-sequence': { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    'story-listener': { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
    // Fix: Added missing 'casillero-practice' property to match GameId definition
    'casillero-practice': { plays: 0, highScore: 0, avgAccuracy: 0, lastPlayed: 0 },
  },
  history: [],
  settings: {
    soundEnabled: true,
    darkMode: false,
    difficultyMultiplier: 1.0,
  },
};

export const cacheService = {
  load: (): UserCache => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_CACHE;
      const parsed = JSON.parse(stored);
      // Merge with default to ensure structure integrity after updates
      return { 
        ...DEFAULT_CACHE, 
        ...parsed, 
        settings: { ...DEFAULT_CACHE.settings, ...parsed.settings },
        gameStats: { ...DEFAULT_CACHE.gameStats, ...parsed.gameStats } 
      };
    } catch (e) {
      console.error('Failed to load cache', e);
      return DEFAULT_CACHE;
    }
  },

  save: (data: UserCache) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save cache', e);
    }
  },

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_CACHE;
  },

  updateStreak: (currentCache: UserCache): UserCache => {
    const today = new Date().toISOString().split('T')[0];
    const last = currentCache.lastVisitDate;
    
    let newStreak = currentCache.dailyStreak;

    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (last === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset if skipped a day, or first time
      }
    }

    return {
      ...currentCache,
      dailyStreak: newStreak,
      lastVisitDate: today
    };
  }
};
