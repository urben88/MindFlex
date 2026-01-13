
import React from 'react';
import { useStore } from '../store/useStore';
import { Play, Sparkles, Flame, Trophy, ArrowRight, BookOpen } from 'lucide-react';
import { GameStats } from '../types';
import { GUIDE_PACKS } from '../constants';
import { GameIcon } from '../components/GameIcon';

export const Home: React.FC = () => {
  const { cache, getRecommendation, startGame, openGuide, navigate } = useStore();
  const { dailyStreak, gameStats } = cache;

  const handleSuggest = () => {
    const rec = getRecommendation();
    startGame(rec.game);
  };

  const totalPlays = (Object.values(gameStats) as GameStats[]).reduce((acc, curr) => acc + curr.plays, 0);

  return (
    <div className="space-y-8 pt-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center space-x-2 mb-1">
            <Flame size={20} className="text-orange-300" />
            <span className="text-sm font-medium opacity-90">Racha</span>
          </div>
          <div className="text-3xl font-bold">{dailyStreak} <span className="text-base font-normal opacity-80">días</span></div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
           <div className="flex items-center space-x-2 mb-1 text-slate-500">
            <Trophy size={20} className="text-yellow-500" />
            <span className="text-sm font-medium">Partidas</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{totalPlays}</div>
        </div>
      </div>

      {/* Main Action */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 shadow-xl text-center space-y-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
            <div className="mx-auto bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm border border-white/10">
                <Sparkles className="text-yellow-300" size={28} />
            </div>
            <h2 className="text-xl font-bold text-white">Entrenamiento Diario</h2>
            <p className="text-slate-300 text-sm">
            La IA ha seleccionado el mejor ejercicio para hoy basado en tu rendimiento.
            </p>
            <button
            onClick={handleSuggest}
            className="w-full bg-white text-indigo-900 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 mt-2"
            >
            <Play fill="currentColor" size={20} />
            <span>Empezar Ahora</span>
            </button>
        </div>
      </div>

      {/* Casillero Entry Point */}
      <button 
        onClick={() => navigate('casillero')}
        className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all hover:border-indigo-200"
      >
        <div className="flex items-center gap-4">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                <BookOpen size={24} />
            </div>
            <div className="text-left">
                <h3 className="font-bold text-slate-800 text-lg">Casillero Mental</h3>
                <p className="text-xs text-slate-500">Aprende la técnica (0-100)</p>
            </div>
        </div>
        <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </button>

      {/* Guide Packs */}
      <div>
        <h3 className="font-bold text-slate-800 text-lg mb-3 px-1">¿Qué quieres mejorar?</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4 px-1 snap-x">
            {GUIDE_PACKS.map(guide => (
                <button
                    key={guide.id}
                    onClick={() => openGuide(guide)}
                    className={`flex-none w-64 p-5 rounded-3xl bg-gradient-to-br ${guide.color} text-white shadow-lg snap-center text-left relative overflow-hidden group active:scale-95 transition-transform`}
                >
                     <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                        <GameIcon iconName={guide.iconName} colorClass="bg-white/20" size="lg" />
                     </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <h4 className="text-sm font-medium opacity-90 mb-1 uppercase tracking-wider">Pack Guía</h4>
                        <div className="font-black text-xl mb-2 leading-tight">{guide.question}</div>
                        <div className="mt-auto flex items-center text-sm font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                            <span>Ver Rutina</span>
                            <ArrowRight size={14} className="ml-1" />
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};
