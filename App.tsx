
import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { GuideDetailsView } from './views/GuideDetailsView';
import { NBackGame } from './games/NBack';
import { StroopGame } from './games/Stroop';
import { SequenceGame } from './games/Sequence';
import { MemoryMatchGame } from './games/MemoryMatch';
import { SnapshotGame } from './games/Snapshot';
import { AudioNBackGame } from './games/AudioNBack';
import { EchoSequenceGame } from './games/EchoSequence';
import { StoryListenerGame } from './games/StoryListener';
import { ExerciseSession } from './components/ExerciseSession';
import { CasilleroView } from './views/CasilleroView';
import { DifficultySelector } from './components/DifficultySelector';
import { GameSummary } from './components/GameSummary';
import { ActiveGameLayout } from './components/ActiveGameLayout';
import { GAME_DEFINITIONS, EXERCISE_TEMPLATES, DIFFICULTY_CONFIGS } from './constants';
import { GameId, DifficultyLevel, AudioNBackConfig, EchoSequenceConfig, MemoryConfig, SnapshotConfig, StoryListenerConfig } from './types';
import { ArrowRight, Filter, SortAsc, Info, Volume2, Moon, Sun, Trash2 } from 'lucide-react';
import { GameIcon } from './components/GameIcon';

const PlaceholderGame: React.FC<{ name: string; difficulty: DifficultyLevel }> = ({ name, difficulty }) => {
    const { completeGame } = useStore();
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{name}</h2>
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-xs uppercase font-bold text-slate-500 dark:text-slate-300">{difficulty}</div>
            <p className="text-slate-500 dark:text-slate-300">Simulación de juego completada.</p>
            <button 
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
                onClick={() => completeGame({
                    gameId: 'snapshot', 
                    score: Math.floor(Math.random() * 1000),
                    accuracy: 0.85,
                    maxLevel: 3,
                    durationSeconds: 45,
                    timestamp: Date.now(),
                    difficulty
                })}
            >
                Terminar Demo
            </button>
        </div>
    )
}

