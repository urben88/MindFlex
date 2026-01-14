
import React, { useState } from 'react';
import { DifficultyLevel, GameId, GameConfig } from '../types';
import { Zap, Shield, Flame, BookOpen, Settings2, Play } from 'lucide-react';
import { GAME_DEFINITIONS, DIFFICULTY_CONFIGS } from '../constants';

interface Props {
  gameTitle: string;
  gameId: GameId;
  onSelect: (level: DifficultyLevel, customConfig?: GameConfig) => void;
  onBack: () => void;
}

export const DifficultySelector: React.FC<Props> = ({ gameTitle, gameId, onSelect, onBack }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customParams, setCustomParams] = useState<any>(() => {
    // Initialize with medium defaults
    return { ...DIFFICULTY_CONFIGS[gameId].medium };
  });

  const definition = GAME_DEFINITIONS[gameId];

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

  const updateParam = (key: string, val: number | string) => {
    setCustomParams((prev: any) => ({ ...prev, [key]: val }));
  };

  const renderCustomControls = () => {
    switch (gameId) {
      case 'nback':
      case 'audio-nback':
        return (
          <>
            <CustomSlider label={`Memoria N (${customParams.n})`} min={1} max={5} step={1} value={customParams.n} onChange={(v) => updateParam('n', v)} />
            <CustomSlider label={`Velocidad (${customParams.speedMs}ms)`} min={500} max={5000} step={100} value={customParams.speedMs} onChange={(v) => updateParam('speedMs', v)} />
            <CustomSlider label={`Turnos (${customParams.totalTurns})`} min={5} max={50} step={5} value={customParams.totalTurns} onChange={(v) => updateParam('totalTurns', v)} />
          </>
        );
      case 'sequence':
      case 'echo-sequence':
        return (
          <>
            <CustomSlider label={`Longitud Inicial (${customParams.startLength})`} min={2} max={10} step={1} value={customParams.startLength} onChange={(v) => updateParam('startLength', v)} />
            {gameId === 'sequence' ? (
                <CustomSlider label={`Tiempo Vista (${customParams.displayTimeMs}ms)`} min={200} max={3000} step={100} value={customParams.displayTimeMs} onChange={(v) => updateParam('displayTimeMs', v)} />
            ) : (
                <CustomSlider label={`Velocidad Voz (${customParams.speechRate})`} min={0.5} max={2.0} step={0.1} value={customParams.speechRate} onChange={(v) => updateParam('speechRate', v)} />
            )}
          </>
        );
      case 'memory':
        return (
          <>
            <CustomSlider label={`Pares (${customParams.pairCount})`} min={4} max={18} step={1} value={customParams.pairCount} onChange={(v) => updateParam('pairCount', v)} />
            <CustomSlider label={`Vista Previa (${customParams.previewTimeMs}ms)`} min={0} max={10000} step={500} value={customParams.previewTimeMs} onChange={(v) => updateParam('previewTimeMs', v)} />
          </>
        );
      case 'stroop':
        return (
          <>
            <CustomSlider label={`Tiempo (${customParams.timeLimit}s)`} min={10} max={120} step={5} value={customParams.timeLimit} onChange={(v) => updateParam('timeLimit', v)} />
            <CustomSlider label={`Conflicto (${Math.round(customParams.conflictProbability * 100)}%)`} min={0} max={1} step={0.1} value={customParams.conflictProbability} onChange={(v) => updateParam('conflictProbability', v)} />
          </>
        );
      case 'snapshot':
        return (
          <>
            <CustomSlider label={`Objetos (${customParams.itemsCount})`} min={3} max={15} step={1} value={customParams.itemsCount} onChange={(v) => updateParam('itemsCount', v)} />
            <CustomSlider label={`Memorización (${customParams.memorizeTimeMs}ms)`} min={1000} max={10000} step={500} value={customParams.memorizeTimeMs} onChange={(v) => updateParam('memorizeTimeMs', v)} />
            <CustomSlider label={`Rondas (${customParams.rounds})`} min={3} max={20} step={1} value={customParams.rounds} onChange={(v) => updateParam('rounds', v)} />
          </>
        );
      default:
        return <p className="text-slate-400 text-xs italic">Este juego no tiene parámetros personalizables.</p>;
    }
  };

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-black overflow-y-auto hide-scrollbar transition-colors">
      <div className="mb-4">
        <button onClick={onBack} className="text-slate-400 dark:text-slate-500 text-sm mb-4 font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors">← Volver</button>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{gameTitle}</h2>
        <p className="text-slate-500 dark:text-slate-300">{definition?.description}</p>
      </div>

      {!showCustom && definition?.science && (
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
        {!showCustom ? (
          <>
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
            
            <button
              onClick={() => setShowCustom(true)}
              className="w-full p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#0a0a0a] text-slate-600 dark:text-slate-300 text-left transition-all active:scale-[0.98] flex items-center space-x-4 group hover:border-indigo-500"
            >
              <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <Settings2 size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">Personalizado</h3>
                <p className="text-xs opacity-60 mt-0.5">Define tus propios parámetros.</p>
              </div>
            </button>
          </>
        ) : (
          <div className="bg-slate-50 dark:bg-[#0a0a0a] p-6 rounded-[2.5rem] border border-slate-200 dark:border-neutral-800 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-4">
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-lg">Ajustes Pro</h3>
                <button onClick={() => setShowCustom(false)} className="text-xs font-bold text-indigo-500">Predefinidos</button>
            </div>
            
            <div className="space-y-6">
                {renderCustomControls()}
            </div>

            <button
                onClick={() => onSelect('custom', { ...customParams, multiplier: 1.2 })}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Play size={20} fill="currentColor" />
                JUGAR AHORA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomSlider: React.FC<{ label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }> = ({ label, min, max, step, value, onChange }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">{label}</label>
            <span className="text-xs font-bold text-indigo-500">{value}</span>
        </div>
        <input 
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
    </div>
);
