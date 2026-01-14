
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, AudioNBackConfig, DifficultyLevel } from '../types';
import { ttsService } from '../services/ttsService';
import { Ear, Volume2, Play } from 'lucide-react';

interface Props {
  config: AudioNBackConfig;
  difficulty: DifficultyLevel;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'H', 'J', 'K', 'L', 'M', 'O', 'P', 'R', 'S', 'T'];

export const AudioNBackGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame } = useStore();
  const { n: N, totalTurns: TOTAL_TURNS, speedMs: SPEED_MS, multiplier } = config;

  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef(Date.now());
  // Fix: Initialize timerRef with undefined to fix 'Expected 1 arguments' error
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Generate full sequence upfront
    const seq = [];
    for (let i = 0; i < TOTAL_TURNS; i++) {
      if (i >= N && Math.random() < 0.35) {
        seq.push(seq[i - N]); // Force match
      } else {
        seq.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
      }
    }
    setSequence(seq);
    
    return () => {
      if (timerRef.current !== undefined) clearInterval(timerRef.current);
      ttsService.cancel();
    };
  }, []);

  const startGameLoop = () => {
    setIsPlaying(true);
    let idx = -1;
    startTimeRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      idx++;
      if (idx >= TOTAL_TURNS) {
        endGame(hits, misses, score); 
        return;
      }
      
      setCurrentIndex(idx);
      setFeedback(null);
      ttsService.speak(sequence[idx], 1.2);
    }, SPEED_MS);
  };

  const endGame = (finalHits: number, finalMisses: number, finalScore: number) => {
    if (timerRef.current !== undefined) clearInterval(timerRef.current);
    const accuracy = finalHits / ((finalHits + finalMisses) || 1);
    
    const result: GameResult = {
      gameId: 'audio-nback',
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
    const points = Math.round(150 * multiplier); // Higher points for audio difficulty

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

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8">
        <div className="bg-indigo-50 p-6 rounded-full">
           <Volume2 size={48} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Entrenamiento Auditivo</h2>
          <p className="text-slate-500">
            Escucharás una serie de letras. Pulsa el botón cuando la letra actual sea 
            <span className="font-bold text-slate-800"> idéntica a la de hace {N} turnos.</span>
          </p>
        </div>
        <button 
          onClick={startGameLoop}
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <Play fill="currentColor" />
          <span>Comenzar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full py-6">
      <div className="flex justify-between w-full mb-4 px-6">
        <span className="font-bold text-lg text-primary">{score} pts</span>
        <span className="text-slate-400 font-mono">{currentIndex + 1}/{TOTAL_TURNS}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Visualizer Placeholder */}
        <div className="w-48 h-48 rounded-full bg-slate-100 flex items-center justify-center relative mb-8">
             <div className={`absolute inset-0 rounded-full border-4 border-indigo-100 ${currentIndex >= 0 ? 'animate-ping opacity-20' : ''}`}></div>
             <Ear size={64} className="text-slate-300" />
             {feedback === 'correct' && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-4xl">✨</div>
               </div>
             )}
             {feedback === 'wrong' && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-4xl">❌</div>
               </div>
             )}
        </div>

        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Escuchando...</div>
      </div>

      <div className="mt-auto mb-8 w-full px-8">
        <button
          onClick={handleMatch}
          className="w-full bg-primary text-white py-8 rounded-2xl text-2xl font-black shadow-xl active:scale-95 transition-transform border-b-4 border-indigo-800"
        >
          ¡COINCIDE!
        </button>
        <p className="text-center mt-4 text-slate-400 text-xs">
          Match: Letra actual vs. Letra hace {N} pasos
        </p>
      </div>
    </div>
  );
};
