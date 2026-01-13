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

// Possible shapes/icons
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
  x: number; // grid position or random percent
  y: number;
  rotation: number;
}

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export const SnapshotGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame } = useStore();
  const { itemsCount, memorizeTimeMs, rounds, multiplier } = config;

  const [phase, setPhase] = useState<'memorize' | 'question' | 'feedback' | 'finished'>('memorize');
  const [currentRound, setCurrentRound] = useState(1);
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Refs for tracking performance
  const startTimeRef = useRef(Date.now());
  const correctCountRef = useRef(0);

  useEffect(() => {
    startRound();
    // Cleanup interval usually handled inside effects or local timeouts
  }, [currentRound]);

  const startRound = () => {
    // Generate Scene
    const newItems: SceneItem[] = [];
    for (let i = 0; i < itemsCount; i++) {
        const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        // Ensure some variety in placement (simple grid-like logic or random)
        // Using random for "Snapshot" feel, but ensuring no total overlap would be better.
        // For simplicity: simple grid 3x4
        const col = i % 3;
        const row = Math.floor(i / 3);
        
        newItems.push({
            iconId: icon.id,
            colorId: color.id,
            x: col, 
            y: row,
            rotation: Math.floor(Math.random() * 4) * 45 // 0, 45, 90, etc
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
      // Logic to create a question about the items
      const type = Math.random() < 0.5 ? 'presence' : 'color';
      let q: Question;

      if (type === 'presence') {
          // "Which of these was in the picture?" or "Which was NOT?"
          // Let's go with "Which object was present?"
          const target = items[Math.floor(Math.random() * items.length)];
          const targetDef = ICONS.find(i => i.id === target.iconId)!;
          
          // Generate 3 distractors
          const distractors = ICONS.filter(i => !items.some(item => item.iconId === i.id));
          const optionsPool = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
          
          // Mix target into options
          const allOptions = [targetDef, ...optionsPool];
          // Shuffle options
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
          // Color question
          const target = items[Math.floor(Math.random() * items.length)];
          const targetIconDef = ICONS.find(i => i.id === target.iconId)!;
          const targetColorDef = COLORS.find(c => c.id === target.colorId)!;

          const options = COLORS.map(c => c.label).slice(0, 4); // Just take first 4 colors or shuffle
          // Ensure correct answer is in
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
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-sm font-bold text-slate-400">RONDA {currentRound}/{rounds}</div>
        <div className="text-xl font-bold text-primary">{score}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        {phase === 'memorize' && (
            <div className="relative w-full max-w-sm aspect-square bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden grid grid-cols-3 grid-rows-4 p-4 gap-2">
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
                
                {/* Timer Overlay */}
                <div className="absolute top-2 right-2 bg-slate-900/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {Math.ceil(timeLeft)}s
                </div>
            </div>
        )}

        {(phase === 'question' || phase === 'feedback') && question && (
             <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">
                        {question.text}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {question.options.map((opt, i) => {
                         let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300";
                         if (phase === 'feedback') {
                             if (i === question.correctIndex) btnClass = "bg-green-100 border-green-500 text-green-700 font-bold";
                             else if (i !== question.correctIndex && feedback === 'wrong') btnClass = "opacity-50 border-slate-100";
                         }

                         return (
                            <button
                                key={i}
                                disabled={phase === 'feedback'}
                                onClick={() => handleAnswer(i)}
                                className={`p-4 rounded-xl text-lg font-medium transition-all active:scale-98 ${btnClass}`}
                            >
                                {opt}
                            </button>
                         )
                    })}
                </div>
                
                {phase === 'feedback' && (
                    <div className={`text-center font-bold text-lg ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                        {feedback === 'correct' ? '¡Correcto!' : '¡Incorrecto!'}
                    </div>
                )}
             </div>
        )}

      </div>
    </div>
  );
};