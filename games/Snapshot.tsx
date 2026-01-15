
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, SnapshotConfig, DifficultyLevel } from '../types';
import {
  Triangle, Circle, Square, Hexagon, Star, Heart, Cloud, Sun, Moon, Umbrella,
  Coffee, Camera, Zap, Music, Anchor, Ghost, Smile, Bell
} from 'lucide-react';

interface Props {
  config: SnapshotConfig;
  difficulty: DifficultyLevel;
}

const ICONS = [
  { id: 'triangle', Icon: Triangle, label: 'Triángulo' },
  { id: 'circle', Icon: Circle, label: 'Círculo' },
  { id: 'square', Icon: Square, label: 'Cuadrado' },
  { id: 'star', Icon: Star, label: 'Estrella' },
  { id: 'heart', Icon: Heart, label: 'Corazón' },
  { id: 'cloud', Icon: Cloud, label: 'Nube' },
  { id: 'sun', Icon: Sun, label: 'Sol' },
  { id: 'moon', Icon: Moon, label: 'Luna' },
  { id: 'zap', Icon: Zap, label: 'Rayo' },
  { id: 'smile', Icon: Smile, label: 'Carita' },
];

const COLORS = [
  { id: 'red', class: 'text-red-500', bg: 'bg-red-100', label: 'Rojo' },
  { id: 'blue', class: 'text-blue-500', bg: 'bg-blue-100', label: 'Azul' },
  { id: 'green', class: 'text-green-500', bg: 'bg-green-100', label: 'Verde' },
  { id: 'yellow', class: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Amarillo' },
  { id: 'purple', class: 'text-purple-500', bg: 'bg-purple-100', label: 'Morado' },
];

interface SceneItem {
  iconId: string;
  colorId: string;
  x: number;
  y: number;
  rotation: number;
}

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export const SnapshotGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame, triggerSuccess } = useStore();
  const { itemsCount, memorizeTimeMs, rounds, multiplier } = config;

  const [phase, setPhase] = useState<'memorize' | 'question' | 'feedback' | 'finished'>('memorize');
  const [currentRound, setCurrentRound] = useState(1);
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef(Date.now());
  const correctCountRef = useRef(0);

  useEffect(() => {
    startRound();
  }, [currentRound]);

  const startRound = () => {
    const newItems: SceneItem[] = [];
    for (let i = 0; i < itemsCount; i++) {
        const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const col = i % 3;
        const row = Math.floor(i / 3);
        
        newItems.push({
            iconId: icon.id,
            colorId: color.id,
            x: col, 
            y: row,
            rotation: Math.floor(Math.random() * 4) * 45
        });
    }
    setSceneItems(newItems);
    setPhase('memorize');
    setTimeLeft(memorizeTimeMs / 1000);
    setFeedback(null);
    setQuestion(null);

    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 0.1) {
                clearInterval(timer);
                generateQuestion(newItems);
                return 0;
            }
            return prev - 0.1;
        });
    }, 100);
  };

  const generateQuestion = (items: SceneItem[]) => {
      const type = Math.random() < 0.5 ? 'presence' : 'color';
      let q: Question;

      if (type === 'presence') {
          const target = items[Math.floor(Math.random() * items.length)];
          const targetDef = ICONS.find(i => i.id === target.iconId)!;
          const distractors = ICONS.filter(i => !items.some(item => item.iconId === i.id));
          const optionsPool = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
          const allOptions = [targetDef, ...optionsPool];
          for (let i = allOptions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
          }
          q = {
              text: "¿Cuál de estos objetos estaba en la imagen?",
              options: allOptions.map(o => o.label),
              correctIndex: allOptions.findIndex(o => o.id === targetDef.id)
          };
      } else {
          const target = items[Math.floor(Math.random() * items.length)];
          const targetIconDef = ICONS.find(i => i.id === target.iconId)!;
          const targetColorDef = COLORS.find(c => c.id === target.colorId)!;
          const options = COLORS.map(c => c.label).slice(0, 4);
          if(!options.includes(targetColorDef.label)) options[Math.floor(Math.random() * 4)] = targetColorDef.label;
          q = {
              text: `¿De qué color era el objeto: ${targetIconDef.label}?`,
              options: options,
              correctIndex: options.indexOf(targetColorDef.label)
          };
      }
      setQuestion(q);
      setPhase('question');
  };

  const handleAnswer = (index: number) => {
      if (phase !== 'question') return;
      const isCorrect = index === question?.correctIndex;
      if (isCorrect) {
          const points = Math.round(100 * multiplier);
          setScore(s => s + points);
          correctCountRef.current += 1;
          setFeedback('correct');
          triggerSuccess();
      } else {
          setFeedback('wrong');
      }
      setPhase('feedback');
      setTimeout(() => {
          if (currentRound >= rounds) {
              finishGame();
          } else {
              setCurrentRound(r => r + 1);
          }
      }, 1500);
  };

  const finishGame = () => {
    const accuracy = correctCountRef.current / rounds;
    const result: GameResult = {
      gameId: 'snapshot',
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
        <div className="text-sm font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">RONDA {currentRound}/{rounds}</div>
        <div className="text-xl font-bold text-primary dark:text-indigo-400">{score}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {phase === 'memorize' && (
            <div className="relative w-full max-w-sm aspect-square bg-white dark:bg-neutral-900 rounded-3xl shadow-lg border border-slate-200 dark:border-neutral-800 overflow-hidden grid grid-cols-3 grid-rows-4 p-4 gap-2 transition-colors">
                {sceneItems.map((item, i) => {
                    const IconDef = ICONS.find(def => def.id === item.iconId)!;
                    const ColorDef = COLORS.find(def => def.id === item.colorId)!;
                    const Icon = IconDef.Icon;
                    return (
                        <div key={i} className="flex items-center justify-center">
                            <Icon 
                                size={32} 
                                className={`${ColorDef.class} drop-shadow-sm transform transition-all animate-in zoom-in duration-300`} 
                                strokeWidth={2.5}
                            />
                        </div>
                    );
                })}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                    {Math.ceil(timeLeft)}s
                </div>
            </div>
        )}

        {(phase === 'question' || phase === 'feedback') && question && (
             <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 text-center transition-colors">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                        {question.text}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {question.options.map((opt, i) => {
                         let btnClass = "bg-white dark:bg-[#0a0a0a] border-2 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-neutral-700";
                         if (phase === 'feedback') {
                             if (i === question.correctIndex) btnClass = "bg-green-100 dark:bg-green-950/40 border-green-500 text-green-700 dark:text-green-400 font-bold";
                             else if (i !== question.correctIndex && feedback === 'wrong') btnClass = "opacity-50 border-slate-100 dark:border-neutral-900";
                         }
                         return (
                            <button
                                key={i}
                                disabled={phase === 'feedback'}
                                onClick={() => handleAnswer(i)}
                                className={`p-4 rounded-2xl text-lg font-bold transition-all active:scale-98 ${btnClass}`}
                            >
                                {opt}
                            </button>
                         )
                    })}
                </div>
                
                {phase === 'feedback' && (
                    <div className={`text-center font-black text-xl animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                        {feedback === 'correct' ? '¡Muy bien!' : '¡Oops! Incorrecto'}
                    </div>
                )}
             </div>
        )}
      </div>
    </div>
  );
};
