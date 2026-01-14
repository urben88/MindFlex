import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { aiService } from '../services/aiService';
import { ttsService } from '../services/ttsService';
import { ExerciseContent } from '../types';
import { 
    Loader2, Volume2, Play, CheckCircle2, Lightbulb, 
    Timer, Eye, EyeOff, Edit3, ArrowRight, X
} from 'lucide-react';

export const ExerciseSession: React.FC = () => {
    const { activeExercise, navigate } = useStore();
    const [content, setContent] = useState<ExerciseContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeExercise) {
            setLoading(true);
            aiService.generateExerciseContent(activeExercise).then(data => {
                setContent(data);
                setLoading(false);
            });
        }
        return () => ttsService.cancel();
    }, [activeExercise]);

    if (!activeExercise) return null;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-black relative transition-colors">
            {/* Header */}
            <div className="px-6 py-4 bg-white dark:bg-[#0a0a0a] border-b border-slate-100 dark:border-neutral-800 sticky top-0 z-20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{activeExercise.title}</h2>
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mt-1 inline-block">
                            {activeExercise.type}
                        </span>
                    </div>
                    <button 
                        onClick={() => navigate('exercises')}
                        className="p-2 -mr-2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300 active:bg-slate-100 dark:active:bg-neutral-800 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">{activeExercise.description}</p>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
                        <Loader2 className="animate-spin text-primary dark:text-indigo-400" size={40} />
                        <p className="font-medium animate-pulse text-slate-600 dark:text-neutral-500">Diseñando ejercicio a medida...</p>
                    </div>
                ) : content ? (
                    <InteractiveRenderer content={content} onComplete={() => navigate('exercises')} />
                ) : (
                    <div className="text-center text-red-400">Error al cargar contenido.</div>
                )}
            </div>
        </div>
    );
};

const InteractiveRenderer: React.FC<{ content: ExerciseContent; onComplete: () => void }> = ({ content, onComplete }) => {
    const [step, setStep] = useState(0);
    const [showExample, setShowExample] = useState(false);
    
    const renderMechanic = () => {
        switch (content.mechanic) {
            case 'timer': return <TimerMechanic content={content} />;
            case 'input': return <InputMechanic content={content} />;
            case 'flip': return <FlipMechanic content={content} />;
            case 'audio_list': return <AudioMechanic content={content} />;
            default: return <TimerMechanic content={content} />;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-indigo-500/10 flex items-center justify-center text-primary dark:text-indigo-400">
                        <Lightbulb size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Misión</h3>
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {content.instruction}
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-900">
                    <button 
                        onClick={() => setShowExample(!showExample)}
                        className="text-sm font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-2 transition-colors"
                    >
                        {showExample ? 'Ocultar Idea' : '¿Necesitas una idea?'}
                    </button>
                    {showExample && (
                        <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-indigo-800 dark:text-indigo-300 text-sm italic animate-in fade-in slide-in-from-top-2">
                            "{content.example}"
                        </div>
                    )}
                </div>
            </div>

            {renderMechanic()}

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest px-1">Pasos Clave</h4>
                {content.steps.map((s, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl transition-all ${step >= i ? 'bg-white dark:bg-[#0a0a0a] border-l-4 border-green-500 shadow-sm' : 'bg-slate-100 dark:bg-neutral-900 opacity-60'}`}>
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= i ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-300 text-slate-500'}`}>
                            {i + 1}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                    </div>
                ))}
            </div>

            <button 
                onClick={onComplete}
                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-8"
            >
                <span>Completar Entrenamiento</span>
                <CheckCircle2 size={20} />
            </button>
        </div>
    );
};

