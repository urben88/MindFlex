import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, NBackConfig, DifficultyLevel } from '../types';

interface Props {
  config: NBackConfig;
  difficulty: DifficultyLevel;
}

export const NBackGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame } = useStore();
  const { n: N, totalTurns: TOTAL_TURNS, speedMs: SPEED_MS, multiplier } = config;

  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const seq = [];
    for (let i = 0; i < TOTAL_TURNS; i++) {
      if (i >= N && Math.random() < 0.3) {
        seq.push(seq[i - N]);
      } else {
        seq.push(Math.floor(Math.random() * 9));
      }
    }
    setSequence(seq);
    startGameLoop();
    return () => {
      if (timerRef.current !== undefined) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startGameLoop = () => {
    let idx = -1;
    timerRef.current = window.setInterval(() => {
      idx++;
      if (idx >= TOTAL_TURNS) {
        endGame(hits, misses, score);
        return;
      }
      setCurrentIndex(idx);
      setActiveCell(sequence[idx]); 
      setFeedback(null);
      setTimeout(() => setActiveCell(null), SPEED_MS * 0.7);
    }, SPEED_MS);
  };
  
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < sequence.length) {
      setActiveCell(sequence[currentIndex]);
      setTimeout(() => setActiveCell(null), SPEED_MS * 0.7);
    }
  }, [currentIndex]);

  const endGame = (finalHits: number, finalMisses: number, finalScore: number) => {
    if (timerRef.current !== undefined) {
      clearInterval(timerRef.current);
    }
    const accuracy = finalHits / ((finalHits + finalMisses) || 1);
    
    const result: GameResult = {
      gameId: 'nback',
      score: finalScore,
      accuracy,
      maxLevel: N,
      durationSeconds: (Date.now() - startTimeRef.current) / 1000,
      timestamp: Date.now(),
      difficulty
    };
    completeGame(result);
  };

  const handleMatch = () => {
    if (currentIndex < N) return;
    
    const isMatch = sequence[currentIndex] === sequence[currentIndex - N];
    const points = Math.round(100 * multiplier);

    if (isMatch) {
      setScore(s => s + points);
      setHits(h => h + 1);
      setFeedback('correct');
    } else {
      setScore(s => Math.max(0, s - Math.round(points / 2)));
      setMisses(m => m + 1);
      setFeedback('wrong');
    }
  };

  return (
    <div className="flex flex-col items-center h-full py-4 bg-slate-50 dark:bg-black transition-colors">
      <div className="flex justify-between w-full mb-4 px-4">
        <span className="font-bold text-lg dark:text-indigo-400">Puntos: {score}</span>
        <span className="text-slate-500 dark:text-neutral-500">{currentIndex + 1}/{TOTAL_TURNS}</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-3 w-64 h-64">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-xl border-2 transition-all duration-200 ${
                activeCell === i 
                  ? 'bg-primary border-primary shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-105' 
                  : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 mb-8 w-full px-8">
        <div className={`text-center h-8 font-bold mb-2 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {feedback === 'correct' ? '¡Bien!' : feedback === 'wrong' ? '¡Fallo!' : ''}
        </div>
        <button
          onClick={handleMatch}
          className="w-full bg-primary text-white py-6 rounded-2xl text-xl font-bold shadow-lg active:scale-95 transition-all"
        >
          ¡COINCIDE! ({N}-Back)
        </button>
        <p className="text-center mt-4 text-slate-500 dark:text-neutral-500 text-sm">
          Pulsa si la posición es igual a la de hace {N} turnos.
        </p>
      </div>
    </div>
  );
};