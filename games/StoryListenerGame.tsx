
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, StoryListenerConfig, DifficultyLevel, StoryGameData } from '../types';
import { ttsService } from '../services/ttsService';
import { aiService } from '../services/aiService';
import { Radio, Play, Loader2, Sparkles, WifiOff } from 'lucide-react';

interface Props {
  config: StoryListenerConfig;
  difficulty: DifficultyLevel;
}

const FALLBACK_STORIES: StoryGameData[] = [
    {
        text: "En un pequeño pueblo costero, un viejo relojero llamado Elías reparaba un reloj de torre que no había funcionado en cincuenta años. Al dar las doce, en lugar de campanas, salieron burbujas de jabón que cubrieron toda la plaza. Los niños reían mientras los adultos recordaban que el tiempo no siempre tiene que ser serio.",
        question: "¿Qué salió del reloj al dar las doce?",
        options: ["Campanas de oro", "Burbujas de jabón", "Pájaros mecánicos", "Humo negro"],
        correctIndex: 1
    },
    {
        text: "María entrenaba cada mañana para el maratón. Un día encontró un perro abandonado que comenzó a correr con ella. Lo llamó 'Rayo'. En la carrera final, María no ganó el primer lugar, pero cruzó la meta con Rayo a su lado, recibiendo más aplausos que el ganador.",
        question: "¿Cuál fue el logro principal de María según el texto?",
        options: ["Ganar el primer lugar", "Encontrar un tesoro", "Cruzar la meta con su perro", "Romper un récord mundial"],
        correctIndex: 2
    }
];

export const StoryListenerGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame, triggerSuccess } = useStore();
  const { multiplier } = config;

  const [phase, setPhase] = useState<'intro' | 'loading' | 'listening' | 'question' | 'feedback'>('intro');
  const [currentStory, setCurrentStory] = useState<StoryGameData>(FALLBACK_STORIES[0]);
  const [score, setScore] = useState(0);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const startTimeRef = useRef(Date.now());
  const loadingTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
        ttsService.cancel();
        if (loadingTimeoutRef.current !== undefined) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  const loadStory = async () => {
    setPhase('loading');
    let hasLoaded = false;
    loadingTimeoutRef.current = window.setTimeout(() => {
        if (!hasLoaded) {
            useFallbackStory();
        }
    }, 5000);

    let story: StoryGameData | null = null;
    if (aiService.isAvailable()) {
        try {
            story = await aiService.generateStoryGame(difficulty);
        } catch (e) {}
    }

    hasLoaded = true;
    if (loadingTimeoutRef.current !== undefined) clearTimeout(loadingTimeoutRef.current);

    if (story) {
        setCurrentStory(story);
        setIsAiGenerated(true);
        startListening(story);
    } else {
        useFallbackStory();
    }
  };

  const useFallbackStory = () => {
    const fallback = FALLBACK_STORIES[Math.floor(Math.random() * FALLBACK_STORIES.length)];
    setCurrentStory(fallback);
    setIsAiGenerated(false);
    startListening(fallback);
  };

  const startListening = (story: StoryGameData) => {
    setPhase('listening');
    ttsService.speak(story.text, 1.0, () => {
        setPhase('question');
    }, true);
  };

  const handleAnswer = (index: number) => {
    const isCorrect = index === currentStory.correctIndex;
    if (isCorrect) {
        setScore(100 * multiplier);
        triggerSuccess();
        setTimeout(() => {
            finishGame(100 * multiplier, 1.0);
        }, 500);
    } else {
        setScore(0);
        setTimeout(() => {
            finishGame(0, 0);
        }, 1000);
    }
  };

  const finishGame = (finalScore: number, accuracy: number) => {
    const result: GameResult = {
      gameId: 'story-listener',
      score: finalScore,
      accuracy,
      maxLevel: 1,
      durationSeconds: (Date.now() - startTimeRef.current) / 1000,
      timestamp: Date.now(),
      difficulty
    };
    completeGame(result);
  };

  if (phase === 'intro') {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 bg-white dark:bg-black transition-colors">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-full relative">
                <Radio size={48} className="text-purple-600 dark:text-purple-400" />
                {aiService.isAvailable() && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1.5 border-2 border-white dark:border-neutral-900">
                        <Sparkles size={12} className="text-white" />
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Escucha Activa</h2>
                <p className="text-slate-500 dark:text-slate-300">
                    Escucha atentamente, visualiza los detalles y responde la pregunta final.
                </p>
            </div>
            <button 
                onClick={() => { startTimeRef.current = Date.now(); loadStory(); }}
                className="bg-primary dark:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-2 shadow-lg active:scale-95 transition-transform"
            >
                <Play fill="currentColor" />
                <span>Generar Historia</span>
            </button>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black p-6 transition-colors">
      <div className="flex-1 flex flex-col items-center justify-center">
        {phase === 'loading' && (
            <div className="flex flex-col items-center animate-pulse text-slate-400">
                <Loader2 className="animate-spin mb-2 text-primary" size={40} />
                <span className="font-bold text-slate-600 dark:text-slate-300">Creando historia...</span>
            </div>
        )}
        {phase === 'listening' && (
            <div className="flex flex-col items-center text-center space-y-6">
                 <div className="w-40 h-40 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center relative">
                     <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-ping opacity-20"></div>
                     <Radio size={56} className="text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <h3 className="text-xl font-black text-slate-700 dark:text-white">Escuchando...</h3>
                 <p className="text-sm text-slate-400 italic">Visualiza la escena en tu mente</p>
            </div>
        )}
        {phase === 'question' && (
             <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-neutral-800 text-center transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">
                        {currentStory.question}
                    </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {currentStory.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="bg-white dark:bg-[#0a0a0a] border-2 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-200 p-4 rounded-2xl text-left font-bold active:bg-indigo-50 dark:active:bg-indigo-900/40 active:border-indigo-200 transition-all"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
             </div>
        )}
      </div>
    </div>
  );
};
