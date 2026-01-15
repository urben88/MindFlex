
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, CasilleroPracticeConfig, DifficultyLevel } from '../types';
import { Send, AlertCircle, Clock, Lightbulb } from 'lucide-react';
import { CASILLERO_FULL } from '../data/casilleroData';

interface Props {
  config: CasilleroPracticeConfig;
  difficulty: DifficultyLevel;
}

export const CasilleroPracticeGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame, triggerSuccess } = useStore();
  const { maxNumber, rounds, timePerRound, multiplier } = config;

  const [currentRound, setCurrentRound] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [errors, setErrors] = useState<{ p1?: boolean; p2?: boolean }>({});
  const [showSolution, setShowSolution] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<number | undefined>(undefined);
  const correctRoundsRef = useRef(0);

  useEffect(() => {
    generateNewNumbers();
    if (timePerRound > 0) {
        startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const generateNewNumbers = () => {
    const n1 = Math.floor(Math.random() * maxNumber) + 1;
    const n2 = Math.floor(Math.random() * maxNumber) + 1;
    setNumbers([n1, n2]);
    setWord1('');
    setWord2('');
    setErrors({});
    setShowSolution(false);
    setIsProcessing(false);
    if (timePerRound > 0) setTimeLeft(timePerRound);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (isProcessing) return; 
      setTimeLeft(t => {
        if (t <= 1) {
          revealSolutionAndAdvance();
          return timePerRound;
        }
        return t - 1;
      });
    }, 1000);
  };

  const revealSolutionAndAdvance = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setShowSolution(true);

    setTimeout(() => {
      if (currentRound >= rounds) {
        finishGame();
      } else {
        setCurrentRound(r => r + 1);
        generateNewNumbers();
      }
    }, 2500); 
  };

  const wordToNumber = (word: string): string => {
    let s = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    s = s.replace(/ch/g, '8'); 
    s = s.replace(/ll/g, '5'); 
    s = s.replace(/rr/g, '0');
    
    const map: Record<string, string> = {
      t: '1', d: '1',
      n: '2', ñ: '2',
      m: '3',
      c: '4', k: '4', q: '4',
      l: '5',
      s: '6', z: '6',
      f: '7',
      g: '8', j: '8',
      v: '9', b: '9', p: '9',
      r: '0'
    };

    let result = "";
    for (let char of s) {
      if (map[char]) result += map[char];
      else if (['8', '5', '0'].includes(char)) result += char;
    }
    return result;
  };

  const getSolutionWord = (num: number) => {
    return CASILLERO_FULL.find(item => item.number === num)?.word || '?';
  };

  const validate = () => {
    if (isProcessing) return;

    const val1 = wordToNumber(word1);
    const val2 = wordToNumber(word2);
    
    const target1 = numbers[0].toString();
    const target2 = numbers[1].toString();

    const is1Correct = val1 === target1;
    const is2Correct = val2 === target2;

    if (is1Correct && is2Correct) {
      const points = Math.round(100 * multiplier);
      setScore(s => s + points);
      correctRoundsRef.current += 1;
      triggerSuccess();
      
      if (currentRound >= rounds) {
        finishGame();
      } else {
        setCurrentRound(r => r + 1);
        generateNewNumbers();
      }
    } else {
      setErrors({
        p1: !is1Correct,
        p2: !is2Correct
      });
      revealSolutionAndAdvance();
    }
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    const accuracy = correctRoundsRef.current / rounds;
    const result: GameResult = {
      gameId: 'casillero-practice',
      score: score,
      accuracy,
      maxLevel: 1,
      durationSeconds: (Date.now() - startTimeRef.current) / 1000,
      timestamp: Date.now(),
      difficulty
    };
    completeGame(result);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black transition-colors">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">RONDA {currentRound}/{rounds}</div>
            {timePerRound > 0 && (
                <div className={`flex items-center gap-1 font-mono font-bold text-sm transition-colors ${showSolution ? 'text-slate-300' : 'text-amber-500'}`}>
                    <Clock size={14} />
                    {timeLeft}s
                </div>
            )}
        </div>
        <div className="text-xl font-bold text-amber-500 dark:text-amber-400">{score}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {/* Tarjeta Número 1 */}
            <div className={`bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-6 shadow-xl border-2 transition-all flex flex-col items-center space-y-4 relative overflow-hidden ${
                errors.p1 ? 'border-red-400/50 dark:border-red-900/50' : 'border-slate-50 dark:border-neutral-900'
            }`}>
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center font-black text-3xl text-amber-600 dark:text-amber-400 z-10">
                    {numbers[0]}
                </div>
                <div className="w-full relative z-10 text-center">
                    {showSolution ? (
                        <div className="py-3 text-2xl font-black text-amber-500 animate-in zoom-in duration-300">
                            {getSolutionWord(numbers[0])}
                        </div>
                    ) : (
                        <input 
                            type="text"
                            value={word1}
                            autoFocus
                            disabled={isProcessing}
                            onChange={(e) => setWord1(e.target.value)}
                            placeholder="Palabra..."
                            className={`w-full text-center py-3 rounded-xl border-2 bg-transparent dark:text-white font-bold transition-all focus:ring-0 ${
                                errors.p1 ? 'border-red-400 animate-shake' : 'border-slate-100 dark:border-neutral-800 focus:border-amber-500'
                            }`}
                        />
                    )}
                </div>
                {showSolution && <div className="text-[10px] font-bold text-amber-400/60 uppercase tracking-tighter">Solución Oficial</div>}
            </div>

            {/* Tarjeta Número 2 */}
            <div className={`bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-6 shadow-xl border-2 transition-all flex flex-col items-center space-y-4 relative overflow-hidden ${
                errors.p2 ? 'border-red-400/50 dark:border-red-900/50' : 'border-slate-50 dark:border-neutral-900'
            }`}>
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center font-black text-3xl text-amber-600 dark:text-amber-400 z-10">
                    {numbers[1]}
                </div>
                <div className="w-full relative z-10 text-center">
                    {showSolution ? (
                        <div className="py-3 text-2xl font-black text-amber-500 animate-in zoom-in duration-300">
                            {getSolutionWord(numbers[1])}
                        </div>
                    ) : (
                        <input 
                            type="text"
                            value={word2}
                            disabled={isProcessing}
                            onChange={(e) => setWord2(e.target.value)}
                            placeholder="Palabra..."
                            className={`w-full text-center py-3 rounded-xl border-2 bg-transparent dark:text-white font-bold transition-all focus:ring-0 ${
                                errors.p2 ? 'border-red-400 animate-shake' : 'border-slate-100 dark:border-neutral-800 focus:border-amber-500'
                            }`}
                        />
                    )}
                </div>
                {showSolution && <div className="text-[10px] font-bold text-amber-400/60 uppercase tracking-tighter">Solución Oficial</div>}
            </div>
        </div>

        {/* Controles de Ayuda y Validación */}
        <div className="w-full max-w-sm space-y-4">
            <div className="flex gap-2">
                <button 
                    onClick={revealSolutionAndAdvance}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border-2 bg-white border-slate-100 text-slate-400 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-500 disabled:opacity-30"
                >
                    <Lightbulb size={20} />
                    Pista
                </button>
                <button 
                    onClick={validate}
                    disabled={!word1 || !word2 || isProcessing}
                    className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                    {isProcessing ? (
                        <span className="flex items-center gap-2 animate-pulse">
                            REVISANDO...
                        </span>
                    ) : (
                        <>
                            <Send size={20} />
                            VALIDAR
                        </>
                    )}
                </button>
            </div>

            {/* Ayuda visual de reglas */}
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 w-full transition-colors">
                <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase">
                    <AlertCircle size={14} />
                    Sistema Campayo
                </div>
                <p className="text-[10px] text-amber-900/70 dark:text-amber-200 leading-relaxed">
                    Las vocales y la 'h' no cuentan. <br/>
                    <b>52:</b> LuNa (L=5, N=2). <br/>
                    <b>4:</b> oCa (C=4).
                </p>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
