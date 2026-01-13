import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, BookOpen, Dumbbell, Gamepad2 } from 'lucide-react';
import { GAME_DEFINITIONS, EXERCISE_TEMPLATES } from '../constants';
import { GameIcon } from '../components/GameIcon';

export const GuideDetailsView: React.FC = () => {
  const { activeGuide, navigate, startGame, startExercise } = useStore();

  if (!activeGuide) {
    navigate('home');
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header - Increased padding bottom and z-index handling */}
      <div className={`bg-gradient-to-br ${activeGuide.color} text-white p-6 pb-16 rounded-b-[2.5rem] shadow-lg relative z-10`}>
        <button 
          onClick={() => navigate('home')}
          className="absolute top-4 left-4 p-2 bg-white/20 rounded-full backdrop-blur-sm active:bg-white/30 transition-colors z-20"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="mt-10 relative z-10">
            <div className="inline-block px-3 py-1 rounded-lg bg-black/20 text-xs font-bold uppercase tracking-widest mb-3">
                Pack de Entrenamiento
            </div>
            <h1 className="text-3xl font-black leading-tight mb-2 pr-4">{activeGuide.title}</h1>
            <p className="text-white/90 text-lg font-medium pr-4">{activeGuide.question}</p>
        </div>
        
        {/* Abstract Deco */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 -mt-10 pb-8 space-y-6 relative z-10">
        
        {/* Description & Science */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-4">
            <p className="text-slate-600 leading-relaxed font-medium">
                {activeGuide.description}
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
                    <BookOpen size={16} className="text-indigo-500" />
                    <span>La Ciencia detrás</span>
                </div>
                <p className="text-sm text-slate-500 italic leading-relaxed">
                    "{activeGuide.science}"
                </p>
            </div>
        </div>

        {/* Recommended Games */}
        <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Gamepad2 size={20} className="text-indigo-500" />
                Juegos Recomendados
            </h3>
            <div className="grid gap-3">
                {activeGuide.recommendedGames.map(gameId => {
                    const game = GAME_DEFINITIONS[gameId];
                    return (
                        <button
                            key={gameId}
                            onClick={() => startGame(gameId)}
                            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center text-left hover:border-indigo-200 active:scale-98 transition-all"
                        >
                            <GameIcon iconName={game.iconName} colorClass={game.color} size="sm" />
                            <div className="ml-4">
                                <div className="font-bold text-slate-700">{game.title}</div>
                                <div className="text-xs text-slate-400">{game.description}</div>
                            </div>
                            <div className="ml-auto bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                                Jugar
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Recommended Exercises */}
        <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Dumbbell size={20} className="text-emerald-500" />
                Ejercicios Prácticos
            </h3>
            <div className="grid gap-3">
                {activeGuide.recommendedExercises.map(exId => {
                    const ex = EXERCISE_TEMPLATES.find(e => e.id === exId);
                    if (!ex) return null;
                    return (
                        <button
                            key={exId}
                            onClick={() => startExercise(ex)}
                            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left hover:border-emerald-200 active:scale-98 transition-all"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-bold text-slate-700">{ex.title}</div>
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-2">{ex.description}</div>
                        </button>
                    )
                })}
            </div>
        </div>

      </div>
    </div>
  );
};