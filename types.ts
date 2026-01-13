export type GameId = 'nback' | 'sequence' | 'memory' | 'stroop' | 'snapshot' | 'audio-nback' | 'echo-sequence' | 'story-listener';
export type ViewState = 'home' | 'games' | 'exercises' | 'stats' | 'settings' | 'active_game' | 'active_exercise' | 'game_summary' | 'guide_details' | 'casillero';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface GameResult {
  gameId: GameId;
  score: number;
  accuracy: number; // 0-1
  maxLevel: number;
  durationSeconds: number;
  timestamp: number;
  difficulty: DifficultyLevel; // Track which difficulty was played
}

export interface GameStats {
  plays: number;
  highScore: number;
  avgAccuracy: number;
  lastPlayed: number;
  // ... rest of interfaces remain the same
}

export interface UserCache {
  dailyStreak: number;
  lastVisitDate: string; // YYYY-MM-DD
  gameStats: Record<GameId, GameStats>;
  history: GameResult[]; // Limit to last 50 for storage size
  settings: {
    soundEnabled: boolean;
    difficultyMultiplier: number; // 0.8 (easy) to 1.5 (hard)
  };
}

export interface ExerciseTemplate {
  id: string;
  title: string;
  description: string;
  type: 'visualization' | 'association' | 'observation' | 'auditory' | 'encoding';
  benefits: string; // New field for educational context
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
}

// Structured content for interactive exercises
export interface ExerciseContent {
  instruction: string;
  steps: string[];      // Step-by-step guide
  items: string[];      // Words/Objects to use
  example: string;      // AI generated example of how to do it
  mechanic: 'timer' | 'input' | 'flip' | 'audio_list';
}

export interface ExerciseSession {
  templateId: string;
  content: ExerciseContent; // Changed from string to structured object
  completed: boolean;
}

export interface GuidePack {
  id: string;
  title: string;
  question: string; // Rhetorical question
  description: string;
  science: string;
  recommendedGames: GameId[];
  recommendedExercises: string[]; // Exercise IDs
  color: string;
  iconName: string;
}

export interface StoryGameData {
  text: string;
  question: string;
  options: string[];
  correctIndex: number;
}

// --- Game Specific Configs ---

export interface BaseGameConfig {
  multiplier: number;
}

export interface NBackConfig extends BaseGameConfig {
  n: number;
  speedMs: number;
  totalTurns: number;
}

export interface SequenceConfig extends BaseGameConfig {
  startLength: number;
  displayTimeMs: number;
}

export interface StroopConfig extends BaseGameConfig {
  timeLimit: number;
  conflictProbability: number;
}

export interface MemoryConfig extends BaseGameConfig {
  pairCount: number;
  previewTimeMs: number;
  rounds: number;
}

export interface SnapshotConfig extends BaseGameConfig {
  itemsCount: number;
  memorizeTimeMs: number;
  rounds: number;
}

export interface AudioNBackConfig extends BaseGameConfig {
  n: number;
  speedMs: number; // Time between spoken letters
  totalTurns: number;
}

export interface EchoSequenceConfig extends BaseGameConfig {
  startLength: number;
  speechRate: number; // 0.8 to 1.5
}

export interface StoryListenerConfig extends BaseGameConfig {
  storyLengthWords: number; // Approx length
  questionComplexity: 'simple' | 'inference';
}

// Union type for passing to components
export type GameConfig = NBackConfig | SequenceConfig | StroopConfig | MemoryConfig | SnapshotConfig | AudioNBackConfig | EchoSequenceConfig | StoryListenerConfig;