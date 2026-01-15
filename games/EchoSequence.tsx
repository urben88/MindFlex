
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, EchoSequenceConfig, DifficultyLevel } from '../types';
import { ttsService } from '../services/ttsService';
import { Mic, Delete, Play, Volume2 } from 'lucide-react';

interface Props {
  config: EchoSequenceConfig;
  difficulty: DifficultyLevel;
}

export const EchoSequenceGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame, triggerSuccess } = useStore();
  const { startLength, speechRate, multiplier } = config;

  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(startLength);
  const [status, setStatus] = useState<'idle' | 'playing' | 'input' | 'feedback'>('idle');
  const [score, setScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    return () => ttsService.cancel();
  }, []);

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10));
  };

  const startRound = (len: number) => {
    const newSeq = generateSequence(len);
    setSequence(newSeq);
    setUserSequence([]);
    setStatus('playing');
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    await new Promise(r => setTimeout(r, 800));
    for (let i = 0; i < seq.length; i++) {
      ttsService.speak(seq[i].toString(), speechRate);
      const delay = (1000 / speechRate) + 200; 
      await new Promise(r => setTimeout(r, delay));
    }
    setStatus('input');
  };

  const handleInput = (digit: number) => {
    if (status !== 'input') return;
    const newUserSeq = [...userSequence, digit];
    setUserSequence(newUserSeq);
    if (newUserSeq.length === sequence.length) {
      checkResult(newUserSeq);
    }
  };

  const checkResult = (input: number[]) => {
    setStatus('feedback');
    const isCorrect = input.every((val, index) => val === sequence[index]);
    if (isCorrect) {
      triggerSuccess();
      const points = Math.round(level * 120 * multiplier);
      setScore(s => s + points);
      setTimeout(() => {
        setRoundsPlayed(r => r + 1);
        setLevel(l => l + 1);
        startRound(level + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        finishGame(score);
      }, 1500);
    }
  };

  const finishGame = (finalScore: number) => {
    const result: GameResult = {
      gameId: 'echo-sequence',
      score: finalScore,
      accuracy: roundsPlayed > 0 ? 1.0 : 0,
      maxLevel: level - 1,
      durationSeconds: (Date.now() - startTimeRef.current) / 1000,
      timestamp: Date.now(),
      difficulty
    };
    completeGame(result);
  };

  if (status === 'idle') {
     return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 bg-white dark:bg-black transition-colors">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full">
           <Mic size={48} className="text-secondary dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Eco Verbal</h2>
          <p className="text-slate-500 dark:text-slate-300">
            Escucharás una serie de números hablados. 
            Espera a que termine y escríbelos en el orden correcto.
          </p>
        </div>
        <button 
          onClick={() => { startTimeRef.current = Date.now(); startRound(level); }}
          className="bg-primary dark:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <Play fill="currentColor" />
          <span>Escuchar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black transition-colors">
      <div className="flex justify-between items-center p-4">
        <div className="text-sm font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">NIVEL {level - startLength + 1}</div>
        <div className="text-xl font-bold text-primary dark:text-indigo-400">{score}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
        {status === 'playing' && (
          <div className="animate-pulse">
             <Volume2 size={80} className="text-primary dark:text-indigo-400 opacity-50" />
          </div>
        )}

        {status === 'input' && (
          <div className="flex flex-col items-center space-y-4 w-full px-8">
            <p className="text-slate-400 dark:text-neutral-500 text-sm font-bold uppercase tracking-widest">Repite la secuencia</p>
            <div className="h-12 w-full flex items-center justify-center space-x-2">
                 {userSequence.map((n, i) => (
                     <div key={i} className="text-3xl font-bold text-slate-800 dark:text-white animate-in zoom-in">{n}</div>
                 ))}
                 <div className="w-1 h-8 bg-slate-300 dark:bg-neutral-800 animate-pulse" />
            </div>
          </div>
        )}

        {status === 'feedback' && (
          <div className="text-2xl font-bold">
            {userSequence.every((val, i) => val === sequence[i]) ? (
              <span className="text-green-500">¡Correcto!</span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-red-500 mb-2">¡Incorrecto!</span>
                <span className="text-slate-400 dark:text-neutral-600 text-sm">Era: {sequence.join(' - ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] p-4 pb-8 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] transition-colors">
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              disabled={status !== 'input'}
              onClick={() => handleInput(num)}
              className="h-16 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-2xl font-bold text-slate-700 dark:text-slate-200 active:bg-slate-100 dark:active:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50"
            >
              {num}
            </button>
          ))}
          <button 
             disabled={status !== 'input' || userSequence.length === 0}
             onClick={() => setUserSequence(prev => prev.slice(0, -1))}
             className="h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-500 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
          >
            <Delete size={24} />
          </button>
          <button
            disabled={status !== 'input'}
            onClick={() => handleInput(0)}
            className="h-16 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-2xl font-bold text-slate-700 dark:text-slate-200 active:bg-slate-100 dark:active:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50"
          >
            0
          </button>
        </div>
      </div>
    </div>
  );
};
