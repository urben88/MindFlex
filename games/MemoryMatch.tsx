
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, MemoryConfig, DifficultyLevel } from '../types';
import {
  Ghost, Heart, Star, Moon, Sun, Cloud, Snowflake,
  Anchor, Coffee, Music, Camera, Zap, Umbrella, Key,
  Gift, Bell, Crown, Diamond, Brain, Eye
} from 'lucide-react';

interface Props {
  config: MemoryConfig;
  difficulty: DifficultyLevel;
}

interface Card {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = [
  Ghost, Heart, Star, Moon, Sun, Cloud, Snowflake,
  Anchor, Coffee, Music, Camera, Zap, Umbrella, Key,
  Gift, Bell, Crown, Diamond
];

export const MemoryMatchGame: React.FC<Props> = ({ config, difficulty }) => {
  const { completeGame, triggerSuccess } = useStore();
  const { pairCount, previewTimeMs, multiplier } = config;

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(true);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<number | undefined>(undefined);
  const previewTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current !== undefined) clearInterval(timerRef.current);
      if (previewTimeoutRef.current !== undefined) clearTimeout(previewTimeoutRef.current);
    };
  }, [config, difficulty]);

  const initGame = () => {
    if (previewTimeoutRef.current !== undefined) clearTimeout(previewTimeoutRef.current);
    const selectedIcons = ICONS.slice(0, pairCount);
    const deck: Card[] = [];
    selectedIcons.forEach((_, index) => {
      deck.push({ id: index * 2, iconIndex: index, isFlipped: true, isMatched: false });
      deck.push({ id: index * 2 + 1, iconIndex: index, isFlipped: true, isMatched: false });
    });
    
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const shouldPreview = previewTimeMs > 0;
    setCards(deck.map(c => ({ ...c, isFlipped: shouldPreview })));
    setFlippedIndices([]);
    setScore(0);
    setMoves(0);
    setIsLocked(false);
    setIsPreviewing(shouldPreview);
    
    startTimeRef.current = Date.now();

    if (shouldPreview) {
      previewTimeoutRef.current = window.setTimeout(() => {
        setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
        setIsPreviewing(false);
        startTimeRef.current = Date.now();
      }, previewTimeMs);
    }
  };

  const handleCardClick = (index: number) => {
    if (isLocked || isPreviewing || cards[index].isFlipped || cards[index].isMatched) return;
    
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    
    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);
      checkForMatch(newFlipped[0], newFlipped[1]);
    }
  };

  const checkForMatch = (idx1: number, idx2: number) => {
    const isMatch = cards[idx1].iconIndex === cards[idx2].iconIndex;
    
    if (isMatch) {
      const points = Math.round(100 * multiplier);
      setScore(s => s + points);
      
      setTimeout(() => {
        const newCards = [...cards];
        newCards[idx1].isMatched = true;
        newCards[idx2].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setIsLocked(false);
        triggerSuccess();
        
        if (newCards.every(c => c.isMatched)) {
          finishGame(newCards.length / 2, moves + 1, score + points);
        }
      }, 500);
    } else {
      setScore(s => Math.max(0, s - Math.round(10 * multiplier)));
      setTimeout(() => {
        const newCards = [...cards];
        newCards[idx1].isFlipped = false;
        newCards[idx2].isFlipped = false;
        setCards(newCards);
        setFlippedIndices([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  const finishGame = (totalPairs: number, totalMoves: number, finalScore: number) => {
    const accuracy = totalPairs / totalMoves;
    const result: GameResult = {
      gameId: 'memory',
      score: finalScore,
      accuracy,
      maxLevel: 1,
      durationSeconds: (Date.now() - startTimeRef.current) / 1000,
      timestamp: Date.now(),
      difficulty
    };
    setTimeout(() => completeGame(result), 800);
  };

  const getGridConfig = () => {
    const count = cards.length;
    if (count <= 12) return { cols: 'grid-cols-3', gap: 'gap-3', iconSize: 'w-2/3' };
    if (count <= 20) return { cols: 'grid-cols-4', gap: 'gap-2', iconSize: 'w-1/2' };
    return { cols: 'grid-cols-4', gap: 'gap-2', iconSize: 'w-1/2' };
  };

  const gridConfig = getGridConfig();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black transition-colors overflow-hidden">
      {/* HUD Superior */}
      <div className="flex justify-between items-center px-6 py-4 shrink-0">
        <div className="flex flex-col">
            <div className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5">Progreso</div>
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {cards.filter(c => c.isMatched).length / 2} / {pairCount} PARES
            </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5">Puntos</div>
            <div className="text-xl font-black text-slate-800 dark:text-white">{score}</div>
        </div>
      </div>

      {/* Tablero de Juego */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <div className={`grid ${gridConfig.gap} w-full max-w-sm max-h-full mx-auto ${gridConfig.cols}`}>
          {cards.map((card, index) => {
            const Icon = ICONS[card.iconIndex];
            const isFlipped = card.isFlipped || card.isMatched;

            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`perspective-1000 aspect-[1/1.2] cursor-pointer group relative ${card.isMatched ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'} transition-all duration-500`}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* Reverso de la carta (Frente cuando está tapada) */}
                  <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#0a0a0a] rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-neutral-800 shadow-sm flex items-center justify-center transition-colors">
                     <div className="w-full h-full m-1 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                        <Brain className="text-slate-300 dark:text-neutral-700 w-1/2 h-1/2" />
                     </div>
                  </div>

                  {/* Anverso de la carta (Icono revelado) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border-2 border-primary dark:border-indigo-500 shadow-lg flex flex-col items-center justify-center p-2">
                    <Icon 
                        className={`text-primary dark:text-indigo-400 h-auto ${gridConfig.iconSize} animate-in zoom-in duration-300`} 
                        strokeWidth={2.5} 
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Pantalla de vista previa */}
      {isPreviewing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm pointer-events-none transition-all">
            <div className="bg-white dark:bg-neutral-900 px-8 py-4 rounded-[2rem] shadow-2xl border-2 border-primary/20 dark:border-indigo-500/20 flex flex-col items-center gap-2">
                <Eye className="text-primary dark:text-indigo-400 animate-bounce" size={32} />
                <div className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-lg text-center">
                    Memoriza las posiciones
                </div>
            </div>
        </div>
      )}

      {/* Pie de página con info de movimientos */}
      <div className="p-4 sm:p-6 text-center shrink-0">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-neutral-900 rounded-full text-xs font-bold text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
            <Zap size={14} className="text-amber-500" />
            Movimientos: {moves}
         </div>
      </div>
    </div>
  );
};
