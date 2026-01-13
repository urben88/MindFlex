import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, StroopConfig, DifficultyLevel } from '../types';

interface Props {
  config: StroopConfig;
  difficulty: DifficultyLevel;
}

export const StroopGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame } = useStore();
  const { timeLimit, conflictProbability, multiplier } = config;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  const colors = [
    { name: 'ROJO', class: 'text-red-500', value: 'red' },
    { name: 'AZUL', class: 'text-blue-500', value: 'blue' },
    { name: 'VERDE', class: 'text-green-500', value: 'green' },
    { name: 'AMARILLO', class: 'text-yellow-500', value: 'yellow' },
  ];

  const [currentWord, setCurrentWord] = useState(colors[0]);
  const [inkColor, setInkColor] = useState(colors[1]);
  const [hits, setHits] = useState(0);
  
  // Refs for closure access inside interval
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);

  useEffect(() => {
    nextTurn();
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          finish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextTurn = () => {
    const word = colors[Math.floor(Math.random() * colors.length)];
    let ink = word;
    if (Math.random() < conflictProbability) {
       const others = colors.filter(c => c.value !== word.value);
       ink = others[Math.floor(Math.random() * others.length)];
    }
    setCurrentWord(word);
    setInkColor(ink);
  };

  const handleChoice = (colorValue: string) => {
    const points = Math.round(100 * multiplier);
    
    if (colorValue === inkColor.value) {
      setScore(s => {
          scoreRef.current = s + points;
          return s + points;
      });
      setHits(h => {
          hitsRef.current = h + 1;
          return h + 1;
      });
    } else {
      setScore(s => {
          const newS = Math.max(0, s - Math.round(points / 2));
          scoreRef.current = newS;
          return newS;
      });
    }
    nextTurn();
  };

  const finish = () => {
    // Use refs to get latest values inside interval callback
    const finalScore = scoreRef.current;
    const finalHits = hitsRef.current;
    
    const result: GameResult = {
      gameId: 'stroop',
      score: finalScore,
      accuracy: finalHits / (finalHits + (finalScore > 0 ? 0 : 1)), 
      maxLevel: 1,
      durationSeconds: timeLimit,
      timestamp: Date.now(),
      difficulty
    };
    completeGame(result);
  };

  return (
    <div className="flex flex-col items-center h-full py-6">
      <div className="flex justify-between w-full px-6 mb-8">
        <span className="font-mono text-xl">{timeLeft}s</span>
        <span className="font-bold text-xl">{score} pts</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-slate-400 mb-4">Selecciona el color de la TINTA</p>
        <div className={`text-6xl font-black mb-12 ${inkColor.class}`}>
          {currentWord.name}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full px-6 mb-8">
        {colors.map(c => (
          <button
            key={c.value}
            onClick={() => handleChoice(c.value)}
            className="py-6 rounded-xl bg-white border-2 border-slate-200 shadow-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};