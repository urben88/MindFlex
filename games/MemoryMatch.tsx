
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { GameResult, MemoryConfig, DifficultyLevel } from '../types';
import {
  Ghost, Heart, Star, Moon, Sun, Cloud, Snowflake,
  Anchor, Coffee, Music, Camera, Zap, Umbrella, Key,
  Gift, Bell, Crown, Diamond
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
  const { completeGame } = useStore();
  const { pairCount, previewTimeMs, multiplier } = config;

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(true);

  const startTimeRef = useRef(Date.now());
  // Fix: Initialize useRef hooks with undefined to fix 'Expected 1 arguments' error
  const timerRef = useRef<number | undefined>(undefined);
  const previewTimeoutRef = useRef<number | undefined>(undefined);

  // Reset game state whenever component mounts (including replay)
  useEffect(() => {
    initGame();
    return () => {
      // Fix: Check existence before clearing timers
      if (timerRef.current !== undefined) clearInterval(timerRef.current);
      if (previewTimeoutRef.current !== undefined) clearTimeout(previewTimeoutRef.current);
    };
  }, [config, difficulty]); // Re-run if config changes (e.g. diff selector could theoretically trigger this, though Wrapper handles it)

  const initGame = () => {
    // Clear any previous timeouts to be safe
    if (previewTimeoutRef.current !== undefined) clearTimeout(previewTimeoutRef.current);

    // Select icons
    const selectedIcons = ICONS.slice(0, pairCount);
    // Create pairs
    const deck: Card[] = [];
    selectedIcons.forEach((_, index) => {
      deck.push({ id: index * 2, iconIndex: index, isFlipped: true, isMatched: false });
      deck.push({ id: index * 2 + 1, iconIndex: index, isFlipped: true, isMatched: false });
    });
    
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Set initial state based on preview config
    const shouldPreview = previewTimeMs > 0;
    
    setCards(deck.map(c => ({ 
        ...c, 
        isFlipped: shouldPreview // If previewing, start flipped up
    })));
    
    setFlippedIndices([]);
    setScore(0);
    setMoves(0);
    setIsLocked(false);
    setIsPreviewing(shouldPreview);
    
    startTimeRef.current = Date.now();

    // Handle Preview Timeout
    if (shouldPreview) {
      previewTimeoutRef.current = window.setTimeout(() => {
        setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
        setIsPreviewing(false);
        startTimeRef.current = Date.now(); // Start tracking time after preview
      }, previewTimeMs);
    }
  };

  const handleCardClick = (index: number) => {
    if (isLocked || isPreviewing || cards[index].isFlipped || cards[index].isMatched) return;

    // Flip card
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
      
      const newCards = [...cards];
      newCards[idx1].isMatched = true;
      newCards[idx2].isMatched = true;
      setCards(newCards);
      setFlippedIndices([]);
      setIsLocked(false);

      // Check win condition
      if (newCards.every(c => c.isMatched)) {
        finishGame(newCards.length / 2, moves + 1, score + points);
      }
    } else {
      setScore(s => Math.max(0, s - Math.round(10 * multiplier))); // Penalty
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
    // Perfect game is totalPairs moves. Accuracy = totalPairs / totalMoves
    const accuracy = totalPairs / totalMoves;
    
    const result: GameResult = {
      gameId: 'memory',
      score: finalScore,
      accuracy,
      maxLevel: 1, // Memory doesn't have levels in this mode
      durationSeconds: (Date.now() - startTimeRef.current) / 1000,
      timestamp: Date.now(),
      difficulty
    };
    
    // Add small delay to show final match
    setTimeout(() => completeGame(result), 1000);
  };

  // Determine grid columns based on card count
  const getGridClass = () => {
    const count = cards.length;
    if (count <= 12) return 'grid-cols-3'; // 3x4
    if (count <= 20) return 'grid-cols-4'; // 4x5
    return 'grid-cols-5'; // 5x6
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex justify-between items-center p-4">
        <div className="text-sm font-bold text-slate-400">PARES: {cards.filter(c => c.isMatched).length / 2}/{pairCount}</div>
        <div className="text-xl font-bold text-primary">{score}</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className={`grid gap-3 w-full max-w-sm mx-auto ${getGridClass()}`}>
          {cards.map((card, index) => {
            const Icon = ICONS[card.iconIndex];
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={card.isMatched || isPreviewing}
                className={`
                  aspect-[3/4] rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 transform
                  ${card.isFlipped || card.isMatched ? 'rotate-y-180 bg-white border-2 border-primary' : 'bg-slate-200 border-2 border-slate-300'}
                  ${card.isMatched ? 'opacity-50' : 'opacity-100'}
                `}
              >
                {(card.isFlipped || card.isMatched) && (
                   <Icon className="text-primary w-1/2 h-1/2 animate-in zoom-in duration-200" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {isPreviewing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 pointer-events-none">
            <div className="bg-white px-6 py-2 rounded-full shadow-lg font-bold text-primary animate-pulse border-2 border-primary/20">
                Memoriza las cartas...
            </div>
        </div>
      )}
    </div>
  );
};
