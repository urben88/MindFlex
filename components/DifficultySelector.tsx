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
      color: 'bg-green-100 text-green-700 border-green-200', 
      desc: 'Velocidad baja, ideal para aprender la mecánica.' 
    },
    { 
      id: 'medium', 
      label: 'Estándar', 
      icon: Zap, 
      color: 'bg-blue-100 text-blue-700 border-blue-200', 
      desc: 'El equilibrio perfecto entre reto y habilidad.' 
    },
    { 
      id: 'hard', 
      label: 'Intenso', 
      icon: Flame, 
      color: 'bg-orange-100 text-orange-700 border-orange-200', 
      desc: 'Alta velocidad y complejidad. Solo expertos.' 
    },
  ];

  return (
    <div className="flex flex-col h-full p-6 bg-white overflow-y-auto">
      <div className="mb-4">
        <button onClick={onBack} className="text-slate-400 text-sm mb-4 font-medium hover:text-slate-600 transition-colors">← Volver</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-1">{gameTitle}</h2>
        <p className="text-slate-500">{definition?.description}</p>
      </div>

      {/* Scientific Context Card */}
      {definition?.science && (
        <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
                <BookOpen size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wide">¿Por qué funciona?</h3>
            </div>
            <p className="text-indigo-900/80 text-sm leading-relaxed">
                {definition.science}
            </p>
        </div>
      )}

      <div className="flex-1 space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Selecciona Dificultad</h3>
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-start space-x-4 ${level.color} hover:shadow-md border-transparent hover:border-current`}
            >
              <div className={`p-2.5 rounded-xl bg-white/60 shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">{level.label}</h3>
                <p className="text-xs opacity-80 leading-snug mt-1">{level.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};