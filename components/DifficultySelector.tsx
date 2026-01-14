
import React from 'react';
import { DifficultyLevel } from '../types';
import { Zap, Shield, Flame, Play, BookOpen } from 'lucide-react';
import { GAME_DEFINITIONS } from '../constants';

interface Props {
  gameTitle: string;
  gameId: string;
  onSelect: (level: DifficultyLevel) => void;
  onBack: () => void;
}

export const DifficultySelector: React.FC<Props> = ({ gameTitle, gameId, onSelect, onBack }) => {
  const definition = GAME_DEFINITIONS[gameId as keyof typeof GAME_DEFINITIONS];

  const levels: { id: DifficultyLevel; label: string; icon: any; color: string; desc: string }[] = [
    { 
      id: 'easy', 
      label: 'Relajado', 
      icon: Shield, 
      color: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30', 
      desc: 'Velocidad baja, ideal para aprender la mecánica.' 
    },
    { 
      id: 'medium', 
      label: 'Estándar', 
      icon: Zap, 
      color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30', 
      desc: 'El equilibrio perfecto entre reto y habilidad.' 
    },
    { 
      id: 'hard', 
      label: 'Intenso', 
      icon: Flame, 
      color: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30', 
      desc: 'Alta velocidad y complejidad. Solo expertos.' 
    },
  ];

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-black overflow-y-auto hide-scrollbar transition-colors">
      <div className="mb-4">
        <button onClick={onBack} className="text-slate-400 dark:text-slate-500 text-sm mb-4 font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors">← Volver</button>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{gameTitle}</h2>
        <p className="text-slate-500 dark:text-slate-300">{definition?.description}</p>
      </div>

      {definition?.science && (
        <div className="mb-6 bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400">
                <BookOpen size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wide">¿Por qué funciona?</h3>
            </div>
            <p className="text-indigo-900/80 dark:text-indigo-200 text-sm leading-relaxed">
                {definition.science}
            </p>
        </div>
      )}

      <div className="flex-1 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2">Dificultad</h3>
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`w-full p-5 rounded-3xl border text-left transition-all active:scale-[0.98] flex items-start space-x-4 ${level.color} hover:shadow-lg`}
            >
              <div className={`p-3 rounded-2xl bg-white dark:bg-black/40 shrink-0 transition-colors`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">{level.label}</h3>
                <p className="text-xs opacity-90 leading-snug mt-1">{level.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
