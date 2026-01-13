import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, SequenceConfig, DifficultyLevel } from '../types';
import { Delete } from 'lucide-react';

interface Props {
  config: SequenceConfig;
  difficulty: DifficultyLevel;
}

export const SequenceGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame } = useStore();
  const { startLength, displayTimeMs, multiplier } = config;

  const PAUSE_TIME_MS = 200;

  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(startLength);
  const [status, setStatus] = useState<'idle' | 'showing' | 'input' | 'feedback'>('idle');
  const [displayDigit, setDisplayDigit] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const startTimeRef = useRef(Date.now());
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  useEffect(() => {
    startRound(startLength);
  }, []);

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10));
  };

  const startRound = (len: number) => {
    const newSeq = generateSequence(len);
    setSequence(newSeq);
    setUserSequence([]);
    setStatus('showing');
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    await new Promise(r => setTimeout(r, 500));

    for (let i = 0; i < seq.length; i++) {
      setDisplayDigit(seq[i]);
      await new Promise(r => setTimeout(r, displayTimeMs));
      setDisplayDigit(null);
      await new Promise(r => setTimeout(r, PAUSE_TIME_MS));
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

  const handleDelete = () => {
    if (userSequence.length > 0) {
      setUserSequence(prev => prev.slice(0, -1));
    }
  };

  const checkResult = (input: number[]) => {
    setStatus('feedback');
    const isCorrect = input.every((val, index) => val === sequence[index]);

    if (isCorrect) {
      setTimeout(() => {
        setScore(s => s + Math.round(level * 100 * multiplier));
        setRoundsPlayed(r => r + 1);
        setLevel(l => l + 1);
        startRound(level + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        finishGame(score); // Pass score directly to capture closure
      }, 1500);
    }
  };

  const finishGame = (finalScore: number) => {
    const result: GameResult = {
      gameId: 'sequence',
      score: finalScore,
      accuracy: roundsPlayed > 0 ? 1.0 : 0,
      maxLevel: level - 1,
      durationSeconds: (Date.now() - startTimeRef.current) / 1000,
      timestamp: Date.now(),
      difficulty
    };
    completeGame(result);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Info is handled by wrapper now, but we can keep specific stats here if needed, or remove to clean up */}
      <div className="flex justify-between items-center p-4">
        <div className="text-sm font-bold text-slate-400">NIVEL {level - startLength + 1}</div>
        <div className="text-xl font-bold text-primary">{score}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
        {status === 'showing' && (
          <div className="text-9xl font-black text-slate-800 transition-all transform scale-100 animate-in fade-in zoom-in duration-200">
            {displayDigit !== null ? displayDigit : ''}
          </div>
        )}

        {status === 'input' && (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Tu Turno</p>
            <div className="flex space-x-2 h-12">
              {Array.from({ length: sequence.length }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                    i < userSequence.length ? 'bg-primary' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="h-8 text-2xl font-bold text-slate-700 tracking-widest">
              {userSequence.join(' ')}
            </div>
          </div>
        )}

        {status === 'feedback' && (
          <div className="text-2xl font-bold">
            {userSequence.every((val, i) => val === sequence[i]) ? (
              <span className="text-green-500 flex items-center space-x-2">
                 <span>¡Correcto!</span>
              </span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-red-500 mb-2">¡Incorrecto!</span>
                <span className="text-slate-400 text-sm">Era: {sequence.join(' ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-4 pb-8 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              disabled={status !== 'input'}
              onClick={() => handleInput(num)}
              className="h-16 rounded-2xl bg-slate-50 border border-slate-200 text-2xl font-bold text-slate-700 active:bg-slate-100 active:scale-95 transition-all disabled:opacity-50"
            >
              {num}
            </button>
          ))}
          <button 
             disabled={status !== 'input' || userSequence.length === 0}
             onClick={handleDelete}
             className="h-16 rounded-2xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
          >
            <Delete size={24} />
          </button>
          <button
            disabled={status !== 'input'}
            onClick={() => handleInput(0)}
            className="h-16 rounded-2xl bg-slate-50 border border-slate-200 text-2xl font-bold text-slate-700 active:bg-slate-100 active:scale-95 transition-all disabled:opacity-50"
          >
            0
          </button>
          <button className="h-16 rounded-2xl bg-transparent border border-transparent"></button>
        </div>
      </div>
    </div>
  );
};