const GameList: React.FC = () => {
    const { startGame } = useStore();
    return (
        <div className="space-y-6 pt-4">
            <h2 className="text-3xl font-black px-2 text-slate-800 dark:text-white">Juegos</h2>
            <div className="grid grid-cols-1 gap-4">
                {(Object.keys(GAME_DEFINITIONS) as GameId[]).map(id => {
                    const game = GAME_DEFINITIONS[id];
                    return (
                        <button 
                            key={id}
                            onClick={() => startGame(id)}
                            className="bg-white dark:bg-[#0a0a0a] p-4 rounded-3xl border border-slate-100 dark:border-neutral-800 shadow-sm flex items-center space-x-5 hover:shadow-md active:scale-[0.98] transition-all text-left relative overflow-hidden group"
                        >
                             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-neutral-900 rounded-full -mr-8 -mt-8 z-0 group-hover:bg-slate-100 dark:group-hover:bg-neutral-800 transition-colors" />
                            <div className="relative z-10">
                                <GameIcon iconName={game.iconName} colorClass={game.color} size="md" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight mb-1">{game.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-300 font-medium leading-snug">{game.description}</p>
                            </div>
                            <div className="relative z-10 text-slate-300 dark:text-neutral-600">
                                <ArrowRight size={20} />
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

const ExerciseList: React.FC = () => {
    const { startExercise } = useStore();
    const [filter, setFilter] = useState<string>('all');
    const [sort, setSort] = useState<'default' | 'difficulty'>('default');

    const categories = ['all', 'visualization', 'association', 'observation', 'auditory', 'encoding'];
    const categoryLabels: Record<string, string> = {
        all: 'Todos',
        visualization: 'Visual',
        association: 'Asociación',
        observation: 'Observación',
        auditory: 'Auditivo',
        encoding: 'Codificación'
    };

    const filtered = EXERCISE_TEMPLATES.filter(ex => filter === 'all' || ex.type === filter);
    const sorted = [...filtered].sort((a, b) => {
        if (sort === 'difficulty') {
            const levels = { 'Fácil': 1, 'Medio': 2, 'Difícil': 3 };
            return levels[a.difficulty] - levels[b.difficulty];
        }
        return 0; 
    });
    
    return (
        <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">Ejercicios</h2>
                <button 
                    onClick={() => setSort(s => s === 'default' ? 'difficulty' : 'default')}
                    className={`p-2 rounded-lg transition-colors ${sort === 'difficulty' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-slate-400 dark:text-neutral-500 hover:bg-slate-100 dark:hover:bg-neutral-900'}`}
                >
                    <SortAsc size={20} />
                </button>
            </div>

            <div className="flex overflow-x-auto gap-2 px-2 pb-2 hide-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                            filter === cat 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-white dark:bg-[#0a0a0a] text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-neutral-800'
                        }`}
                    >
                        {categoryLabels[cat]}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {sorted.map((ex: any) => (
                    <button
                        key={ex.id}
                        onClick={() => startExercise(ex)}
                        className="bg-white dark:bg-[#0a0a0a] p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 text-left hover:border-blue-300 dark:hover:border-indigo-500 transition-all shadow-sm active:scale-[0.98] group"
                    >
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-primary transition-colors">{ex.title}</h4>
                             <div className="flex items-center space-x-2">
                                {(ex.type === 'auditory' || ex.type === 'encoding') && <Volume2 size={16} className="text-blue-400" />}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    ex.difficulty === 'Fácil' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                    ex.difficulty === 'Medio' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                    'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
                                }`}>
                                    {ex.difficulty}
                                </span>
                             </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-300 mb-4 leading-snug">{ex.description}</p>
                        
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-neutral-900 p-2 rounded-lg">
                            <Info size={14} className="text-indigo-400 shrink-0" />
                            <p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium">
                                <span className="font-bold text-indigo-900/70 dark:text-indigo-300">Beneficio: </span>
                                {ex.benefits}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

const SettingsView: React.FC = () => {
    const { resetProgress, toggleDarkMode, cache } = useStore();
    const [confirming, setConfirming] = useState(false);
    const darkMode = cache.settings.darkMode;

    const handleReset = () => {
        if (confirming) {
            resetProgress();
            setConfirming(false);
        } else {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
        }
    };

    return (
        <div className="p-4 space-y-8 pt-6 bg-slate-50 dark:bg-black transition-colors min-h-full">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white px-2">Ajustes</h2>
            
            <div className="space-y-4">
                {/* Dark Mode Toggle */}
                <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-500 text-white' : 'bg-yellow-100 text-yellow-600'}`}>
                            {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Modo Oscuro</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-300">Reduce la fatiga visual</p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleDarkMode}
                        className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${darkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-neutral-800'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* Reset Progress */}
                <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Zona de Peligro</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-300">Borrar todo el progreso local</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleReset}
                        className={`w-full border-2 py-4 rounded-2xl font-bold transition-all duration-200 ${
                            confirming 
                            ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                            : 'border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                    >
                        {confirming ? '¿Estás seguro? Pulsa de nuevo' : 'Resetear Datos'}
                    </button>
                </div>
            </div>

             <div className="text-center text-xs text-slate-300 dark:text-neutral-600 pt-8">
                MindFlex v2.5 - AI & Dark Mode Powered
            </div>
        </div>
    )
}

const StatsView: React.FC = () => {
    const { cache } = useStore();
    return (
        <div className="pt-4 space-y-6">
            <h2 className="text-2xl font-bold px-2 dark:text-white">Estadísticas</h2>
            
            <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 border-b dark:border-neutral-800 pb-2">Historial Reciente</h3>
                {cache.history.length === 0 ? (
                    <p className="text-center text-slate-400 dark:text-slate-500 py-4">No hay datos aún.</p>
                ) : (
                    <div className="space-y-3">
                        {cache.history.slice(0, 10).map((h, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div>
                                    <span className="font-bold text-slate-700 dark:text-slate-100 capitalize block">{GAME_DEFINITIONS[h.gameId].title}</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-xs">{new Date(h.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-primary dark:text-indigo-400">{h.score} pts</div>
                                    <div className="flex items-center space-x-1 justify-end">
                                      {h.difficulty === 'hard' && <span className="w-2 h-2 rounded-full bg-red-400" title="Hard" />}
                                      {h.difficulty === 'medium' && <span className="w-2 h-2 rounded-full bg-blue-400" title="Medium" />}
                                      {h.difficulty === 'easy' && <span className="w-2 h-2 rounded-full bg-green-400" title="Easy" />}
                                      <span className="text-xs text-slate-500 dark:text-slate-300">{Math.round(h.accuracy * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const ActiveGameWrapper: React.FC = () => {
    const { activeGameId, navigate } = useStore();
    const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);

    useEffect(() => {
        setDifficulty(null);
    }, [activeGameId]);

    if (!activeGameId) return null;

    if (!difficulty) {
        return (
            <DifficultySelector 
                gameTitle={GAME_DEFINITIONS[activeGameId].title}
                gameId={activeGameId}
                onSelect={setDifficulty}
                onBack={() => navigate('games')}
            />
        );
    }

    const config = DIFFICULTY_CONFIGS[activeGameId][difficulty];
    
    const renderGame = () => {
        switch (activeGameId) {
            case 'nback': return <NBackGame config={config as any} difficulty={difficulty} />;
            case 'audio-nback': return <AudioNBackGame config={config as AudioNBackConfig} difficulty={difficulty} />;
            case 'stroop': return <StroopGame config={config as any} difficulty={difficulty} />;
            case 'sequence': return <SequenceGame config={config as any} difficulty={difficulty} />;
            case 'echo-sequence': return <EchoSequenceGame config={config as EchoSequenceConfig} difficulty={difficulty} />;
            case 'memory': return <MemoryMatchGame config={config as MemoryConfig} difficulty={difficulty} />;
            case 'snapshot': return <SnapshotGame config={config as SnapshotConfig} difficulty={difficulty} />;
            case 'story-listener': return <StoryListenerGame config={config as StoryListenerConfig} difficulty={difficulty} />;
            default: return <PlaceholderGame name={GAME_DEFINITIONS[activeGameId].title} difficulty={difficulty} />;
        }
    };

    return (
        <ActiveGameLayout difficulty={difficulty}>
            {renderGame()}
        </ActiveGameLayout>
    );
}

export default function App() {
  const { view, init, cache } = useStore();

  useEffect(() => {
    console.log('MindFlex: Iniciando aplicación...');
    init();
  }, []);

  // Sync Dark Mode class
  useEffect(() => {
    if (cache.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [cache.settings.darkMode]);

  const renderView = () => {
    switch (view) {
      case 'home': return <Home />;
      case 'games': return <GameList />;
      case 'exercises': return <ExerciseList />;
      case 'stats': return <StatsView />;
      case 'settings': return <SettingsView />;
      case 'active_game': return <ActiveGameWrapper />;
      case 'active_exercise': return <ExerciseSession />;
      case 'game_summary': return <GameSummary />;
      case 'guide_details': return <GuideDetailsView />;
      case 'casillero': return <CasilleroView />;
      default: return <Home />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
}
