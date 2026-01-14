import React from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';
import { GAME_DEFINITIONS } from '../constants';
import { DifficultyLevel } from '../types';

interface Props {
  children: React.ReactNode;
  difficulty: DifficultyLevel;
}

export const ActiveGameLayout: React.FC<Props> = ({ children, difficulty }) => {
  const { activeGameId, exitGame } = useStore();

  const handleExit = () => {
    exitGame();
  };

  const gameInfo = activeGameId ? GAME_DEFINITIONS[activeGameId] : { title: 'Juego' };

  const diffColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  const diffLabels = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black relative transition-colors">
      {/* Game Header */}
      <div className="bg-white dark:bg-[#0a0a0a] px-4 py-3 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between shadow-sm z-50 sticky top-0 transition-colors">
        <button 
          type="button"
          onClick={handleExit}
          className="p-2 -ml-2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300 active:bg-slate-100 dark:active:bg-neutral-800 rounded-full transition-colors cursor-pointer"
          aria-label="Salir del juego"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-slate-800 dark:text-slate-100 leading-none">{gameInfo.title}</h1>
        </div>

        <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${diffColors[difficulty]}`}>
          {diffLabels[difficulty]}
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};