const TimerMechanic: React.FC<{ content: ExerciseContent }> = ({ content }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: number;
        if (isActive && timeLeft !== null && timeLeft > 0) {
            interval = window.setInterval(() => setTimeLeft(t => (t ? t - 1 : 0)), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            ttsService.speak("Tiempo terminado. Revisa tu visualización.", 1.0);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startTimer = (seconds: number) => {
        setTimeLeft(seconds);
        setIsActive(true);
    };

    return (
        <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border-2 border-slate-100 dark:border-neutral-800 text-center space-y-6 transition-colors">
            <div className="text-4xl font-black text-slate-800 dark:text-indigo-400 font-mono">
                {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : '00:00'}
            </div>
            <div className="flex gap-3 justify-center">
                {[30, 60, 120].map(s => (
                    <button key={s} onClick={() => startTimer(s)} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                        {s >= 60 ? `${s/60}m` : `${s}s`}
                    </button>
                ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-neutral-500">
                Usa el temporizador para mantener la imagen de: <br/>
                <span className="font-bold text-slate-800 dark:text-slate-200">{content.items.join(", ")}</span>
            </p>
        </div>
    );
};

const InputMechanic: React.FC<{ content: ExerciseContent }> = ({ content }) => {
    const [input, setInput] = useState('');
    return (
        <div className="space-y-4">
            <div className="flex justify-center gap-4 flex-wrap">
                {content.items.map((item, i) => (
                    <div key={i} className="bg-white dark:bg-[#0a0a0a] px-6 py-4 rounded-2xl shadow-sm border-b-4 border-indigo-100 dark:border-indigo-900/50 font-bold text-lg text-slate-700 dark:text-slate-200 transition-colors">
                        {item}
                    </div>
                ))}
            </div>
            <div className="relative">
                <Edit3 className="absolute top-4 left-4 text-slate-400 dark:text-neutral-600" size={20} />
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu asociación creativa aquí..."
                    className="w-full h-32 pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-neutral-800 focus:border-primary focus:ring-0 resize-none bg-white dark:bg-[#0a0a0a] dark:text-slate-100 transition-colors"
                />
            </div>
        </div>
    );
};

const AudioMechanic: React.FC<{ content: ExerciseContent }> = ({ content }) => {
    const [playing, setPlaying] = useState(false);
    const [hidden, setHidden] = useState(false);
    const playList = async () => {
        setPlaying(true);
        for (const item of content.items) {
            await new Promise<void>(resolve => {
                ttsService.speak(item, 0.9, () => { setTimeout(resolve, 800); }, true);
            });
        }
        setPlaying(false);
        setHidden(true);
    };
    return (
        <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 text-center transition-colors">
            <div className={`transition-all duration-500 ${hidden ? 'blur-lg select-none opacity-20' : ''} mb-8`}>
                <div className="flex flex-wrap justify-center gap-2">
                    {content.items.map((item, i) => (
                        <span key={i} className="bg-slate-100 dark:bg-neutral-900 px-3 py-1 rounded-lg text-slate-600 dark:text-neutral-400 font-medium transition-colors">{item}</span>
                    ))}
                </div>
            </div>
            <button 
                onClick={playList}
                disabled={playing}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${playing ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-300 scale-95' : 'bg-primary dark:bg-indigo-600 text-white shadow-xl hover:scale-105'}`}
            >
                {playing ? <Volume2 className="animate-pulse" size={32} /> : <Play size={32} fill="currentColor" />}
            </button>
            <p className="mt-4 text-sm text-slate-500 dark:text-neutral-500 font-medium">
                {playing ? 'Escuchando...' : hidden ? '¡Ahora recítalas!' : 'Pulsa para escuchar y memorizar'}
            </p>
            {hidden && (
                <button onClick={() => setHidden(false)} className="mt-4 text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wide">
                    Revelar Texto
                </button>
            )}
        </div>
    );
};

const FlipMechanic: React.FC<{ content: ExerciseContent }> = ({ content }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="perspective-1000 h-64 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#0a0a0a] rounded-3xl border-2 border-slate-100 dark:border-neutral-800 shadow-sm flex flex-col items-center justify-center p-8 transition-colors">
                    <Eye size={48} className="text-indigo-500 dark:text-indigo-400 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Desafío Visual</h3>
                    <p className="text-slate-500 dark:text-neutral-400 text-center">
                        Busca en tu entorno: <br/>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{content.items.join(" + ")}</span>
                    </p>
                    <div className="mt-6 text-xs text-slate-400 dark:text-neutral-600 font-bold uppercase tracking-widest flex items-center gap-2">
                        Toca para evaluar <ArrowRight size={12} />
                    </div>
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 dark:bg-indigo-950 rounded-3xl text-white flex flex-col items-center justify-center p-8 transition-colors">
                    <EyeOff size={48} className="text-emerald-400 mb-4" />
                    <h3 className="text-xl font-bold mb-4">Cierra los Ojos</h3>
                    <p className="text-slate-300 text-center leading-relaxed">
                        Visualiza dónde están esos objetos y descríbelos en voz alta con detalle.
                    </p>
                </div>
            </div>
        </div>
    );
};