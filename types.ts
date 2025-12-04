
export type MathOperation = '+' | '-' | '*';

export interface MathProblem {
  id: string;
  expression: string;
  answer: number;
}

export interface GameStats {
  correct: number;
  total: number;
  maxCombo: number;
  avgTimeMs: number;
  level: number; // The N-Back level played
  history: {
    problem: MathProblem;
    userAnswer: number | null;
    isCorrect: boolean;
    timeMs: number;
  }[];
}

export type GameState = 'menu' | 'playing' | 'transition' | 'results';

export interface NBackConfig {
  n: number;
  problemCount: number; // Total new problems to generate (e.g., 20)
}

// Track stats across the entire session (multiple levels)
export interface SessionStats {
  maxLevel: number;
  totalCorrect: number;
  totalProblems: number;
  levelStats: GameStats[];
}
