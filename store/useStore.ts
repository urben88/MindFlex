import { create } from 'zustand';
import { UserCache, ViewState, GameId, GameResult, ExerciseTemplate, GuidePack } from '../types';
import { cacheService } from '../services/cacheService';
import { recommenderService } from '../services/recommenderService';
import { GAME_DEFINITIONS, EXERCISE_TEMPLATES } from '../constants';

interface State {
  view: ViewState;
  cache: UserCache;
  activeGameId: GameId | null;
  activeExercise: ExerciseTemplate | null;
  activeGuide: GuidePack | null;
  lastResult: GameResult | null;
  
  // Actions
  init: () => void;
  navigate: (view: ViewState) => void;
  startGame: (id: GameId) => void;
  exitGame: () => void;
  startExercise: (ex: ExerciseTemplate) => void;
  completeGame: (result: GameResult) => void;
  resetProgress: () => void;
  getRecommendation: () => { game: GameId; exercise: ExerciseTemplate };
  replayLastGame: () => void;
  openGuide: (guide: GuidePack) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<State>((set, get) => ({
  view: 'home',
  cache: cacheService.load(),
  activeGameId: null,
  activeExercise: null,
  activeGuide: null,
  lastResult: null,

  init: () => {
    const loaded = cacheService.load();
    const updated = cacheService.updateStreak(loaded);
    if (updated.lastVisitDate !== loaded.lastVisitDate) {
      cacheService.save(updated);
    }
    set({ cache: updated });
  },

  navigate: (view) => set({ view, activeGameId: null, activeExercise: null, activeGuide: null }),

  startGame: (id) => set({ view: 'active_game', activeGameId: id, lastResult: null }),

  exitGame: () => set({ view: 'games', activeGameId: null, lastResult: null }),

  startExercise: (ex) => set({ view: 'active_exercise', activeExercise: ex }),

  openGuide: (guide) => set({ view: 'guide_details', activeGuide: guide }),

  completeGame: (result) => {
    const state = get();
    const currentStats = state.cache.gameStats[result.gameId];
    
    // Calculate new stats
    const newPlays = currentStats.plays + 1;
    const newAvg = ((currentStats.avgAccuracy * currentStats.plays) + result.accuracy) / newPlays;
    const newHigh = Math.max(currentStats.highScore, result.score);

    const newStats = {
      plays: newPlays,
      avgAccuracy: newAvg,
      highScore: newHigh,
      lastPlayed: Date.now()
    };

    const newHistory = [result, ...state.cache.history].slice(0, 50);

    const newCache = {
      ...state.cache,
      gameStats: {
        ...state.cache.gameStats,
        [result.gameId]: newStats
      },
      history: newHistory
    };

    cacheService.save(newCache);
    
    // Instead of going to 'games', go to summary
    set({ cache: newCache, view: 'game_summary', lastResult: result, activeGameId: null });
  },

  resetProgress: () => {
    const empty = cacheService.reset();
    set({ cache: empty, view: 'home' });
  },

  getRecommendation: () => {
    const { cache } = get();
    const allGames = Object.keys(GAME_DEFINITIONS) as GameId[];
    return recommenderService.suggestNextActivity(cache, allGames, EXERCISE_TEMPLATES);
  },

  replayLastGame: () => {
    const { lastResult } = get();
    if (lastResult) {
      set({ view: 'active_game', activeGameId: lastResult.gameId, lastResult: null });
    }
  },

  toggleDarkMode: () => {
    const { cache } = get();
    const newCache = {
      ...cache,
      settings: {
        ...cache.settings,
        darkMode: !cache.settings.darkMode
      }
    };
    cacheService.save(newCache);
    set({ cache: newCache });
  }
}));