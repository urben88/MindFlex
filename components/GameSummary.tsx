import React from 'react';
import { useStore } from '../store/useStore';
import { GAME_DEFINITIONS } from '../constants';
import { Play, Home, Share2, Star } from 'lucide-react';
import { aiService } from '../services/aiService';

export const GameSummary: React.FC = () => {
  const { lastResult, cache, navigate, replayLastGame } = useStore();
  const [advice, setAdvice] = React.useState<string>('Analizando rendimiento...');

  React.useEffect(() => {
    if (lastResult) {
      const gameTitle = GAME_DEFINITIONS[lastResult.gameId].title;
      aiService.getFeedback(gameTitle, lastResult.score, lastResult.accuracy).then(setAdvice);
    }
  }, [lastResult]);

  if (!lastResult) return null;

  const gameDef = GAME_DEFINITIONS[lastResult.gameId];
  const stats = cache.gameStats[lastResult.gameId];
  const isNewRecord = lastResult.score >= stats.highScore && stats.plays > 1;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black overflow-y-auto hide-scrollbar transition-colors">
      {/* Header Visual */}
      <div className="bg-primary dark:bg-indigo-900 text-white pt-8 pb-24 px-6 text-center rounded-b-[3rem] shadow-lg relative overflow-hidden shrink-0 z-0 transition-colors">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />

        <h2 className="text-white/80 font-medium mb-2 uppercase tracking-widest text-xs">Sesión Finalizada</h2>
        <h1 className="text-3xl font-bold mb-6">{gameDef.title}</h1>
        
        <div className="relative inline-block mb-2">
          <span className="text-7xl font-black tracking-tighter drop-shadow-md">{lastResult.score}</span>
          {isNewRecord && (
            <div className="absolute -top-6 -right-12 rotate-12 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm animate-bounce">
              ¡RÉCORD!
            </div>
          )}
        </div>
        <p className="text-white/70 text-sm font-medium">Puntos Totales</p>
      </div>

      {/* Stats Cards */}
      <div className="flex-1 px-6 -mt-12 space-y-4 pb-8 relative z-10">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-neutral-800 flex justify-between items-center transition-colors">
            <div className="text-center flex-1 border-r border-slate-100 dark:border-neutral-900">
                <div className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold mb-1">Precisión</div>
                <div className={`text-2xl font-bold ${lastResult.accuracy > 0.8 ? 'text-green-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {Math.round(lastResult.accuracy * 100)}%
                </div>
            </div>
            <div className="text-center flex-1">
                 <div className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold mb-1">Nivel Máx</div>
                <div className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">
                    {lastResult.maxLevel}
                </div>
            </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm flex items-start space-x-3 transition-colors">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full shrink-0">
              <Star className="text-indigo-500 dark:text-indigo-400" size={18} fill="currentColor" />
            </div>
            <div>
                <p className="text-slate-600 dark:text-neutral-400 text-sm font-medium leading-relaxed italic">
                    "{advice}"
                </p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm transition-colors">
                <span className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold block mb-1">Dificultad</span>
                <div className="text-slate-700 dark:text-slate-300 font-bold capitalize text-lg">{lastResult.difficulty}</div>
            </div>
             <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm transition-colors">
                <span className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold block mb-1">Tiempo</span>
                <div className="text-slate-700 dark:text-slate-300 font-bold text-lg">{Math.round(lastResult.durationSeconds)}s</div>
            </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-neutral-800 mt-auto sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors">
        <div className="flex space-x-3 max-w-sm mx-auto">
            <button 
                onClick={() => navigate('games')}
                className="flex-1 py-4 rounded-2xl border-2 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 font-bold flex items-center justify-center space-x-2 active:bg-slate-50 dark:active:bg-neutral-800 transition-all"
            >
                <Home size={20} />
                <span>Menú</span>
            </button>
            <button 
                onClick={replayLastGame}
                className="flex-[2] py-4 rounded-2xl bg-primary dark:bg-indigo-600 text-white font-bold flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all"
            >
                <Play size={20} fill="currentColor" />
                <span>Repetir</span>
            </button>
        </div>
      </div>
    </div>
  );
};